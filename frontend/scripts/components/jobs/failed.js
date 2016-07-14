import React from "react";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import BaseComponent from "../base-component";
import {map, assign} from "lodash";
import FromNow from "../common/from-now";
import FailureDetails from "./failure-details";
import Pager from "../common/pager";
const cx = require('classnames')

const MAX = 5


export default class FailedList extends BaseComponent {

  constructor(props) {
    super(props)
    this.client = new JesqueAdminClient()

    this.state = {
      list: null,
      total: 0,
      selected: null
    }
    this.bindThiz('doUpdate', 'getMaxPages', 'changePage', 'selectFailure', 'getSelectedView')
    this.doUpdate()
  }

  doUpdate() {
    let page = this.props.page || 1
    this.client.get('failed', null, {max: MAX, offset: page * MAX})
      .then((resp) => {
        this.setState(assign(this.state, {list: resp.list, total: resp.total}))
      })
  }

  getMaxPages() {
    let {total} = this.state
    return Math.ceil(total / MAX)
  }

  selectFailure(failure) {
    this.setState(assign(this.state, {selected: failure}))
  }

  getTableBody() {
    const {list, selected} = this.state
    return map(list, (failure)=> {
      return (
        <tr className={cx('clickable', {info: selected === failure})} key={failure.failedAt} onClick={()=>{this.selectFailure(failure)}}>
          <td>
            <FromNow date={new Date(failure.failedAt)}/>
          </td>
          <td>
            {failure.payload.className}
          </td>
          <td>
            {failure.queue}
          </td>
          <td>
            {failure.throwableString}
          </td>
          <td>
            {failure.error}
          </td>
        </tr>
      )
    })
  }

  getSelectedView() {
    if (!this.state.selected) {
      return ""
    } else {
      return <FailureDetails failure={this.state.selected} onClose={()=> {
        this.selectFailure(null)
      }}
      />
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <table className="table">
              <thead>
              <tr>
                <th>When</th>
                <th>Job</th>
                <th>Queue</th>
                <th>Exception</th>
                <th>Message</th>
              </tr>
              </thead>
              <tbody>
              {this.getTableBody()}
              </tbody>
            </table>
          </div>
        </div>
        <Pager
          pages={this.getMaxPages()}
          current={this.props.page}
          target={`/jobs/failed`}
          onPageChange={this.doUpdate}
        />
        {this.getSelectedView()}
      </div>
    )
  }
}
