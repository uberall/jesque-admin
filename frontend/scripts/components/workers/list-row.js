import BaseComponent from "../base-component";
import React from "react";
import FromNow from "../common/from-now";
const cx = require('classnames');

export default class WorkerListRow extends BaseComponent {

  render() {
    const {worker, selectable, onClick, selected, onDelete} = this.props;
    const {host, pid, state, status, queues} = worker;
    let job = "";
    let since = "";
    if (status && status.payload) {
      job = status.payload.className;
      since = <FromNow date={new Date(status.runAt)}/>
    }

    const baseKey = `${host}-${pid}`;
    const cols = [
      (<td key={`${baseKey}-host`}>{host}</td>),
      (<td key={`${baseKey}-pid`}>{pid}</td>)
    ];
    if (!selected) {
      cols.push(<td key={`${baseKey}-state`}>{state}</td>);
      cols.push(<td key={`${baseKey}-job`}>{job}</td>);
      cols.push(<td key={`${baseKey}-since`}>{since}</td>);
      cols.push(<td key={`${baseKey}-queue`}><span title={queues.join(",")}>{queues.length}</span></td>);
      cols.push(<td key={`${baseKey}-actions`}>
        <button className="btn btn-danger btn-xs pull-right" onClick={onDelete}><i className="fa fa-trash"/></button>
      </td>);
    }

    const rowClasses = cx({
      'clickable': selectable,
      "info": selected && (`${selected.host}-${selected.pid}` === `${host}-${pid}`)
    });
    return (
      <tr className={rowClasses} onClick={(e)=> {
        if (e.target.nodeName !== 'BUTTON' && e.target.nodeName !== 'I' && selectable) {
          onClick()
        }
      }}>
        {cols}
      </tr>
    )
  }
}
