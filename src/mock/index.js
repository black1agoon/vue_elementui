import Mock from 'mockjs'
let logindata = require('./assets/login.json')

// Mock.mock('/service/public/login', logindata)


var template = {
  'key|1-10': '★'
}
Mock.toJSONSchema(template)

console.log(Mock)