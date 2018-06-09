import React from "react";
import _ from "lodash";
import BaseComponent from "../base-component";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import FilterButtonGroup from "../common/filter-button-group";
import {HOME} from "../../constants/paths";
import ReactPaginate from "react-paginate";
import FormatedDate from "../common/formated-date";
import FromNow from "../common/from-now";

const SweetAlert = require('react-swal');

export default class QueueDetails extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      queue: null,
      confirmDelete: false
    };

    this.client = new JesqueAdminClient();
    this.bindThiz('doUpdate', 'getTableHeaders', 'getTableRows', 'onMaxChange', 'getDeleteAlert', 'doDelete')
  }

  doUpdate() {
    this.client.get('queues', encodeURIComponent(this.props.name), {max: this.getMax(), offset: this.getOffset()})
      .then((json) => {
        this.assignState({queue: json.queue, list: json.queue.jobs, total: json.queue.size});
      }).catch(err=> {
      this.props.setAlert(err)
      this.props.changeAutoReload(false);
    })
  }

  getTableHeaders() {
    const {queue} = this.state;
    if (!queue) {
      return "";
    }

    const delayed = queue.delayed;
    let heads = [];
    heads.push(<th key="head-job">Job</th>);
    if (delayed) {
      heads.push(<th key="head-when">When</th>);
    }
    heads.push(<th key="head-arguments">Arguments</th>);
    return heads
  }

  getTableRows() {
    const {queue} = this.state;
    if (!queue) {
      return "";
    }

    const delayed = queue.delayed;
    const jobs = _.get(queue, "jobs");
    let i = this.getOffset();

    return _.map(jobs, (job) => {
      i++;
      let key = `${job.className}-${JSON.stringify(job.args)}-${i}`;
      if (delayed) {
        return <DelayedQueueDetailsListRow job={job} key={key}/>
      } else {
        return <QueueDetailsListRow job={job} key={key}/>
      }
    })
  }

  componentDidMount() {
    this.doUpdate();
    if (this.props.autoReload) {
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

  doDelete() {
    this.client.delete('queues', encodeURIComponent(this.props.name), {})
      .then(() => {
        this.navigate(HOME.path)
      }).catch(err=> {
      this.props.setAlert(err);
      this.props.changeAutoReload(false);
    })
  }

  getDeleteAlert() {
    if (this.state.confirmDelete === false) {
      return ""
    } else {
      return (<SweetAlert
        isOpen={true}
        type="warning"
        title="Are you sure?"
        text={`This will delete this queue!`}
        confirmButtonText="Yes"
        cancelButtonText="No"
        callback={(confirmed)=> {
          if (confirmed) {
            this.doDelete()
          } else {
            this.assignState({confirmDelete: false})
          }
        }}
      />)
    }
  }

  onMaxChange(max) {
    this.navigate(`/queues/${this.props.name}`, {offset: 0, max: max});
  }

  render() {
    const {queue}  = this.state;
    const total = _.get(queue, "size");
    const max = parseInt(this.getMax());
    const offset = parseInt(this.getOffset());
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <div className="page-header">
              <h1>{this.props.name}
              </h1>
              <button className="btn btn-danger" onClick={()=> {
                this.assignState({confirmDelete: true});
              }}>Delete
              </button>
              {this.getDeleteAlert()}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div className="filter-form">
              <div className="filter">
                <FilterButtonGroup current={max} onChange={this.onMaxChange} filters={[10, 25, 50, 100, 200]}/>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <table className="table table-striped table-condensed">
              <thead>
              <tr>
                {this.getTableHeaders()}
              </tr>
              </thead>
              <tbody>
                {this.getTableRows()}
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
                clickCallback={(pageObject)=> {
                  this.navigate(`/queues/${this.props.name}`, {max: max, offset: max * pageObject.selected})
                }}
              />
            </nav>
          </div>
        </div>
      </div>
    )
  }
}

class QueueDetailsListRow extends React.Component {
  render() {
    return (
      <tr>
        <td>
          {this.props.job.className}
        </td>
        <td>
          <code>
            {JSON.stringify(this.props.job.args)}
          </code>
        </td>
      </tr>
    )
  }
}

class DelayedQueueDetailsListRow extends React.Component {
  render() {
    return (
      <tr>
        <td>
          {this.props.job.className}
        </td>
        <td>
          <FormatedDate date={new Date(this.props.job.runAt)}/> (<FromNow date={new Date(this.props.job.runAt)}/>)
        </td>
        <td>
          <code>
            {JSON.stringify(this.props.job.args)}
          </code>
        </td>
      </tr>
    )
  }
}
