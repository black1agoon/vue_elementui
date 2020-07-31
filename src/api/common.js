import axios from 'axios'
import store from '../store'
import router from '../router'
import { Message } from 'element-ui'

axios.interceptors.request.use(config => {
  config.headers.token = store.state.admin.token
  return config
}, error => {
  console.error(error)
})

export const request = (method, url, params, data = null) => {
  // get -> params  post -> data
  if (method === 'post' && !data && typeof params === 'object') {
    data = params
    params = null
  }
  return axios({method, url, params, data}).then((res) => {
    console.log(res)
    if (res.status === 200) {
      if (res.data && res.data.code === '00') {
        return res.data.data
      } else {
        Message.error(res.data.msg)
        if (res.data.code === '100' || res.data.code === '101') {
          router.push('/login')
        }
        return Promise.reject(res.data)
      }
    }
  }).catch(error => {
    // TODO
    return Promise.reject(error)
  })
}


