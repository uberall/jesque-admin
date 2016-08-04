import React from 'react'
const cx = require('classnames');
import {map} from 'lodash';

export default class FilterButtonGroup extends React.Component {

  getFilterButtons() {
    return map(this.props.filters, (state) => {
      let buttonClasses = cx('btn', {"btn-success": this.props.current === state, "btn-default": this.props.current !== state})
      return (<button key={state} type="button" className={buttonClasses} onClick={()=> {
        this.props.onChange(state)
      }}>{state}</button>)
    })
  }

  render() {
    return (
      <div className="btn-group" role="group" aria-label="Worker State Filter">
        {this.getFilterButtons()}
      </div>
    )
  }
}
