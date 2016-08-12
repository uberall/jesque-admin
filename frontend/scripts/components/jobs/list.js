import React from "react";
import BaseComponent from "../base-component";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import {assign, map} from "lodash";
import Pager from "../common/pager";
const navigate = require('react-mini-router').navigate;

export default class JobsList extends BaseComponent {

  constructor(props) {
    super(props);

    this.client = new JesqueAdminClient();

    this.state = {
      list: null,
      loading: false,
      total: 0,
      max: 25,
      currentPage: props.page
    };

    this.bindThiz('doUpdate', 'getMaxPages', 'changePage', 'resetToFirstPage');
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
    this.changePage(props.page - 1)
  }

  startAutoUpdate() {
    this._interval = setInterval(this.doUpdate, 5000);
    this.props.changeAutoReload(true);
  }

  stopAutoUpdate() {
    this.props.changeAutoReload(false);
    if (this._interval) {
      clearInterval(this._interval)
    }
  }

  changePage(page) {
    page++;
    if (page < 1) {
      page = 1
    }
    if (page !== this.state.currentPage) {
      this.setState(assign(this.state, {currentPage: page}));
      setTimeout(()=> {
        this.doUpdate();
        navigate(`/jobs/${page}`, false);
      }, 100)
    } else {
      console.log("no actual page change detected, skipping")
    }
  }

  resetToFirstPage() {
    this.changePage(0)
  }

  getMaxPages() {
    let {total, max} = this.state;
    return Math.ceil(total / max)
  }

  doUpdate() {
    if (!this.state.loading) {
      let {currentPage, max} = this.state;
      this.setState(assign(this.state, {loading: true}));
      this.client.get('jobs', null, {max: max, offset: (currentPage - 1) * max})
        .then((resp) => {
          if (!resp.list || resp.list.length === 0 && currentPage !== 1) {
            console.log("no items received and not on first page, returning to first page");
            this.setState(assign(this.state, {loading: false}));
            setTimeout(this.resetToFirstPage, 100)
          } else {
            this.setState(assign(this.state, {list: resp.list, total: resp.total, loading: false}))
          }
        }).catch((err)=> {
        this.stopAutoUpdate();
        window.setError(err);
        this.setState(assign(this.state, {loading: false}))
      })
    }
  }

  getTableBody() {
    return map(this.state.list, (name)=> {
      return (
        <tr key={name} className="clickable" onClick={()=>{
          navigate(`/jobs/details/${name}/1`)
        }}>
          <td>{name}</td>
        </tr>
      )
    })
  }

  render() {
    const {list} = this.state;
    if (!list) {
      return <div>loading</div>
    }
    return (
      <div className="jobs-list">
        <div className="page-header">
          <h3>Jobs</h3>
        </div>
        <table className="table">
          <tbody>
          {this.getTableBody()}
          </tbody>
        </table>
        <Pager
          pages={this.getMaxPages()}
          current={this.state.currentPage}
          target={`/jobs/failed`}
          disabled={this.state.loading}
          onPageChange={this.changePage}
        />
      </div>
    )
  }

}
