import React from "react";
import {map} from "lodash";
import NavbarItem from "./nav-item";
import {JOB_LINKS, HOME, QUEUE_LIST, WORKERS_LINKS} from "../../constants/paths";
const cx = require('classnames');

export default class Navbar extends React.Component {

  getLinks(list, isSubmenu) {
    let monitoringEnabled = window.AppConfig.isMonitoringEnabled;
    return map(list, (link) => {
      if (monitoringEnabled || (!monitoringEnabled && !link.monitoring))
        return (
          <NavbarItem
            key={link.name}
            submenu={isSubmenu}
            pathInfo={link}
          />
        )
    })
  }

  render() {
    const {autoReload, changeAutoReload} = this.props;
    return (
      <ul className="upper">
        <NavbarItem
          submenu={false}
          pathInfo={HOME}
        />
        <li className="disabled">
          <a>
            Jobs
          </a>
        </li>
        {this.getLinks(JOB_LINKS, true)}
        <li className="disabled">
          <a>
            Workers
          </a>
        </li>
        {this.getLinks(WORKERS_LINKS, true)}
        <li className="disabled">
          <a href="javascript: void(0)" onClick={()=> {
            changeAutoReload(!autoReload)
          }}>
            <i className={cx('fa', 'fa-refresh', {"fa-spin": autoReload})}></i> Auto Reload
          </a>
        </li>
      </ul>
    )
  }
}


/**
 <button
 type="button"
 className="navbar-toggle collapsed"
 aria-expanded="false"
 aria-controls="navbar">
 <span className="sr-only">Toggle navigation</span>
 <span className="icon-bar"></span>
 <span className="icon-bar"></span>
 <span className="icon-bar"></span>
 </button>**/
