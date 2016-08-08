import React from "react";
import BaseComponent from "../base-component";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import {assign, map} from "lodash";
import Pager from "../common/pager";
import FilterButtonGroup from "../common/filter-button-group";
import FormatedDate from "../common/formated-date";
const navigate = require('react-mini-router').navigate;
const cx = require('classnames')

export default class JobDetails extends BaseComponent {

  constructor(props) {
    super(props);

    this.client = new JesqueAdminClient();

    this.state = {
      list: null,
      loading: false,
      total: 0,
      max: 25,
      currentPage: props.page
    };

    this.bindThiz('doUpdate', 'getMaxPages', 'changePage', 'resetToFirstPage', 'onMaxChange');
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
    this._interval = setInterval(this.doUpdate, 5000);
    this.props.changeAutoReload(true);
  }

  stopAutoUpdate() {
    this.props.changeAutoReload(false);
    if (this._interval) {
      clearInterval(this._interval)
    }
  }

  changePage(page) {
    page++;
    if (page < 1) {
      page = 1
    }
    if (page !== this.state.currentPage) {
      this.setState(assign(this.state, {currentPage: page}));
      setTimeout(()=> {
        this.doUpdate();
        navigate(`/jobs/details/${this.props.job}/${page}`, false);
      }, 100)
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
      this.setState(assign(this.state, {max: max}));
      let func;
      if (this.state.currentPage === 1) {
        func = this.doUpdate
      } else {
        func = this.resetToFirstPage
      }
      setTimeout(func, 100)
    }
  }

  doUpdate() {
    if (!this.state.loading) {
      let {currentPage, max} = this.state;
      this.setState(assign(this.state, {loading: true}));
      this.client.get('jobs', this.props.job, {max: max, offset: (currentPage - 1) * max})
        .then((resp) => {
          if (!resp.list || resp.list.length === 0 && currentPage !== 1) {
            console.log("no items received and not on first page, returning to first page");
            this.setState(assign(this.state, {loading: false}));
            setTimeout(this.resetToFirstPage, 100)
          } else {
            this.setState(assign(this.state, {list: resp.list, total: resp.total, loading: false}))
          }
        }).catch((err)=> {
        this.stopAutoUpdate();
        window.setError(err);
        this.setState(assign(this.state, {loading: false}))
      })
    }
  }

  getTableBody() {
    return map(this.state.list, (job)=> {
      return (
        <tr className={cx({danger: !job.success})} key={`${job.start}-${job.end}-${job.runtime}`}>
          <td>{job.queue}</td>
          <td><FormatedDate date={new Date(job.start)} format="l LTS"/></td>
          <td><FormatedDate date={new Date(job.end)} format="l LTS"/></td>
          <td>{job.runtime}</td>
          <td>
            <pre>{JSON.stringify(job.args)}</pre>
          </td>
        </tr>
      )
    })
  }

  render() {
    const {list} = this.state;
    if (!list) {
      return <div>loading</div>
    }
    return (
      <div className="job-details">
        <div className="table-container">
          <div className="filter-form">
            <div className="filter">
              <FilterButtonGroup current={this.state.max} onChange={this.onMaxChange} filters={[10, 25, 50]}></FilterButtonGroup>
            </div>
          </div>
          <table className="table table-condensed">
            <thead>
            <tr>
              <th>Queue</th>
              <th>Start</th>
              <th>End</th>
              <th>Runtime</th>
              <th>Arguments</th>
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
        <div className="details-container">

        </div>
      </div>
    )
  }

}
