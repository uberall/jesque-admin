import superagent from "superagent/lib/client";


export default class JesqueAdminClient {

  get(target, id, data, success, error) {
    let path = this.getPath(target)
    if (id) {
      path = `${path}/${id}`
    }
    return new Promise((resolve, reject)=> {
      superagent
        .get(path)
        .set('Accept', 'application/json')
        .query(data)
        .end((err, res)=> {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(res.text))
          }
        })
    })
  }

  getPath(target) {
    return window.AppConfig.links[target]
  }
}
