import Mock from 'mockjs'

let menudata = require('../data/menu.json')
Mock.mock('/service/admin/permission/newpermission', menudata)