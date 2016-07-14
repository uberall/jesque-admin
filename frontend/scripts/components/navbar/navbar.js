import React from 'react';
import {map} from 'lodash';
import Link from '../common/link';

const JOB_LINKS = {
  '/jobs/list': 'List',
  '/jobs/failed': 'Failed',
  '/jobs/enqueue': 'Enqueue',
  '/jobs/scheduled': 'Scheduled',
  '/jobs/delayed': 'Delayed'
}

export default class Navbar extends React.Component {

  getJobLinks() {
    return map(JOB_LINKS, (v, k) => {
      return (<li key={`link-jobs-${k}`}><Link path={k}>{v}</Link></li>)
    })
  }

  render() {
    return (
      <nav className="navbar navbar-inverse navbar-static-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#navbar"
              aria-expanded="false"
              aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <div id="navbar" className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li className="active"><a href="#">Home</a></li>
              <li className="dropdown">
                <a href="#"
                   className="dropdown-toggle"
                   data-toggle="dropdown"
                   role="button"
                   aria-haspopup="true"
                   aria-expanded="false">
                  Jobs <span className="caret"></span>
                </a>
                <ul className="dropdown-menu">
                  {this.getJobLinks()}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
