import React from "react";
import BaseComponent from "../base-component";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import {assign, map} from "lodash";
import Pager from "../common/pager";
import FilterButtonGroup from "../common/filter-button-group";
import FormatedDate from "../common/formated-date";
import JobListDetails from "./job-list-details";
const navigate = require('react-mini-router').navigate;
const cx = require('classnames')

export default class JobDetails extends BaseComponent {

  constructor(props) {
    super(props);

    this.client = new JesqueAdminClient();

    this.state = {
      list: null,
      loading: false,
      total: -1,
      max: 25,
      currentPage: props.page,
      selectedJob: null
    };

    this.bindThiz('doUpdate', 'getMaxPages', 'changePage', 'resetToFirstPage', 'onMaxChange', 'selectJob', 'getTableHeaders');
  }

  componentDidMount() {
    this.startAutoUpdate();
    this.doUpdate()
  }

  componentWillUnmount() {
    this.stopAutoUpdate()
  }

  componentWillReceiveProps(props) {
    if (props.autoReload != this.props.autoReload) {
      if (props.autoReload) {
        this.doUpdate();
        this.startAutoUpdate()
      } else {
        this.stopAutoUpdate()
      }
    }
    this.changePage(props.page - 1)
  }

  startAutoUpdate() {
    this.startInterval(this.doUpdate, 1000);
    this.props.changeAutoReload(true);
  }

  stopAutoUpdate() {
    this.props.changeAutoReload(false);
    this.stopInterval();
  }

  changePage(page) {
    page++;
    if (page < 1) {
      page = 1
    }
    if (page !== this.state.currentPage) {
      this.assignState({currentPage: page}, ()=> {
        this.doUpdate();
        navigate(`/jobs/details/${this.props.job}/${page}`, false);
      });
    } else {
      console.log("no actual page change detected, skipping")
    }
  }

  resetToFirstPage() {
    this.changePage(0)
  }

  getMaxPages() {
    let {total, max} = this.state;
    return Math.ceil(total / max)
  }

  onMaxChange(max) {
    if (this.state.max !== max) {
      let func = this.state.currentPage === 1 ? this.doUpdate : this.resetToFirstPage;
      this.assignState({max: max}, func);
    }
  }

  selectJob(job) {
    this.assignState({selectedJob: job});
  }

  doUpdate() {
    if (!this.state.loading) {
      let {currentPage, max} = this.state;
      this.assignState({loading: true}, ()=> {
        this.client.get('jobs', this.props.job, {max: max, offset: (currentPage - 1) * max})
          .then((resp) => {
            if (!resp.list || resp.list.length === 0 && currentPage !== 1) {
              console.log("no items received and not on first page, returning to first page");
              this.assignState({loading: false}, this.resetToFirstPage);
            } else {
              this.assignState({list: resp.list, total: resp.total, loading: false});
            }
          }).catch((err)=> {
          this.stopAutoUpdate();
          window.setError(err);
          this.assignState({loading: false});
        })
      });
    }
  }

  getTableBody() {
    let selected = this.state.selectedJob;
    let selectedKey = "";
    if (selected) {
      selectedKey = `${selected.start}-${selected.end}-${selected.runtime}`;
    }
    return map(this.state.list, (job)=> {
      let cols = [];
      let key = `${job.start}-${job.end}-${job.runtime}`;
      cols.push(<td key={`${key}-queue`}>{job.queue}</td>);
      cols.push(<td key={`${key}-start`}><FormatedDate date={new Date(job.start)} format="l LTS"/></td>);
      if (!this.state.selectedJob) {
        cols.push(<td key={`${key}-end`}><FormatedDate date={new Date(job.end)} format="l LTS"/></td>);
      }
      cols.push(<td key={`${key}-runtime`}>{job.runtime}</td>);
      if (!this.state.selectedJob) {
        cols.push(<td key={`${key}-args`}>{job.args.join(",")}</td>);
      }

      return (
        <tr className={cx("clickable", {danger: !job.success, info: selectedKey === key})} key={key} onClick={()=> {
          this.selectJob(job)
        }}>
          {cols}
        </tr>
      )
    })
  }

  getTableHeaders() {
    let heads = [];
    heads.push(<th key="head-queue">Queue</th>);
    heads.push(<th key="head-start">Start</th>);
    if (!this.state.selectedJob) {
      heads.push(<th key="head-end">End</th>);
    }
    heads.push(<th key="head-runtime">Runtime</th>);
    if (!this.state.selectedJob) {
      heads.push(<th key="head-arguments">Arguments</th>);
    }
    return heads
  }

  render() {
    const {list} = this.state;
    if (!list) {
      return <div>loading</div>
    }
    return (
      <div>
        <div className="page-header">
          <h3>{this.props.job}</h3>
        </div>
        <div className="job-details">
          <div className="table-container">
            <div className="filter-form">
              <div className="filter">
                <FilterButtonGroup current={this.state.max} onChange={this.onMaxChange} filters={[10, 25, 50, 100, 200]}></FilterButtonGroup>
              </div>
            </div>
            <table className="table table-condensed">
              <thead>
              <tr>
                {this.getTableHeaders()}
              </tr>
              </thead>
              <tbody>
              {this.getTableBody()}
              </tbody>
            </table>
            <Pager
              pages={this.getMaxPages()}
              current={this.state.currentPage}
              target={`/jobs/details/${this.props.job}/`}
              disabled={this.state.loading}
              onPageChange={this.changePage}
            />
          </div>
          <JobListDetails job={this.state.selectedJob} close={()=> {
            this.selectJob(null)
          }}/>
        </div>
      </div>
    )
  }

}
