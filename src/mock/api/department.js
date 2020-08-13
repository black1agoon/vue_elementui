import Mock from 'mockjs'

let departmentData = require('../data/department.json')

const Random = Mock.Random
// 设置全局延时，没有延时的话，有时候会检测不到数据变化
Mock.setup({
  timeout: '300-600'
})

// 获取用户信息列表
function getTreeData() {
  // 若 localStorage 没有数据，则将 Mock 的数据存入
  if (!localStorage.getItem('depData')) {
    localStorage.setItem('depData',JSON.stringify(departmentData.data))
  }
  return departmentData
}

function getInfo(options) {
  var depData = JSON.parse(localStorage.getItem('depData'))
  for( let index in userlist) {
    if (userlist[index].id === options.body) {
      var user = userlist[index]
      return user
    }
  }
}

// 删除用户信息
function deleteInfo(options) {
  // 先从 localStorage 中拉取数据
  var userlist = JSON.parse(localStorage.getItem('userlist'))
  // 根据传递的 id 删除 用户
  for( let index in userlist ) {
    if (userlist[index].id === options.body) {
      userlist.splice(index,1)
      localStorage.setItem('userlist', JSON.stringify(userlist))
    }
  }
  return {
    data: '用户删除成功'
  }
}

// 添加用户信息
function addInfo(options) {
  // 先从 localStorage 中拉取数据
  var userlist = JSON.parse(localStorage.getItem('userlist'))
  // 获取传入用户信息对象，是一个字符串，需要转化为对象
  var user = JSON.parse(options.body)
  // 使用 mock 随机生成一个 id
  user.id = Random.id()
  // 将 user 插入到 userlist 中
  userlist.unshift(user)
  // 重新将 userlist 存入 localStorage 中
  localStorage.setItem('userlist', JSON.stringify(userlist))
  return {
    data: {
      message: '用户添加成功'
    },
    code: '00'
  }
}

// 更新用户信息
function updateInfo(options) {
  // 先从 localStorage 中拉取数据
  var userlist = JSON.parse(localStorage.getItem('userlist'))
  var user = JSON.parse(options.body)
  // 遍历 userlist 根据传入对象的 id 更新用户信息
  for ( let index in userlist ) {

    if ( userlist[index].id === user.id ) {
      userlist[index] = user
    }
  }
  localStorage.setItem('userlist', JSON.stringify(userlist))
  return {
    data: {
      message: '用户编辑成功'
    },
    code: '00'
  }
}

Mock.mock('/service/admin/department/tree', getTreeData)

Mock.mock('/service/mock/getuser', 'post', getInfo)
Mock.mock('/service/mock/deleteuser', 'get', deleteInfo)
Mock.mock('/service/mock/adduser', 'post', addInfo)
Mock.mock('/service/mock/updateuser', 'post', updateInfo)
