import React from "react";
import {assign, map, slice} from "lodash";
import BaseComponent from "../base-component";
import Pager from "../common/pager";
import JesqueAdminClient from "../../tools/jesque-admin-client";

const MAX = 25

export default class QueueDetails extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      queue: null,
      page: props.page
    }

    this.client = new JesqueAdminClient()
    this.bindThiz('getPager', 'getTableRows', 'changePage')

  }

  doUpdate() {
    this.client.get('queues', this.props.name, {})
      .then((json) => {
        this.setState(assign(this.state, {queue: json.queue}))
      })
  }

  changePage(page) {
    this.setState(assign(this.state, {page: page}))
  }

  getTableRows() {
    let from = ((this.state.page - 1) * MAX)
    let to = from + MAX
    let i = 0
    return map(slice(this.state.queue.jobs, from, to), (job)=> {
      i++
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
    this.doUpdate()
    this.intervalid = setInterval(()=> {
      this.doUpdate()
    }, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalid)
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
