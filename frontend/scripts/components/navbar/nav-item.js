import React from 'react'
import Link from '../common/link'
const cx = require('classnames')

export default class NavbarItem extends React.Component {

  render() {
    let pathInfo = this.props.pathInfo;
    let active = window.currentPath === pathInfo;
    let classes = cx({'active': active, 'submenu': this.props.submenu});
    return (
      <li className={classes}><Link pathInfo={pathInfo} /></li>
    )
  }

}
