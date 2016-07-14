import React from "react";
import {assign, map, sortBy, filter} from "lodash";
const cx = require("classnames");
const bindThis = require('../../tools/bindThis')

var navigate = require('react-mini-router').navigate;

export default class QueueList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      query: "",
      empty: false
    }
    bindThis(this, "getQueueRows", "doesQueueMatchQuery", "onQueryChange", "onRowClick")
  }

  onQueryChange(query) {
    this.setState(assign(this.state, {query: query}))
  }

  onRowClick(queue) {
    navigate(`/queues/${queue.name}`)
  }

  getQueueRows() {
    if (!this.props.queues) {
      return <tr></tr>
    }
    let queues = this.props.queues
    if (!this.state.empty) {
      queues = filter(queues, (q)=> {
        return q.size > 0
      })
    }

    queues = sortBy(queues, "size").reverse()
    queues = filter(queues, (q) => {
      return this.doesQueueMatchQuery(q)
    })
    return map(queues, (q)=> {
      return (
        <tr className="clickable" key={q.name} onClick={()=>{this.onRowClick(q)}}>
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
    let q = this.state.query.toLowerCase()
    let name = queue.name.toLowerCase()
    return name.indexOf(q) > -1
  }

  render() {
    let failedClasses = cx('clickable', {danger: this.props.failed > 0, info: this.props.failed === 0})
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <input className="form-control" placeholder="Search for Queue name" type="text" value={this.state.query} onChange={(e)=>{this.onQueryChange(e.target.value)}}/>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-condensed table-striped table-hover">
              <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
              </tr>
              </thead>
              <tbody>
              {this.getQueueRows()}
              <tr className={failedClasses} onClick={()=>{navigate('/jobs/failed/1')}}>
                <td>Failed</td>
                <td>{this.props.failed}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
