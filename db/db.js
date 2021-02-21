const sqlite3 = require('sqlite3').verbose();

function DBerror(message) {
    this.message = message;
    this.name = 'UserException';
}

class busPatrolDB {

    constructor(dbFilePath) {
        this.dbFile = dbFilePath
    }

    connectReadOnly(errCallback) {

        //Make sure the database file name is a valid string
        const err = validateString(this.dbFile)
        if (err !== null) {
            errCallback(err)
        }

        //do the database connection
        const db = new sqlite3.Database(this.dbFile, sqlite3.OPEN_READONLY, err => {
            if (err) {
                errCallback(err)
            }
        });

        //This should never happen but if it did, still throw error
        if (!db) {
            errCallback(error("Database connection failed"))
        }
        //If no exception thrown then database
        //connected successfully
        this.DB = db
    }

    getUserJobByUserName(username, resultCallBack) {

        const err = validateString(username)
        if (err !== null) {
            resultCallBack(null, username, err)
        }

        //Make sure there is a database connection
        //in case method used before db connect
        if (!this.DB) {
            resultCallBack(null, username, error("There is no database connection in the class. Use one of the class connection methods"))
        }

        //Prepare the statemnt to ensure now injeection occurs
        let stmt = this.DB.prepare(`SELECT title, description
                    FROM users LEFT JOIN jobs on users.job = jobs.id
                    WHERE users.name = ?`, (stmt, err) => {
            if (err) {
                resultCallBack(null, username, err)
            } else {
                return stmt
            }
        })

        //query the db with the prepared statemnt
        stmt.get(username, (err, row) => {
            if (err) {
                resultCallBack(null, username, err)
            } else {
                resultCallBack(row, username, null)
            }
        })
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

const db = new busPatrolDB("./buspatrol.db")

const handleConnectErrorCallback = (err) => {
    if (err) {
        console.log(err)
    }
}

db.connectReadOnly(handleConnectErrorCallback)

const resultCallBack = (result, username, err) => {
    if (err) {
        console.log("Failed to get user job by user name", err)
    }
    else if (result) {
        if (result.title == null && result.description == null) {
            console.log(username + " has no job")
        } else {
            console.log(result)
        }
    }
    else {
        console.log("No record exists in the database")
    }
}

db.getUserJobByUserName("amer", resultCallBack)

