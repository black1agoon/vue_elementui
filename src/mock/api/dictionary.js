import Mock from 'mockjs'
import { urlParse } from '@/assets/js/utils'

const Random = Mock.Random

const dictionaryData = require('../data/dictionary.json')

var attrValue = [
  {
    "attrCode":"0001",
    "code":"00010002",
    "hotkey":"",
    "id":"c5e974a5678c4fce96ce9326fbafe209",
    "memo":"famale",
    "name":"女",
    "pid":"588c14bcd87840abbca3163b8843a856",
    "property":"",
    "seq":10,
    "version":1
  },
  {
    "attrCode":"0001",
    "code":"00010001",
    "hotkey":"",
    "id":"63d49923ef244d16bb82228e1a8481d3",
    "memo":"male",
    "name":"男",
    "pid":"588c14bcd87840abbca3163b8843a856",
    "property":"",
    "seq":10,
    "version":1
  }
]

function getPaged(options) {
  var query = JSON.parse(options.body)
  if (!localStorage.getItem('dictionarylist')) {
    localStorage.setItem('dictionarylist', JSON.stringify(dictionaryData.data.records))
  }
  // 每次获取数据时，再从 localStorage 中拉取数据
  var list = JSON.parse(localStorage.getItem('dictionarylist'))
  var showlist = list.slice((query.page - 1) * query.pageSize, query.page * query.pageSize)
  return {
    data: {
      records: showlist,
      total: list.length,
    },
    code: '00'
  }
}

// 更新
function updateAttrCode(options) {
  var list = JSON.parse(localStorage.getItem('dictionarylist'))
  var dirctionary = JSON.parse(options.body)
  // 遍历 userlist 根据传入对象的 id 更新用户信息
  for ( let index in list ) {
    if ( list[index].id === dirctionary.id ) {
      list[index] = dirctionary
    }
  }
  localStorage.setItem('dictionarylist', JSON.stringify(list))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function deleteAttrCode(options) {
  var list = JSON.parse(localStorage.getItem('dictionarylist'))
  var params = urlParse(options.url)
  for( let index in list ) {
    if (list[index].id === params.id) {
      list.splice(index, 1)
      localStorage.setItem('dictionarylist', JSON.stringify(list))
    }
  }
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function addAttrCode(options) {
  // 先从 localStorage 中拉取数据
  var list = JSON.parse(localStorage.getItem('dictionarylist'))
  var codelist = list.map(li => Number(li.code))
  var dictionary = JSON.parse(options.body)
  // 使用 mock 随机生成一个 id
  dictionary.id = Random.id()

  var getNoRepeatCode = () => {
    var number = Random.natural(0, 9999)
    if (codelist.includes(number)) {
      getNoRepeatCode()
    } else {
      dictionary.code = ('0000' + number).substring(number.toString().length)
    }
  }
  getNoRepeatCode()
  list.unshift(dictionary)
  localStorage.setItem('dictionarylist', JSON.stringify(list))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function getPagedByAttrCode(options) {
  var query = JSON.parse(options.body)
  if (!localStorage.getItem('attrValuelist')) {
    localStorage.setItem('attrValuelist', JSON.stringify(attrValue))
  }
  var list = JSON.parse(localStorage.getItem('attrValuelist')).filter(val => val.attrCode === query.attrCode)
  var showlist = list.slice((query.page - 1) * query.pageSize, query.page * query.pageSize)
  return {
    data: {
      records: showlist,
      total: list.length,
    },
    code: '00'
  }
}

function updateAttrValue(options) {
  var list = JSON.parse(localStorage.getItem('attrValuelist'))
  var attrvalue = JSON.parse(options.body)
  for ( let index in list ) {
    if ( list[index].id === attrvalue.id ) {
      list[index] = attrvalue
    }
  }
  localStorage.setItem('attrValuelist', JSON.stringify(list))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function addAttrValue(options) {
  // 先从 localStorage 中拉取数据
  var list = JSON.parse(localStorage.getItem('attrValuelist'))
  var dictionarylist = JSON.parse(localStorage.getItem('dictionarylist'))
  var attrvalue = JSON.parse(options.body)

  attrvalue.id = Random.id()
  attrvalue.code = Random.natural(10000000, 99999999)
  attrvalue.attrCode = dictionarylist.find(dict => dict.id === attrvalue.pid).code
  list.unshift(attrvalue)
  localStorage.setItem('attrValuelist', JSON.stringify(list))
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}

function deleteAttrValue(options) {
  var list = JSON.parse(localStorage.getItem('attrValuelist'))
  var params = urlParse(options.url)
  for( let index in list ) {
    if (list[index].id === params.id) {
      list.splice(index, 1)
      localStorage.setItem('attrValuelist', JSON.stringify(list))
    }
  }
  return {
    data: '',
    code: '00',
    message: 'success'
  }
}


Mock.mock('/service/attrCode/paged', 'post', getPaged)
Mock.mock('/service/attrCode/add', 'post', addAttrCode)
Mock.mock('/service/attrCode/update', 'post', updateAttrCode)
Mock.mock(new RegExp('/service/attrCode/del'), 'get', deleteAttrCode)

Mock.mock('/service/admin/attrValue/getPagedByAttrCode', 'post', getPagedByAttrCode)
Mock.mock('/service/admin/attrValue/add', 'post', addAttrValue)
Mock.mock('/service/admin/attrValue/update', 'post', updateAttrValue)
Mock.mock(new RegExp('/service/admin/attrValue/del'), 'get', deleteAttrValue)

