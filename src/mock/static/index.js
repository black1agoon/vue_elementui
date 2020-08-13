// import Mock from 'mockjs'
// let logindata = require('./assets/login.json')
// Mock.mock('/service/public/login', logindata)

// /service/attrCode/paged
// console.log(Mock)

const jsonServer = require('json-server')
const db = require('./db.js');
const server = jsonServer.create()
const router = jsonServer.router(db)
const middlewares = jsonServer.defaults()
server.use(middlewares)
server.use(jsonServer.bodyParser)

// 拦截客户端请求,进行自定义处理
server.use((req, res, next) => {
  // 手动映射,更改请求url(/steps/step1 => /steps_step1)
  req.url = req.url.replace(/\//g, '_').replace('_', '/');
  next();
})

server.use(router)
server.listen(3004, () => {
  console.log('JSON Server is running')
})