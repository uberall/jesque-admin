import React from "react";
import {assign, map, slice} from "lodash";
import BaseComponent from "../base-component";
import Pager from "../common/pager";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import {HOME} from "../../constants/paths";

const SweetAlert = require('react-swal');
const MAX = 25;

export default class QueueDetails extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      queue: null,
      page: props.page,
      confirmDelete: false
    };

    this.client = new JesqueAdminClient();
    this.bindThiz('getPager', 'getTableRows', 'changePage', 'getDeleteAlert', 'doDelete')

  }

  doUpdate() {
    this.client.get('queues', encodeURIComponent(this.props.name), {})
      .then((json) => {
        this.assignState({queue: json.queue});
      })
  }

  changePage(page) {
    this.assignState({page: page});
  }

  getTableRows() {
    let from = ((this.state.page - 1) * MAX);
    let to = from + MAX;
    let i = 0;
    return map(slice(this.state.queue.jobs, from, to), (job)=> {
      i++;
      return <QueueDetailsListRow job={job} key={`${job.className}-${JSON.stringify(job.args)}-${i}`}/>
    })
  }

  getMaxPages() {
    return Math.ceil(this.state.queue.jobs.length / MAX)
  }

  getPager() {
    return (
      <Pager
        pages={this.getMaxPages()}
        current={this.state.page}
        target={`/queues/${this.props.name}`}
        onPageChange={this.changePage}
      />
    )
  }

  componentDidMount() {
    this.doUpdate();
    this.startInterval(this.doUpdate, 1000)
  }

  componentWillUnmount() {
    this.stopInterval()
  }

  doDelete() {
    this.client.delete('queues', encodeURIComponent(this.props.name), {})
      .then((json) => {
        window.doNavigate(HOME)
      })
  }

  getDeleteAlert() {
    if (this.state.confirmDelete === false) {
      return ""
    } else {
      return (<SweetAlert
        isOpen={true}
        type="warning"
        title="Are you sure?"
        text={`This will delete this queue!`}
        confirmButtonText="Yes"
        cancelButtonText="No"
        callback={(confirmed)=> {
          if (confirmed) {
            this.doDelete()
          } else {
            this.assignState({confirmDelete: false})
          }
        }}
      />)
    }
  }

  render() {
    if (!this.state.queue) {
      return <div>loading</div>
    }
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <div className="page-header">
              <h1>{this.state.queue.name}
              </h1>
              <button className="btn btn danger" onClick={()=> {
                this.assignState({confirmDelete: true});
              }}>Delete
              </button>
              {this.getDeleteAlert()}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-striped table-condensed">
              <thead>
              <tr>
                <th>
                  Job
                </th>
                <th>
                  Arguments
                </th>
              </tr>
              </thead>
              <tbody>
              {this.getTableRows()}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            {this.getPager()}
          </div>
        </div>
      </div>
    )
  }
}


class QueueDetailsListRow extends BaseComponent {
  render() {
    return (
      <tr>
        <td>
          {this.props.job.className}
        </td>
        <td>
          <code>
            {JSON.stringify(this.props.job.args)}
          </code>
        </td>
      </tr>
    )
  }
}
