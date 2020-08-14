import Mock from 'mockjs'
import { urlParse } from '@/assets/js/utils'

const Random = Mock.Random
// 设置全局延时，没有延时的话，有时候会检测不到数据变化
Mock.setup({
  timeout: '300-600'
})
// 创建一个数组用来接收模拟的数据
const mocklist = []
const count = 55;

for (let i = 0; i < count; i++) {
  mocklist.push(Mock.mock({
    id: '@id',
    name: '@cname',
    'phone|1': /^1[0-9]{10}$/,
    email: '@email',
    'education|1': ['本科', '大专', '硕士', '博士', '中专'],
    'graduationschool|1': ['西南财经', '北京交通大学', '重庆工商大学', '清华大学', '西南大学', '上海复旦大学'],
    'profession|1': ['教授', '律师', '医生', '公务员', '大学老师', '警察', '白领'],
    profile: '@cparagraph'
  }))
}

// 获取用户信息列表
function getList(options) {
  var query = JSON.parse(options.body)
  // 若 localStorage 没有数据，则将 Mock 的数据存入
  if (!localStorage.getItem('userlist')) {
    localStorage.setItem('userlist',JSON.stringify(mocklist))
  }
  // 每次获取数据时，再从 localStorage 中拉取数据
  var userlist = JSON.parse(localStorage.getItem('userlist'))
  var showlist = userlist.slice((query.page - 1) * query.pageSize, query.page * query.pageSize)
  return {
    data: {
      records: showlist,
      total: userlist.length,
    },
    code: '00'
  }
}

// 获取单个用户信息
function getUser(options) {
  var userlist = JSON.parse(localStorage.getItem('userlist'))
  var params = urlParse(options.url)
  for( let index in userlist) {
    if (userlist[index].id === params.id) {
      var user = userlist[index]
      return {
        data: user,
        code: '00',
        message: 'success'
      }
    }
  }
}

// 删除用户信息
function deleteUser(options) {
  var userlist = JSON.parse(localStorage.getItem('userlist'))
  var params = urlParse(options.url)
  for( let index in userlist ) {
    if (userlist[index].id === params.id) {
      userlist.splice(index,1)
      localStorage.setItem('userlist', JSON.stringify(userlist))
    }
  }
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

// 添加用户信息
function addUser(options) {
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
function updateUser(options) {
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

// 用户模块
Mock.mock('/service/mock/paged', 'post', getList)
Mock.mock(/\/service\/mock\/getuser/, 'get', getUser)
Mock.mock(/\/service\/mock\/deleteuser/, 'get', deleteUser)
Mock.mock('/service/mock/adduser', 'post', addUser)
Mock.mock('/service/mock/updateuser', 'post', updateUser)
// 最后将 Mock 导出
// export default Mock