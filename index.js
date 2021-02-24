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
        handle_response(200, { message: "Hello BusPatrol" })
        return
    }
    if (req.method != "GET") {
        handle_response(400, { message: "Method Not Allowed" })
        return

    }
    if (req.url === "/users/") {
        handle_response(400, { message: "Must provide a name after /users/" })
        return
    }


    busPatrolDB.connectReadOnly(function (err) {
        if (err) {
            handle_response(500, { message: "Internal Server Error" })
            return
        }
    })


    const userService = new serv.UserService(busPatrolDB)
    var baseURL = 'http://' + req.headers.host + '/';
    const requestURL = new url.URL(req.url, baseURL)
    const urlParts = requestURL.pathname.split("/")

    indexOfUserResource = urlParts.indexOf("users")
    //if the users resource not requested then block it
    if (indexOfUserResource == -1) {
        handle_response(404, { message: "Invalid resource" })
        return
    }

    //check if anything after user is provided
    if (indexOfUserResource + 1 >= urlParts.length) {
        //this means only /users was provided
        handle_response(404, { message: "Must provide a name after /users/" })
        return
    }


    //Name must be after /users/ so the index of users mut be followed by the index of name
    var str = urlParts[indexOfUserResource + 1]
    userService.handleGetUserJobByName(str, function (result) {
        handle_response(result.code, result.body)
    })
    return
})
console.log("Starting server at port :5000")
router.listen(5000)


