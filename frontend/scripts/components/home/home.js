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

  componentDidMount() {
    this.startAutoUpdate();
    this.doUpdate()
  }

  componentWillUnmount() {
    this.stopAutoUpdate()
  }

  componentWillReceiveProps(props) {
    if (props.autoReload != this.props.autoReload) {
      if (props.autoReload) {
        this.doUpdate();
        this.startAutoUpdate()
      } else {
        this.stopAutoUpdate()
      }
    }
  }

  startAutoUpdate() {
    this._interval = setInterval(this.doUpdate, 2000);
    this.props.changeAutoReload(true);
  }

  stopAutoUpdate() {
    this.props.changeAutoReload(false);
    if (this._interval) {
      clearInterval(this._interval)
    }
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

  render() {
    return (
      <div className="home-component">
        <div className="queues"><QueueList queues={this.state.queues} failed={this.state.failed}/></div>
        <div className="workers"><WorkerList workers={this.state.workers}/></div>
      </div>
    )
  }
}
