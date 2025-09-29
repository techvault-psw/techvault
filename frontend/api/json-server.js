const jsonServer = require('json-server')
const server = jsonServer.create()

const router = jsonServer.router('backend-mock.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use('/api', router)

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  server(req, res)
}