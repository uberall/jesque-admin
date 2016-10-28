import React from "react";
import {each, assign} from "lodash";
export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props)

    this.bindThiz('assignState')
  }

  bindThiz(...methods) {
    each(methods, (m)=> {
      let method = this[m];
      if (method && typeof method === 'function') {
        this[m] = method.bind(this)
      } else {
        console.error(`${m} is not a function on ${this.constructor.name}`)
      }
    })
  }

  assignState(updates, cb) {
    this.setState(assign(this.state, updates), cb)
  }

}
