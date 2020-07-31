import Mock from 'mockjs'
let logindata = require('./assets/login.json')

Mock.mock('/service/public/login', logindata)