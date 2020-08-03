// import Mock from 'mockjs'
// let logindata = require('./assets/login.json')
// Mock.mock('/service/public/login', logindata)

// /service/attrCode/paged
// console.log(Mock)
const path = require('path')
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()
server.use(middlewares)
server.use(router)
server.listen(3004, () => {
  console.log('JSON Server is running')
})