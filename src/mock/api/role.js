import Mock from 'mockjs'
// import { urlParse } from '@/assets/js/utils'

const Random = Mock.Random

const roleData = require('../data/role.json')

function getPaged(options) {
  var query = JSON.parse(options.body)
  if (!localStorage.getItem('rolelist')) {
    localStorage.setItem('rolelist', JSON.stringify(roleData.data.records))
  }
  var list = JSON.parse(localStorage.getItem('rolelist'))
  var showlist = list.slice((query.page - 1) * query.pageSize, query.page * query.pageSize)
  return {
    data: {
      records: showlist,
      total: list.length,
    },
    code: '00'
  }
}

function update(options) {
  var list = JSON.parse(localStorage.getItem('rolelist'))
  var role = JSON.parse(options.body)
  // 遍历 userlist 根据传入对象的 id 更新用户信息
  for ( let index in list ) {
    if ( list[index].id === role.id ) {
      list[index] = role
    }
  }
  localStorage.setItem('rolelist', JSON.stringify(list))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function add(options) {
  // 先从 localStorage 中拉取数据
  var list = JSON.parse(localStorage.getItem('rolelist'))
  var role = JSON.parse(options.body)
  // 使用 mock 随机生成一个 id
  role.id = Random.id()
  list.unshift(role)
  localStorage.setItem('rolelist', JSON.stringify(list))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function _delete(options) {
  var list = JSON.parse(localStorage.getItem('rolelist'))
  var params = JSON.parse(options.body)
  for( let index in list ) {
    if (list[index].id === params.id) {
      list.splice(index, 1)
      localStorage.setItem('rolelist', JSON.stringify(list))
    }
  }
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

Mock.mock('/service/admin/role/paged', 'post', getPaged)
Mock.mock('/service/admin/role/update', 'post', update)
Mock.mock('/service/admin/role/add', 'post', add)
Mock.mock('/service/admin/role/del', 'post', _delete)