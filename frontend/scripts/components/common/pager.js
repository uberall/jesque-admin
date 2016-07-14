import React from "react";
import BaseComponent from "../base-component";
import {times} from "lodash";
import ReactPaginate from "react-paginate";
const navigate = require('react-mini-router').navigate;
let cx = require('classnames');

export default class Pager extends BaseComponent {

  constructor(props) {
    super(props)
    this.bindThiz("getPageItems", "changePage")
  }

  getPageItems() {
    return times(this.props.pages + 1, (p)=> {
      if (p > 0) {
        let c = cx({active: p === this.props.current})
        return (
          <li className={c} key={`pager-page-${p}`}><a href="javascript: void(0)" onClick={(e)=> {
            this.changePage(p)
          }}>{p}</a></li>
        )
      }
    })
  }

  changePage(page) {
    debugger
    navigate(`${this.props.target}/${page}`)
    if (this.props.onPageChange) {
      this.props.onPageChange(page)
    }
  }

  render() {
    return (
      <nav>
        <ReactPaginate
          pageNum={this.props.pages}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          previousLabel="&laquo;"
          nextLabel="&raquo;"
          breakLabel={<a>&hellip;</a>}
          initialSelected={this.props.current}
          containerClassName="pagination"
          disabledClassName="disabled"
          activeClassName="active"
          clickCallback={(pageObject)=> {
            if(this.props.current !== pageObject.selected) {
              this.changePage(pageObject.selected)
            }
          }}
        />
      </nav>
    )
  }
}
Pager.propTypes = {
  pages: React.PropTypes.number.isRequired,
  current: React.PropTypes.number.isRequired,
  target: React.PropTypes.string.isRequired,
  onPageChange: React.PropTypes.func
};
