const http = require('http')
const db = require('../db/db')

class UserService {

    constructor(dbConnection) {
        this.dbConnection = dbConnection

    }

    handleGetUserJobByName(username, responseCallback) {
        const err = validateString(username)
        if (err !== null) {

            const response = {
                code: 400,
                body: {
                    message: "Failed Validation",
                    extra_info: err.message,
                }
            }
            responseCallback(response)
        } else {
            this.dbConnection.getUserJobByUserName(username, function (result, username, err) {
                let response = {}
                if (err !== null) {
                    if (err === db.ErrNoRecord) {
                        response.code = 404
                        response.body = { message: username + " does not exist" }
                    }
                    else if (err === db.ErrNoJob) {
                        response.code = 404
                        response.body = { message: username + " does not have a job" }
                    } else {

                        response.code = 500
                        response.body = { message: "Internal Server error" }
                    }
                }
                else {
                    response.code = 200
                    response.body = {
                        job_title: result.title,
                        job_description: result.description
                    }
                }
                //At the end return back the built response
                responseCallback(response)
            })
        }

    }
}
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