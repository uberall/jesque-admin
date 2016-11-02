import React from "react";
import _ from "lodash";
import Config from "../tools/config";
import {DEFAULT_INTERVAL} from "../tools/config";
const navigate = require('react-mini-router').navigate;
const querystring = require('querystring');

export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    this.bindThiz('assignState')
  }

  bindThiz(...methods) {
    _.each(methods, (m)=> {
      let method = this[m];
      if (method && typeof method === 'function') {
        this[m] = method.bind(this)
      } else {
        console.error(`${m} is not a function on ${this.constructor.name}`)
      }
    })
  }


  getMax() {
    return parseInt(_.get(this.props.params, 'max') || 25);
  }

  getOffset() {
    return parseInt(_.get(this.props.params, 'offset') || 0);
  }

  getQuery() {
    return _.get(this.props.params, 'query') || "";
  }

  startInterval(fn, int) {
    this.stopInterval() // make sure we are only starting one interval
    int = int && int > 1000 ? int : Config.get(DEFAULT_INTERVAL, 2000);
    this._interval = setInterval(fn, int)
  }

  stopInterval() {
    if (this._interval)
      clearInterval(this._interval)
  }

  assignState(updates, cb) {
    try {
      this.setState(_.assign(this.state, updates), cb)
    } catch (e) {
      this.stopInterval();
      throw e
    }
  }

  navigate(target, query, onylAddressBar) {
    let url = target;
    if (query) {
      url = `${url}?${querystring.stringify(query)}`;
    }
    navigate(url, onylAddressBar || false)
  }

}
