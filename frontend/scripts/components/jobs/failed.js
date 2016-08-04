import React from "react";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import BaseComponent from "../base-component";
import {map, assign} from "lodash";
import FromNow from "../common/from-now";
import FailureDetails from "./failure-details";
import Pager from "../common/pager";
import FilterButtonGroup from "../common/filter-button-group";
const cx = require('classnames');

export default class FailedList extends BaseComponent {

  constructor(props) {
    super(props);
    this.client = new JesqueAdminClient();

    this.state = {
      list: null,
      loading: false,
      total: 0,
      selected: null,
      max: 25
    }
    this.bindThiz('doUpdate', 'getMaxPages', 'selectFailure', 'getSelectedView', 'onMaxChange');
    this.doUpdate()
  }

  doUpdate(page) {
    this.setState(assign(this.state, {loading: true}))
    if (page === undefined) {
      page = this.props.page || 1;
    }
    this.client.get('failed', null, {max: this.state.max, offset: page * this.state.max})
      .then((resp) => {
        this.setState(assign(this.state, {list: resp.list, total: resp.total, loading: false}))
      }).catch((err)=> {
      console.error(err)
      this.setState(assign(this.state, {loading: false}))
    })
  }

  getMaxPages() {
    let {total, max} = this.state
    return Math.ceil(total / max)
  }

  selectFailure(failure) {
    this.setState(assign(this.state, {selected: failure}))
  }

  getTableBody(somethingSelected) {
    const {list, selected} = this.state
    return map(list, (failure)=> {
      let cols = []
      cols.push(<td key={`${failure.failedAt}-${failure.queue}-date`}><FromNow date={new Date(failure.failedAt)}/></td>);
      cols.push(<td key={`${failure.failedAt}-${failure.queue}-class`}>{failure.payload.className}</td>)
      cols.push(<td key={`${failure.failedAt}-${failure.queue}-throwable`}>{failure.throwableString}</td>)
      if (!somethingSelected) {
        cols.push(<td key={`${failure.failedAt}-${failure.queue}-error`}>{failure.error}</td>)
      }
      return (
        <tr className={cx('clickable', {info: selected === failure})} key={failure.failedAt} onClick={()=> {
          this.selectFailure(failure)
        }}>
          {cols}
        </tr>
      )
    })
  }

  getSelectedView() {
    return <FailureDetails failure={this.state.selected} onClose={()=> {
      this.selectFailure(null)
    }}
    />
  }

  onMaxChange(max) {
    if (this.state.max !== max) {
      this.setState(assign(this.state, {max: max}));
      this.doUpdate(this.props.page)
    }
  }

  render() {
    let somethingSelected = !!this.state.selected;
    let headers = []
    headers.push(<th key="header-When">When</th>);
    headers.push(<th key="header-Job">Job</th>);
    headers.push(<th key="header-Exception">Exception</th>);
    if (!somethingSelected) {
      headers.push(<th key="header-Message">Message</th>);
    }

    return (
      <div className="failed-list">
        <div className="table-container">
          <FilterButtonGroup current={this.state.max} onChange={this.onMaxChange} filters={[10, 25, 50]}></FilterButtonGroup>
          <table className="table">
            <thead>
            <tr>
              {headers}
            </tr>
            </thead>
            <tbody>
            {this.getTableBody(somethingSelected)}
            </tbody>
          </table>
          <Pager
            pages={this.getMaxPages()}
            current={this.props.page}
            target={`/jobs/failed`}
            onPageChange={this.doUpdate.bind(this)}
            disabled={this.state.loading}
          />
        </div>
        {this.getSelectedView()}
      </div>
    )
  }
}
