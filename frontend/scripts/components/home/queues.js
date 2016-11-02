import React from "react";
import {assign, map, sortBy, filter} from "lodash";
import BaseComponent from "../base-component";
import Config from "../../tools/config";
const cx = require("classnames");
const bindThis = require('../../tools/bindThis')

var navigate = require('react-mini-router').navigate;

const EMPTY_QUEUE_CONFIG_KEY = "home.queues.empty";

export default class QueueList extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      query: "",
      empty: Config.get(EMPTY_QUEUE_CONFIG_KEY, false)
    };
    this.bindThiz("getQueueRows", "doesQueueMatchQuery", "onQueryChange", "onRowClick", "changeEmpty")
  }

  onQueryChange(query) {
    this.assignState({query: query});
  }

  onRowClick(queue) {
    navigate(`/queues/${queue.name}`)
  }

  getQueueRows() {
    if (!this.props.queues) {
      return <tr></tr>
    }
    let queues = this.props.queues;
    if (!this.state.empty) {
      queues = filter(queues, (q)=> {
        return q.size > 0
      })
    }

    queues = sortBy(queues, "size").reverse();
    queues = filter(queues, (q) => {
      return this.doesQueueMatchQuery(q)
    });
    return map(queues, (q)=> {
      return (
        <tr className="clickable" key={q.name} onClick={()=> {
          this.onRowClick(q)
        }}>
          <td>{q.name}</td>
          <td>{q.size}</td>
        </tr>
      )
    })
  }

  doesQueueMatchQuery(queue) {
    if (this.state.query === "") {
      return true
    }
    let q = this.state.query.toLowerCase();
    let name = queue.name.toLowerCase();
    return name.indexOf(q) > -1
  }

  changeEmpty() {
    this.assignState({empty: !this.state.empty}, ()=> {
      Config.set(EMPTY_QUEUE_CONFIG_KEY, this.state.empty)
    })
  }

  render() {
    let failedClasses = cx('clickable', {danger: this.props.failed > 0, info: this.props.failed === 0});

    return (
      <div className="queue-list">
        <div className="page-header">
          <h3>Queues</h3>
        </div>
        <div className="filter-form">
          <div className="filter">
            <input className="form-control" placeholder="Search for Queue name" type="text" value={this.state.query} onChange={(e)=> {
              this.onQueryChange(e.target.value)
            }}/>
          </div>
          <div className="filter">
            <label htmlFor="empty">
              <input id="empty" type="checkbox" checked={this.state.empty} onChange={(e)=> {
                this.changeEmpty(e.target.checked)
              }}/>
              Empty
            </label>
          </div>
        </div>
        <table className="table table-condensed table-striped table-hover">
          <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
          </tr>
          </thead>
          <tbody>
          {this.getQueueRows()}
          <tr className={failedClasses} onClick={()=> {
            navigate('/jobs/failed/')
          }}>
            <td>Failed</td>
            <td>{this.props.failed}</td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
