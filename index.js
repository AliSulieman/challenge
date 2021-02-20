const http = require('http')
const serv = require('./route/service.js')
http.createServer(function (req, res) {
    const url = req.url
    if (url === '/user') {
        serv.user(req, res)
    } else {
        res.write('hello BusPatrol')
        res.end()
    }
}).listen(5000);
