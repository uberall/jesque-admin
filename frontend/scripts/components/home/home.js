import React from "react";
import {assign} from "lodash";
import BaseComponent from "../base-component";
import WorkerList from "./workers";
import QueueList from "./queues";
import JesqueAdminClient from "../../tools/jesque-admin-client";

export default class HomeView extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      queues: [],
      workers: [],
      failed: 0
    };

    this.bindThiz('doUpdate');
    this.client = new JesqueAdminClient()
  }

  componentDidMount() {
    this.doUpdate();
    if(this.props.autoReload) {
      this.startAutoUpdate();
    }
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
    this.startInterval(this.doUpdate);
  }

  stopAutoUpdate() {
    this.stopInterval()
  }

  doUpdate() {
    this.client.get('overview', null, {})
      .then((json) => {
        this.assignState({queues: json.queues, workers: json.workers, failed: json.failed});
      })
      .catch((err)=> {
        this.props.setAlert(err);
        this.props.changeAutoReload(false);
      })
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-6 queues"><QueueList queues={this.state.queues} failed={this.state.failed}/></div>
        <div className="col-lg-6 workers"><WorkerList workers={this.state.workers}/></div>
      </div>
    )
  }
}
