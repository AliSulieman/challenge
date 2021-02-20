const sqlite3 = require('sqlite3').verbose();

// opening the database
let db = new sqlite3.Database('./buspatrol.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the BusPatrol database.');
});




