import React from "react";
import BaseComponent from "../base-component";
import JesqueAdminClient from "../../tools/jesque-admin-client";
import _ from "lodash";
import ReactPaginate from "react-paginate";

const navigate = require('react-mini-router').navigate;
const cx = require('classnames')

export default class JobsList extends BaseComponent {

  constructor(props) {
    super(props);

    this.client = new JesqueAdminClient();

    this.state = {
      loading: false,
      list: null,
      total: 0,
      query: this.getQuery()
    };

    this.bindThiz('doUpdate');
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
    this.startInterval(this.doUpdate, 1000);
    this.props.changeAutoReload(true);
  }

  stopAutoUpdate() {
    this.props.changeAutoReload(false);
    this.stopInterval()
  }

  doUpdate() {
    this.assignState({loading: true}, ()=> {
      this.client.get('jobs', null, {max: this.getMax(), offset: this.getOffset(), query: this.getQuery()})
        .then((resp) => {
          if (resp.list.length === 0 && this.getOffset() !== 0) {
            this.navigate("/jobs", {query: this.getQuery(), max: this.getMax(), offset: 0})
          } else {
            this.assignState({list: resp.list, total: resp.total, loading: false});
          }
        }).catch(err=> {
        this.stopAutoUpdate();
        window.setError(err);
        this.assignState({loading: false})
      })
    });
  }

  getTableBody() {
    return _.map(this.state.list, (job)=> {
      return (
        <tr key={job.name} className={cx({"clickable": job.jobs > 0})} onClick={()=> {
          if (job.jobs > 0) {
            navigate(`/jobs/${job.name}`)
          }
        }}>
          <td>{job.name}</td>
          <td>{job.jobs}</td>
        </tr>
      )
    })
  }

  onQueryChange(query) {
    this.navigate("/jobs", {query: query, offset: 0, max: this.getMax()});
  }

  render() {
    const {list, total} = this.state;
    const max = this.getMax();
    const offset = this.getOffset();
    const query = this.getQuery();
    if (!list) {
      return <div>loading</div>
    }
    return (
      <div className="jobs-list">
        <div className="page-header">
          <h3>Jobs</h3>
        </div>
        <div className="filter-form">
          <div className="filter">
            <input className="form-control" placeholder="Search" type="text" value={query} onChange={(e)=> {
              this.onQueryChange(e.target.value)
            }}/>
          </div>
        </div>
        <table className="table">
          <tbody>
          {this.getTableBody()}
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
              this.navigate("/jobs/", {max: max, offset: max * pageObject.selected})
            }}
          />
        </nav>
      </div>
    )
  }

}
