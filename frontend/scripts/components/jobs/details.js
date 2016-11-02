import React from "react";
import BaseComponent from "../base-component";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import _, {assign, map} from "lodash";
import FilterButtonGroup from "../common/filter-button-group";
import FormatedDate from "../common/formated-date";
import JobListDetails from "./job-list-details";
import ReactPaginate from "react-paginate";

const cx = require('classnames')

export default class JobDetails extends BaseComponent {

  constructor(props) {
    super(props);

    this.client = new JesqueAdminClient();

    this.state = {
      loading: false,
      list: null,
      total: 0,
      selectedJob: null
    };

    this.bindThiz('doUpdate', 'onMaxChange', 'selectJob', 'getTableHeaders');
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
        this.startAutoUpdate();
      } else {
        this.stopAutoUpdate();
      }
    } else if (!_.isEqual(props.params, this.props.params)) {
      this.doUpdate()
    }
  }

  startAutoUpdate() {
    this.startInterval(this.doUpdate);
  }

  stopAutoUpdate() {
    this.stopInterval();
  }

  onMaxChange(max) {
    this.navigate(`/jobs/${this.props.job}`, {offset: 0, max: max});
  }

  selectJob(job) {
    this.assignState({selectedJob: job});
  }

  doUpdate() {
    this.assignState({loading: true}, ()=> {
      this.client.get('jobs', this.props.job, {max: this.getMax(), offset: this.getOffset()})
        .then((resp) => {
          if (resp.list.length === 0 && this.getOffset() !== 0) {
            this.navigate(`/jobs/${this.props.job}`, {offset: 0, max: this.getMax()});
          } else {
            this.assignState({list: resp.list, total: resp.total, loading: false});
          }
        }).catch((err)=> {
        this.assignState({loading: false});
        this.props.setAlert(err);
        this.props.changeAutoReload(false);
      })
    });
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
    const {total} = this.state;
    const max = parseInt(this.getMax());
    const offset = parseInt(this.getOffset());
    return (
      <div>
        <div className="page-header">
          <h3>{this.props.job}</h3>
        </div>
        <div className="job-details">
          <div className="table-container">
            <div className="filter-form">
              <div className="filter">
                <FilterButtonGroup current={max} onChange={this.onMaxChange} filters={[10, 25, 50, 100, 200]} />
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
            <ReactPaginate
              pageNum={Math.ceil(total / max)}
              forceSelected={Math.floor(offset / max)}
              pageRangeDisplayed={2}
              marginPagesDisplayed={1}
              previousLabel="&laquo;"
              nextLabel="&raquo;"
              breakLabel={<a>&hellip;</a>}
              containerClassName="pagination"
              disabledClassName="disabled"
              activeClassName="active"
              clickCallback={(pageObject)=> {
                this.navigate(`/jobs/${this.props.job}`, {max: max, offset: max * pageObject.selected})
              }}
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
