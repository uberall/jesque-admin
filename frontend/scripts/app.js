import React from "react";
import ReactDom from "react-dom";
import Navbar from "./components/navbar/navbar";
import HomeView from "./components/home/home";
import QueueDetails from "./components/queues/details";
import FailedList from "./components/jobs/failed";
var RouterMixin = require('react-mini-router').RouterMixin;

var JesqueAdminApp = React.createClass({
  mixins: [RouterMixin],

  routes: {
    '/': 'home',
    '/404': 'notFound',
    '/jobs/failed/:page': 'failedJobs',
    '/queues/:name': 'queueDetails',
    '/queues/:name/:page': 'queueDetails'
  },

  render: function () {
    return <div>
      <Navbar />
      <div className="container-fluid">
        {this.renderCurrentRoute()}
      </div>
    </div>
  },

  queueDetails: (name, page) => {
    return <QueueDetails name={name} page={parseInt(page) || 1}/>
  },

  home: function () {
    return <HomeView />;
  },

  notFound: function (path) {
    return (
      <div class="not-found">
        Page Not Found: {path}
      </div>);
  },

  failedJobs: function (page) {
    try {
      page = parseInt(page)
    } catch (ignore) {
      page = 1
    }
    return <FailedList page={page}/>;
  },

});

ReactDom.render(<JesqueAdminApp history={false}/>, document.getElementById('jesque-admin-container'));
