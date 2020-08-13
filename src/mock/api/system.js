// 登录接口
import Mock from 'mockjs'

let logindata = require('../data/login.json')
Mock.mock('/service/public/login', logindata)