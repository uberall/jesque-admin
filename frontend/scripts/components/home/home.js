import React from "react";
import {assign} from "lodash";
import BaseComponent from "../base-component";
import WorkerList from "./workers";
import QueueList from "./queues";
import JesqueAdminClient from "../../tools/jesque-admin-client";

export default class HomeView extends BaseComponent {
  constructor(props) {
    super(props)
    this.state = {
      queues: [],
      workers: [],
      failed: 0
    }

    this.bindThiz('doUpdate')
    this.client = new JesqueAdminClient()
  }

  doUpdate() {
    this.client.get('overview', null, {})
      .then((json) => {
        this.setState(assign(this.state, {queues: json.queues, workers: json.workers, failed: json.failed}))
      })
      .catch((err)=> {
        throw(err)
      })
  }

  componentDidMount() {
    this.doUpdate()
    this.intervalid = setInterval(this.doUpdate, 2500)
  }

  componentWillUnmount() {
    clearInterval(this.intervalid)
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-6"><QueueList queues={this.state.queues} failed={this.state.failed}/></div>
        <div className="col-sm-6"><WorkerList workers={this.state.workers}/></div>
      </div>
    )
  }
}
