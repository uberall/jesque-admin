import React from "react";
import BaseComponent from "../base-component";
import {times} from "lodash";
import ReactPaginate from "react-paginate";
let cx = require('classnames');

export default class Pager extends BaseComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const {pages, current, onPageChange, disabled} = this.props;
    return (
      <nav>
        <ReactPaginate
          pageNum={pages}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          previousLabel="&laquo;"
          nextLabel="&raquo;"
          breakLabel={<a>&hellip;</a>}
          forceSelected={current - 1}
          containerClassName={cx('pagination', {'disabled': disabled})}
          disabledClassName="disabled"
          activeClassName="active"
          clickCallback={(pageObject)=> {
            onPageChange(pageObject.selected)
          }}
        />
      </nav>
    )
  }
}
Pager.propTypes = {
  pages: React.PropTypes.number.isRequired,
  current: React.PropTypes.number.isRequired,
  onPageChange: React.PropTypes.func
};
