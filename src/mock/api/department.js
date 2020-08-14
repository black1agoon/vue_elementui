import Mock from 'mockjs'
const Random = Mock.Random
import { urlParse, treeExpand } from '@/assets/js/utils'

let departmentData = require('../data/department.json')
// 设置全局延时，没有延时的话，有时候会检测不到数据变化

function getTreeData() {
  // 若 localStorage 没有数据，则将 Mock 的数据存入
  if (!localStorage.getItem('depData')) {
    localStorage.setItem('depData',JSON.stringify(departmentData.data))
  }
  return {
    data: JSON.parse(localStorage.getItem('depData')),
    code: '00',
    message: 'success'
  }
}

function getInfo(options) {
  var depData = JSON.parse(localStorage.getItem('depData'))
  var params = urlParse(options.url)
  var deplist = treeExpand(depData, 'childDepartmentDtoList')
  return {
    code: '00',
    data: deplist.find(dep => dep.id === params.id),
    message: 'success'
  }
}

// 删除用户信息
function deleteInfo(options) {
  var depData = JSON.parse(localStorage.getItem('depData'))
  var params = urlParse(options.url)
  var expand = treedata => {
    treedata.forEach((tdata, index) => {
      if (tdata.id === params.id) {
        treedata.splice(index, 1)
        return
      }
      tdata.childDepartmentDtoList && expand(tdata.childDepartmentDtoList)
    })
  }
  expand(depData)
  localStorage.setItem('depData', JSON.stringify(depData))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

// 添加用户信息
function addInfo(options) {
  var depData = JSON.parse(localStorage.getItem('depData'))
  var dep = JSON.parse(options.body)
  // 使用 mock 随机生成一个 id
  dep.id = Random.id()
  dep.childDepartmentDtoList = []

  var expand = treedata => {
    treedata.forEach(tdata => {
      if (tdata.id === dep.pid) {
        tdata.childDepartmentDtoList.push(dep)
        return
      }
      tdata.childDepartmentDtoList && expand(tdata.childDepartmentDtoList)
    })
  }
  expand(depData)
  localStorage.setItem('depData', JSON.stringify(depData))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

// 更新用户信息
function updateInfo(options) {
  var depData = JSON.parse(localStorage.getItem('depData'))
  var dep = JSON.parse(options.body)
  var expand = treedata => {
    treedata.forEach(tdata => {
      if (tdata.id === dep.id) {
        Object.keys(tdata).forEach(key => {
          tdata[key] = dep[key]
        })
        return
      }
      tdata.childDepartmentDtoList && expand(tdata.childDepartmentDtoList)
    })
  }
  expand(depData)
  localStorage.setItem('depData', JSON.stringify(depData))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function getTreeNoOwn(options) {
  var depData = JSON.parse(localStorage.getItem('depData'))
  var dep = JSON.parse(options.body)
  var expand = treedata => {
    treedata.forEach((tdata, index) => {
      if (tdata.id === dep.id) {
        treedata.splice(index, 1)
        return
      }
      tdata.childDepartmentDtoList && expand(tdata.childDepartmentDtoList)
    })
  }
  expand(depData)
  return {
    data: depData,
    code: '00',
    message: 'success'
  }
}

Mock.mock('/service/admin/department/tree', getTreeData)
Mock.mock(new RegExp('/service/admin/department/get'), getInfo)

Mock.mock('/service/admin/department/add', 'post', addInfo)
Mock.mock('/service/admin/department/update', 'post', updateInfo)
Mock.mock(new RegExp('/service/admin/department/del'), 'get', deleteInfo)
Mock.mock('/service/admin/department/treeNoOwn', 'post', getTreeNoOwn)
