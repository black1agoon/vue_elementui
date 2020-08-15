import Mock from 'mockjs'
import { treeExpand } from '@/assets/js/utils'

const Random = Mock.Random

const userData = require('../data/user.json')

function getPaged(options) {
  var query = JSON.parse(options.body)
  if (!localStorage.getItem('userData')) {
    localStorage.setItem('userData', JSON.stringify(userData.data.records))
  }
  var list = JSON.parse(localStorage.getItem('userData'))

  Object.keys(query).filter(key => key !== 'page' && key !== 'pageSize' && key !== 'depId').forEach(key => {
    if (query[key] !== null && query[key] !== '') {
      list = list.filter(li => li[key] === query[key])
    }
  })
  if (query.depId) {
    var depData = JSON.parse(localStorage.getItem('depData'))  // 部门数据
    var deplist = treeExpand(depData, 'childDepartmentDtoList')
    var target = deplist.find(dep => dep.id === query.depId)
    // 获取 点击的节点 获取该节点下的所有部门id
    var nodelist = treeExpand([target], 'childDepartmentDtoList').map(dep => dep.id)
    list = list.filter(li => nodelist.includes(li.depId))
  }

  var showlist = list.slice((query.page - 1) * query.pageSize, query.page * query.pageSize)
  return {
    data: {
      records: showlist,
      total: list.length,
    },
    code: '00'
  }
}

// 获取单个用户信息
function get(options) {
  var userData = JSON.parse(localStorage.getItem('userData'))
  var params = JSON.parse(options.body)
  for( let index in userData) {
    if (userData[index].id === params.id) {
      var user = userData[index]
      return {
        data: {
          user,
          roleList: []
        },
        code: '00',
        message: 'success'
      }
    }
  }
}

function update(options) {
  var list = JSON.parse(localStorage.getItem('userData'))
  var user = JSON.parse(options.body)
  // 遍历 userlist 根据传入对象的 id 更新用户信息
  for ( let index in list ) {
    if ( list[index].id === user.id ) {
      list[index] = user
    }
  }
  localStorage.setItem('userData', JSON.stringify(list))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function add(options) {
  // 先从 localStorage 中拉取数据
  var list = JSON.parse(localStorage.getItem('userData'))
  var user = JSON.parse(options.body)
  user.id = Random.id()
  list.unshift(user)
  localStorage.setItem('userData', JSON.stringify(list))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function _delete(options) {
  var list = JSON.parse(localStorage.getItem('userData'))
  var params = JSON.parse(options.body)
  list = list.filter(li => !params.id.includes(li.id))
  localStorage.setItem('userData', JSON.stringify(list))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function toggleUser(options) {
  var list = JSON.parse(localStorage.getItem('userData'))
  var params = JSON.parse(options.body)
  list.forEach(li => {
    if (params.idList.includes(li.id)) {
      li.enabled = [1, 0][li.enabled]
    }
  })
  localStorage.setItem('userData', JSON.stringify(list))
  return {
    data: list,
    code: '00',
    message: 'success'
  }
}


Mock.mock('/service/admin/user/paged', 'post', getPaged)
Mock.mock('/service/admin/user/get', 'post', get)
Mock.mock('/service/admin/user/update', 'post', update)
Mock.mock('/service/admin/user/add', 'post', add)
Mock.mock('/service/admin/user/del', 'post', _delete)
Mock.mock('/service/admin/user/enable', 'post', toggleUser)
Mock.mock('/service/admin/user/disable', 'post', toggleUser)