import React from "react";
import FormatedDate from "../common/formated-date";
import {map} from 'lodash'
const cx = require('classnames')
export default class JobListDetails extends React.Component {

  getStacktrace(job) {
    if (!job.backtrace) {
      return ""
    }
    let i = 0;
    return map(job.backtrace, (el)=> {
      i++;
      return (
        <li key={i}>
          {el}
        </li>
      )
    })
  }

  getDetailsContent(job) {
    if (!job) {
      return ""
    }
    let rows = [];
    rows.push(<dt key="queue-label">Queue</dt>);
    rows.push(<dd key="queue-data">{job.queue}</dd>);
    rows.push(<dt key="start-label">Start</dt>);
    rows.push(<dd key="start-data"><FormatedDate date={new Date(job.start)}/></dd>);
    rows.push(<dt key="end-label">End</dt>);
    rows.push(<dd key="end-data"><FormatedDate date={new Date(job.end)}/></dd>);
    rows.push(<dt key="runtime-label">Runtime</dt>);
    rows.push(<dd key="runtime-data">{job.runtime}</dd>);
    rows.push(<dt key="args-label">Arguments</dt>);
    rows.push(<dd key="args-data">
      <pre>{JSON.stringify(job.args, 1, 1)}</pre>
    </dd>);
    if(!job.success && job.throwableString) {
      rows.push(<dt key="exception-label">Exception</dt>);
      rows.push(<dd key="exception-data">{job.throwableString}</dd>);
      rows.push(<dt key="message-label">Message</dt>);
      rows.push(<dd key="message-data">{job.throwableMessage}</dd>);
      rows.push(<dt key="stacktrace-label">Stacktrace</dt>);
      rows.push(<dd key="stacktrace-data"><ul className="stacktrace">{this.getStacktrace(job)}</ul></dd>);
    }
    return (
      <div>
        <button className="btn btn-danger pull-right" onClick={this.props.close} style={{marginRight: 10}}><i className="fa fa-times"></i></button>
        <dl>
          {rows}
        </dl>
      </div>
    )
  }

  render() {
    const job = this.props.job;
    return (
      <div className={cx('details-container', {'visible': !!job})}>
        {this.getDetailsContent(job)}
      </div>
    )
  }

}
