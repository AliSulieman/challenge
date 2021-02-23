const http = require('http')
const serv = require('./user-service/service')
const db = require('./db/db')
const url = require('url');


const busPatrolDB = new db.BusPatrolDB("./db/buspatrol.db")

const router = http.createServer(function (req, res) {

    if (req.method != "GET") {
        res.setHeader('content-type', 'application/json');
        res.writeHead(400)
        res.write(JSON.stringify({
            message: "Method Not Allowed"
        }))
        res.end()
    }
    busPatrolDB.connectReadOnly(function (err) {
        if (err) {
            res.setHeader('content-type', 'application/json');
            res.writeHead(500)
            res.write(JSON.stringify({
                message: "Internal Server Error"
            }))
        }
    })

    const userService = new serv.UserService(busPatrolDB)
    var baseURL = 'http://' + req.headers.host + '/';

    const requestURL = new url.URL(req.url, baseURL)
    const urlParts = requestURL.pathname.split("/users")

    let str = urlParts[1].toString()
    str = str.substring(1)

    userService.handleGetUserJobByName(str, function (result) {
        res.setHeader('content-type', 'application/json');
        res.writeHead(result.code)
        res.write(JSON.stringify(result.body))
        res.end()

    })

})
router.listen(5000)


