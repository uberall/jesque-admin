import React from "react";
import {each} from "lodash";

export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  bindThiz(...methods) {
    each(methods, (m)=> {
      // console.log(`binding ${m}`)
      if (this[m]) {
        this[m] = this[m].bind(this)
      }
    })
  }

}
