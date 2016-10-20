import React from "react";
import FromNow from "../common/from-now";
import FormatedDate from "../common/formated-date";

export default class WorkerDetails extends React.Component {

  render() {
    const {worker, onClose} = this.props;
    if (!worker) {
      return <div></div>
    } else {
      let workingRows = [];
      if (worker.state === 'WORKING') {
        workingRows.push(<dt key="working-job-label">Job</dt>)
        workingRows.push(<dd key="working-job-value">{worker.status.payload.className}</dd>)
        workingRows.push(<dt key="working-args-label">Args</dt>)
        workingRows.push(<dd key="working-args-value">{worker.status.payload.args.join(",")}</dd>)
      }
      const started = new Date(worker.started)
      return (
        <div>
          <button className="btn btn-danger pull-right" onClick={onClose} style={{marginRight: 10}}><i className="fa fa-times"></i></button>
          <dl>
            <dt>Host</dt>
            <dd>{worker.host}</dd>
            <dt>Pid</dt>
            <dd>{worker.pid}</dd>
            <dt>Started</dt>
            <dd><FormatedDate date={started}/> (<FromNow date={started}/>)</dd>
            <dt>Processed</dt>
            <dd>{worker.processed}</dd>
            <dt>Failed</dt>
            <dd>{worker.failed}</dd>
            <dt>Queues</dt>
            <dd>{worker.queues.join(",")}</dd>
            {workingRows}
          </dl>
        </div>
      )
    }
  }

}
