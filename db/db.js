const sqlite3 = require('sqlite3').verbose();


var ErrNoRecord = new Error("User does not exist")
var ErrNoJob = new Error("User does not have a job")


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
            errCallback(new Error("Database connection failed"))
        }
        //If no exception thrown then database
        //connected successfully
        this.DB = db
    }

    closeConnection(errCallback) {

        if (!this.DB) {
            errCallback(new Error("There is no database connection to close"))
        } else {
            this.DB.close(errCallback)
        }
    }

    getUserJobByUserName(username, resultCallBack) {

        const err = validateString(username)
        if (err !== null) {
            resultCallBack(null, username, newErr)
        }

        //Make sure there is a database connection
        //in case method used before db connect
        if (!this.DB) {
            resultCallBack(null, username, new Error("There is no database connection in the class. Use one of the class connection methods"))
        }

        const handleStmtCallback = (stmt, err) => {
            if (err) {
                resultCallBack(null, username, err)
            } else {
                return stmt
            }
        }

        //Prepare the statemnt to ensure now injeection occurs
        let stmt = this.DB.prepare(`SELECT title, description
                    FROM users LEFT JOIN jobs on users.job = jobs.id
                    WHERE users.name = ?`, handleStmtCallback)

        //query the db with the prepared statemnt
        stmt.get(username, (err, row) => {
            if (err) {
                resultCallBack(null, username, err)
            } else {
                //row returned but it could be empty row
                if (!row) {
                    resultCallBack(null, username, ErrNoRecord)
                } else if (row.name == null && row.description == null) {
                    resultCallBack(null, username, ErrNoJob)
                } else {
                    resultCallBack(row, username, null)
                }
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

