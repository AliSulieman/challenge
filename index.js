const http = require('http')
const serv = require('./user-service/service')
const db = require('./db/db')
const url = require('url');


const busPatrolDB = new db.BusPatrolDB("./db/buspatrol.db")

const router = http.createServer(function (req, res) {


    busPatrolDB.connectReadOnly(function (err) {
        if (err) {
            res.writeHead(500)
            res.write(JSON.stringify({
                message: "Internal Server Error"
            }))
        }
    })

    const userService = new serv.UserService(busPatrolDB.DB)
    var baseURL = 'http://' + req.headers.host + '/';
    const requestURL = new url.URL(req.url, baseURL)
    const urlParts = requestURL.pathname.split("/users")
    console.log(urlParts)

    // serv.user(req, res)
    //     } else {
    //     console.log(url)
    //     res.write('hello BusPatrol')
    //     res.end()
    // }
})


router.listen(5000)


