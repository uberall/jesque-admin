import React from "react";
import FormatDate from "../common/formate-date";
import _ from "lodash";

export default class FailureDetails extends React.Component {
  getStacktrace(failure) {
    let i = 0
    return _.map(failure.throwable.stackTrace, (el)=> {
      i++
      return (
        <li key={i}>
          at {el.className}.{el.methodName}(<b>{el.fileName}:{el.lineNumber}</b>)
        </li>
      )
    })
  }

  render() {
    let {failure, onClose} = this.props
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <dl>
              <dt>Job</dt>
              <dd>{failure.payload.className}</dd>
              <dt>Queue</dt>
              <dd>{failure.queue}</dd>
              <dt>Time</dt>
              <dd><FormatDate date={new Date(failure.failedAt)}/></dd>
              <dt>Exception</dt>
              <dd>{failure.throwableString}</dd>
              <dt>Message</dt>
              <dd>{failure.error}</dd>
              <dt>Stacktrace</dt>
              <dd>
                <ul className="stacktrace">{this.getStacktrace(failure)}</ul>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    )
  }
}
