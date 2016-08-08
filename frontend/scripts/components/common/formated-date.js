import React from "react";
const moment = require('moment')


const FORMAT = "dddd, MMMM Do YYYY, h:mm:ss a"
export default class FormatedDate extends React.Component {
  render() {
    let format = this.props.format || FORMAT
    return (
      <span>
        {moment(this.props.date).format(format)}
      </span>
    )
  }
}
