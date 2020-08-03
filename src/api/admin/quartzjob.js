/* global PREV */
import {request} from '../common'
let prev = PREV
export default {
  quartzjob: {
    add(info) {
      return request('post', prev + '/quartzJob/insert', info)
    },
    update(info) {
      return request('post', prev + '/quartzJob/update', info)
    },
    delete(ids) {
      return request('post', prev + '/quartzJob/delete', ids)
    },
    paged(query) {
      return request('post', prev + '/quartzJob/paged', query)
    },
    run(id) {
      return request('get', prev + '/quartzJob/run/' + id)
    },
    control(obj) {
      return request('post', prev + '/quartzJob/control', obj)
    }
  },
  quartzGroup: {
    add(info) {
      return request('post', prev + '/quartzGroup/insert', info)
    },
    update(info) {
      return request('post', prev + '/quartzGroup/update', info)
    },
    delete(id) {
      return request('get', prev + '/quartzGroup/delete/' + id)
    },
    all() {
      return request('get', prev + '/quartzGroup/all')
    }
  },
  quartzjobLog: {
    paged(query) {
      return request('post', prev + '/quartzJobLog/paged', query)
    }
  }
}
