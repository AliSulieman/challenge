const http = require('http')
const serv = require('./user-service/service')
const db = require('./db/db')
const url = require('url');


const busPatrolDB = new db.BusPatrolDB("./db/buspatrol.db")

const router = http.createServer(function (req, res) {

    const handle_response = (stat_code, messages) => {
        res.setHeader('content-type', 'application/json');
        res.writeHead(stat_code)
        res.write(JSON.stringify(messages))
        res.end()
    }

    if (req.url === "/") {
        handle_response(200, "Hello BusPatrol")
        return
    }
    if (req.method != "GET") {
        handle_response(400, "Method Not Allowed")
        return

    }
    if (req.url === "/users/") {
        handle_response(400, "Must provide a name after /users/name")
        return
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

    var str = urlParts[1]
    if (str != null) {
        str = str.substring(1)
    }
    userService.handleGetUserJobByName(str, function (result) {
        handle_response(result.code, result.body)
    })
    return
})
router.listen(5000)


