import React from "react";
import {map} from "lodash";
import NavbarItem from "./nav-item";
import {JOB_LINKS, HOME, QUEUE_LIST, WORKERS_LINKS} from "../../constants/paths";

export default class Navbar extends React.Component {

  getLinks(list, isSubmenu) {
    return map(list, (link) => {
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
    return (
      <nav className="sidebar">
        <ul >
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
          <NavbarItem
            submenu={false}
            pathInfo={QUEUE_LIST}
          />
          <li className="disabled">
            <a>
              Workers
            </a>
          </li>
          {this.getLinks(WORKERS_LINKS, true)}
        </ul>
      </nav>
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
