import {each} from "lodash";

module.exports = function (thiz, ...methods) {
  each(methods, (m)=> {
    let method = thiz[m];
    if (method && typeof method === 'function') {
      method = method.bind(thiz)
    } else {
      console.error(`${m} is not a function on ${this.constructor.name}`)
    }
  })
}
