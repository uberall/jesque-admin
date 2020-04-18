import React from "react";
import {filter} from "lodash";

export class WorkerStats extends React.Component {

  render() {
    let workers = this.props.workers;
    if (!workers) {
      return (<div>No workers ...</div>)
    }

    let total = workers.length;
    let working = filter(workers, ['state', 'WORKING']).length;
    let idle = filter(workers, ['state', 'IDLE']).length;
    let paused = filter(workers, ['state', 'PAUSED']).length;
    return (
      <div>Total: {total} -- working: {working} idle: {idle} paused: {paused}</div>
    )
  }

}
