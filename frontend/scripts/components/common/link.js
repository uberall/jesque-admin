import React from "react";
const navigate = require('react-mini-router').navigate;

export default class Link extends React.Component {
  render() {
    const pathInfo = this.props.pathInfo;
    return (
      <a href="javascript: void(0)" className={this.props.className} onClick={() => {
        window.currentPath = pathInfo
        navigate(pathInfo.path)
      } }>{pathInfo.text}</a>
    )
  }
}
