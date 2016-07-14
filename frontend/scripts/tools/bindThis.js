import {each} from "lodash";

module.exports = function (thiz, ...methods) {
  each(methods, (m)=> {
    if (thiz[m]) {
      thiz[m] = thiz[m].bind(thiz)
    }
  })
}
