const querystring = require('querystring')

export default class JesqueAdminClient {

  get(target, id, query) {
    let path = this.buildPath(target, id, query);
    return fetch(path, {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: false
    }).then((res)=> {
      return res.json()
    })
  }

  delete(target, id, query) {
    let path = this.buildPath(target, id, query);
    return fetch(path, {
      method: 'DELETE',
      credentials: "same-origin",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: false
    }).then((res)=> {
      return res.json()
    })
  }

  post(target, id, data) {
    let path = this.buildPath(target, id, {});
    return fetch(path, {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: false,
      body: JSON.stringify(data)
    }).then((res)=> {
      return res.json()
    })
  }

  buildPath(target, id, query) {
    let path = window.AppConfig.links[target];
    if (id !== undefined && id !== null) {
      path = `${path}/${id}`
    }
    if (query) {
      path = `${path}?${querystring.stringify(query)}`
    }
    return path
  }

}
