const app = require('../src/app')
const https = require('https')
const http = require('http')
const fs = require('fs')

try {
    let privateKey = fs.readFileSync('/home/felipe/util/node/certificate.key')
    let certificate = fs.readFileSync('/home/felipe/util/node/certificate.crt')
    let credentials = {key: privateKey, cert: certificate}
    const httpsServer = https.createServer(credentials, app)
    httpsServer.listen(3012)
} catch (e) {
    console.log(e.message)
}

try {
    const httpServer = http.createServer(app)
    httpServer.listen(3003)
} catch (e) {
    console.log(e.message)
}

console.log('Api de serviços rodando.')
