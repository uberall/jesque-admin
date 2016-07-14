import React from 'react'
const navigate = require('react-mini-router').navigate;

export default class Link extends React.Component {
  render() {
    return (
      <a href="javascript: void(0)" className={this.props.className} onClick={() => {
        navigate(this.props.path)
      } }>{this.props.children}</a>
    )
  }
}
