const http = require('http')
const db = require('../db/db')

class UserService {

    constructor(dbConnection) {
        this.dbConnection = dbConnection
    }

    handleGetUserJobByName(username, responseCallback) {

        response = {}
        const err = validateString(username)
        if (err !== null) {
            response.code = 400
            response.body = {
                message: "Failed Validation",
                extra_info: err.message,
            }
        } else {
            this.dbConnection.getUserJobByUserName(username, function (result, username, err) {

                if (err !== null) {
                    if (err.message === db.ErrNoRecord) {
                        response.code = 404
                        response.body = { message: username + "does not exist" }
                    }
                    else if (err.message === db.ErrNoJob) {
                        response.code = 404
                        response.body = { message: username + "does not have a job" }
                    } else {
                        console.log(err)
                        response.code = 500
                        response.body = { message: "Internal Server error" }
                    }
                } else {
                    response.code = 200
                    response.body = {
                        job_title: result.name,
                        job_description: result.description
                    }
                }
            })
        }

        //At the end return back the built response
        responseCallback(response)
    }
}

// exports.user = function (req, res) {
//     const payload = {
//         address: {
//             street: '123 ali',
//             city: "fun city"
//         }
//     }
//     res.writeHead(200, { 'Content-Type': "application/json" })
//     res.write(JSON.stringify(payload))
//     res.end()
// }
const validateString = (paramToValidate) => {

    if (typeof paramToValidate != "string") {
        return new Error("Paramater provided must be a string")
    }
    if (paramToValidate.trim().length < 1) {
        return new Error("Param provided must be at least a non-white space character")
    }
    return null
}

module.exports = { UserService }