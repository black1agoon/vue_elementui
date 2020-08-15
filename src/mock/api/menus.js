import Mock from 'mockjs'
import { urlParse } from '@/assets/js/utils'
const Random = Mock.Random
let menusData = require('../data/menus.json')

function getTreeData() {
  // 若 localStorage 没有数据，则将 Mock 的数据存入
  if (!localStorage.getItem('menusData')) {
    localStorage.setItem('menusData',JSON.stringify(menusData.data))
  }
  return {
    data: JSON.parse(localStorage.getItem('menusData')),
    code: '00',
    message: 'success'
  }
}

function updateInfo(options) {
  var menusData = JSON.parse(localStorage.getItem('menusData'))
  var menu = JSON.parse(options.body)
  var expand = treedata => {
    treedata.forEach(tdata => {
      if (tdata.id === menu.id) {
        Object.keys(tdata).forEach(key => {
          tdata[key] = menu[key]
        })
        return
      }
      tdata.childUserPermission && expand(tdata.childUserPermission)
    })
  }
  expand(menusData.permissionList)
  localStorage.setItem('menusData', JSON.stringify(menusData))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function addInfo(options) {
  var menusData = JSON.parse(localStorage.getItem('menusData'))
  var menu = JSON.parse(options.body)
  // 使用 mock 随机生成一个 id
  menu.id = Random.id()
  menu.childUserPermission = []

  var expand = treedata => {
    treedata.forEach(tdata => {
      if (tdata.id === menu.pid) {
        tdata.childUserPermission.push(menu)
        return
      }
      tdata.childUserPermission && expand(tdata.childUserPermission)
    })
  }
  expand(menusData.permissionList)
  localStorage.setItem('menusData', JSON.stringify(menusData))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function deleteInfo(options) {
  var menusData = JSON.parse(localStorage.getItem('menusData'))
  var params = urlParse(options.url)
  var expand = treedata => {
    treedata.forEach((tdata, index) => {
      if (tdata.id === params.idList) {
        treedata.splice(index, 1)
        return
      }
      tdata.childUserPermission && expand(tdata.childUserPermission)
    })
  }
  expand(menusData.permissionList)
  localStorage.setItem('menusData', JSON.stringify(menusData))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

Mock.mock('/service/admin/permission/newpermission', 'get', getTreeData)
Mock.mock('/service/admin/permission/add', 'post', addInfo)
Mock.mock('/service/admin/permission/update', 'post', updateInfo)
Mock.mock(new RegExp('/service/admin/permission/del'), 'get', deleteInfo)