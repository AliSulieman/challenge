const { Console } = require('console');
const http = require('http')
const serv = require('./route/service.js')
http.createServer(function (req, res) {
    if (url === '/user/:username') {

        serv.user(req, res)
    } else {
        console.log(url)
        res.write('hello BusPatrol')
        res.end()
    }
}).listen(5000);
