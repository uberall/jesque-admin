import React from "react";
const moment = require('moment')

export default class FormatDate extends React.Component {
  render() {
    return (
      <span>
        {moment(this.props.date).format("dddd, MMMM Do YYYY, h:mm:ss a")}
      </span>
    )
  }
}
