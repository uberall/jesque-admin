import React from "react";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import BaseComponent from "../base-component";
import _ from "lodash";
import FromNow from "../common/from-now";
import FailureDetails from "./failure-details";
import FilterButtonGroup from "../common/filter-button-group";
import FormatedDate from "../common/formated-date";
import ReactPaginate from "react-paginate";

const cx = require('classnames');
const SweetAlert = require('react-swal');

export default class FailedList extends BaseComponent {

  constructor(props) {
    super(props);
    this.client = new JesqueAdminClient();

    this.state = {
      list: null,
      total: 0,
      selected: null,
      confirmClearAll: false,
      loading: false
    };
    this.bindThiz('doUpdate', 'selectFailure', 'getSelectedView', 'onMaxChange', 'clearAll', 'getClearAllAlert');
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
        this.startAutoUpdate();
      } else {
        this.stopAutoUpdate();
      }
    } else if (!_.isEqual(props.params, this.props.params)) {
      this.doUpdate()
    }
  }

  startAutoUpdate() {
    this.startInterval(this.doUpdate);
  }

  stopAutoUpdate() {
    this.stopInterval();
  }

  doUpdate() {
    this.assignState({loading: true}, ()=> {
      this.client.get('failed', null, {max: this.getMax(), offset: this.getOffset()})
        .then((resp) => {
          if (resp.list.length === 0 && this.getOffset() !== 0) {
            this.navigate("/jobs/failed", {offset: 0, max: this.getMax()})
          } else {
            this.assignState({list: resp.list, total: resp.total, loading: false});
          }
        }).catch((err)=> {
        this.assignState({loading: false});
        this.props.setAlert(err);
        this.props.changeAutoReload(false);
      })
    })
  }

  selectFailure(failure) {
    if (this.state.selected && failure && this.state.selected.id === failure.id) {
      this.assignState({selected: null});
    } else {
      this.assignState({selected: failure});
    }
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
    return _.map(list, (failure)=> {
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
    this.navigate("/jobs/failed", {offset: 0, max: max});
  }

  onRetryClicked(failure) {
    this.client.post('failed', failure.id, {})
      .then(this.doUpdate)
      .catch((err)=> {
        this.props.setAlert(err);
      })
  }

  onDeleteClicked(failure) {
    this.client.delete('failed', failure.id, {})
      .then(this.doUpdate)
      .catch((err)=> {
        this.props.setAlert(err);
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
      this.props.setAlert(err);
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
    const {total}  = this.state;
    const max = parseInt(this.getMax());
    const offset = parseInt(this.getOffset());
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
      <div>
        <div className="page-header">
          <h3>Failed Jobs</h3>
        </div>
        <div className="failed-list">
          <div className="table-container">
            <div className="filter-form">
              <div className="filter">
                <FilterButtonGroup current={max} onChange={this.onMaxChange} filters={[10, 25, 50, 100, 200]}></FilterButtonGroup>
              </div>
              <div className="filter">
                <button
                  className="btn btn-danger pull-right"
                  onClick={() => {
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
            <nav>
              <ReactPaginate
                pageNum={Math.ceil(total / max)}
                forceSelected={Math.floor(offset / max)}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                previousLabel="&laquo;"
                nextLabel="&raquo;"
                breakLabel={<a>&hellip;</a>}
                containerClassName="pagination"
                disabledClassName="disabled"
                activeClassName="active"
                clickCallback={(pageObject) => {
                  this.navigate("/jobs/failed", {max: max, offset: max * pageObject.selected})
                }}
              />
            </nav>
          </div>
          {this.getSelectedView()}
        </div>
      </div>
    )
  }
}
