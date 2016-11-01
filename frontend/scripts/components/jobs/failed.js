import React from "react";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import BaseComponent from "../base-component";
import {map, assign} from "lodash";
import FromNow from "../common/from-now";
import FailureDetails from "./failure-details";
import FilterButtonGroup from "../common/filter-button-group";
import Pager from "../common/pager";
import FormatedDate from "../common/formated-date";
const cx = require('classnames');
const navigate = require('react-mini-router').navigate;
const SweetAlert = require('react-swal');

export default class FailedList extends BaseComponent {

  constructor(props) {
    super(props);
    this.client = new JesqueAdminClient();

    this.state = {
      list: null,
      total: 0,
      selected: null,
      max: 25,
      currentPage: props.page,
      confirmClearAll: false
    };
    this.bindThiz('doUpdate', 'getMaxPages', 'selectFailure', 'getSelectedView', 'onMaxChange', 'clearAll', 'changePage', 'resetToFirstPage', 'getClearAllAlert');
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
        this.doUpdate()
        this.startAutoUpdate()
      } else {
        this.stopAutoUpdate()
      }
    }
    this.changePage(props.page - 1)
  }

  startAutoUpdate() {
    this.startInterval(this.doUpdate, 1000);
    this.props.changeAutoReload(true);
  }

  stopAutoUpdate() {
    this.props.changeAutoReload(false);
    this.stopInterval();
  }

  doUpdate() {
    let {currentPage, max} = this.state;
    this.client.get('failed', null, {max: max, offset: (currentPage - 1) * max})
      .then((resp) => {
        if (resp.list.length === 0 && currentPage !== 1) {
          console.log("no items received and not on first page, returning to first page");
          this.resetToFirstPage();
        } else {
          this.assignState({list: resp.list, total: resp.total});
        }
      }).catch((err)=> {
      this.stopAutoUpdate();
      window.setError(err);
    })
  }

  changePage(page) {
    page++;
    if (page < 1) {
      page = 1
    }
    if (page !== this.state.currentPage) {
      this.assignState({currentPage: page}, ()=> {
        this.doUpdate();
        navigate(`/jobs/failed/${page}`, false);
      });
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

  selectFailure(failure) {
    this.assignState({selected: failure});
  }

  getRetryComponent(failure) {
    if (failure.retriedAt) {
      return (
        <span>
          Retried: <FormatedDate date={new Date(failure.failedAt)}/>
        </span>
      )
    }

    return (
      <button className="btn btn-xs btn-warning" onClick={()=> {
        this.onRetryClicked(failure)
      }}><i className="fa fa-undo"></i></button>
    )
  }

  getTableBody(somethingSelected) {
    const {list, selected} = this.state;
    return map(list, (failure)=> {
      let cols = [];
      cols.push(<td key={`${failure.id}-date`}><FromNow date={new Date(failure.failedAt)}/></td>);
      cols.push(<td key={`${failure.id}-class`}>{failure.payload.className}</td>)
      cols.push(<td key={`${failure.id}-throwable`} className="short">{failure.throwableString}</td>)
      if (!somethingSelected) {
        cols.push(<td key={`${failure.id}-error`} className="short">{failure.error}</td>)
        cols.push(
          <td key={`${failure.id}-actions`}>
            <button className="btn btn-xs btn-danger" onClick={()=> {
              this.onDeleteClicked(failure)
            }}><i className="fa fa-trash"></i></button>
            {this.getRetryComponent(failure)}
          </td>
        )
      }
      return (
        <tr className={cx('clickable', {info: selected && selected.id === failure.id})} key={failure.id} onClick={(e)=> {
          if (e.target.nodeName != 'BUTTON' && e.target.nodeName != 'I') {
            this.selectFailure(failure)
          }
        }}>
          {cols}
        </tr>
      )
    })
  }

  getSelectedView() {
    return <FailureDetails failure={this.state.selected} onClose={()=> {
      this.selectFailure(null)
    }}
    />
  }

  onMaxChange(max) {
    if (this.state.max !== max) {
      let func = this.state.currentPage === 1 ? this.doUpdate : this.resetToFirstPage;
      this.assignState({max: max}, func);
    }
  }

  onRetryClicked(failure) {
    this.client.post('failed', failure.id, {})
      .then(this.doUpdate)
      .catch((err)=> {
        throw err
      })
  }

  onDeleteClicked(failure) {
    this.client.delete('failed', failure.id, {})
      .then(this.doUpdate)
      .catch((err)=> {
        throw err
      })
  }

  clearAll() {
    this.client.delete('failed', null, {})
      .then(() => {
        this.assignState({confirmClearAll: false}, ()=> {
          this.selectFailure(null);
        });
        this.doUpdate()
      }).catch((err)=> {
      console.error(err)
    })
  }

  getClearAllAlert() {
    if (this.state.confirmClearAll === false) {
      return ""
    }

    return (<SweetAlert
      isOpen={true}
      type="warning"
      title="Are you sure?"
      text={`This will delete all failed Jobs!`}
      confirmButtonText="Yes"
      cancelButtonText="No"
      callback={(confirmed)=> {
        if (confirmed) {
          this.clearAll()
        } else {
          this.assignState({confirmClearAll: false});
        }
      }}
    />)
  }

  render() {
    let somethingSelected = !!this.state.selected;
    let headers = [];
    headers.push(<th key="header-When">When</th>);
    headers.push(<th key="header-Job">Job</th>);
    headers.push(<th key="header-Exception">Exception</th>);
    if (!somethingSelected) {
      headers.push(<th key="header-Message">Message</th>);
      headers.push(<th key="header-Actions"></th>);
    }
    return (
      <div className="failed-list">
        <div className="table-container">
          <div className="page-header">
            <h3>Failed Jobs</h3>
          </div>
          <div className="filter-form">
            <div className="filter">
              <FilterButtonGroup current={this.state.max} onChange={this.onMaxChange} filters={[10, 25, 50, 100, 200]}></FilterButtonGroup>
            </div>
            <div className="filter">
              <button
                className="btn btn-danger pull-right"
                onClick={()=> {
                  this.assignState({confirmClearAll: true});
                }}
              >
                <i className="fa fa-trash"></i> Clear all
              </button>
              {this.getClearAllAlert()}
            </div>
          </div>
          <table className="table">
            <thead>
            <tr>
              {headers}
            </tr>
            </thead>
            <tbody>
            {this.getTableBody(somethingSelected)}
            </tbody>
          </table>
          <Pager
            pages={this.getMaxPages()}
            current={this.state.currentPage}
            target={`/jobs/failed`}
            onPageChange={this.changePage}
          />
        </div>
        {this.getSelectedView()}
      </div>
    )
  }
}
