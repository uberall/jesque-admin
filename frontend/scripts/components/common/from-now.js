import React from "react";
const moment = require('moment')

export default class FromNow extends React.Component {
  render() {
    let mom = moment(this.props.date)
    return (
      <span title={mom.format("dddd, MMMM Do YYYY, h:mm:ss a")}>
        {mom.fromNow()}
      </span>
    )
  }
}
