const http = require('http')

exports.user = function (req, res) {
    const payload = {
        address: {
            street: '123 ali',
            city: "fun city"
        }
    }
    res.writeHead(200, { 'Content-Type': "application/json" })
    res.write(JSON.stringify(payload))
    res.end()
}