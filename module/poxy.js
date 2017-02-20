const cluster = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length
const url = require('url')


if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
} else {
    let server = (opt, callback) => {
        let req = http.request(opt, (Response) => {
            let arrBuf = []
            let bufLength = 0
            Response.on('data', (data) => {
                arrBuf.push(data)
                bufLength += data.length
            })
            Response.on('end', () => {
                let chunkAll = Buffer.concat(arrBuf, bufLength)
                callback(Response.statusCode, Response.headers, chunkAll)
            })
            req.on('error', (err) => {
                console.log(err.message)
            })
        })
        req.end()
    }
    http.createServer( (request, response) => { 
        let UrlObj = url.parse(request.url)
        server({
            host: '120.76.240.24',
            port: (UrlObj.port == null) ? 80 : UrlObj.port,
            path:  UrlObj.path,
            method: request.method,
            headers: request.headers
        }, (Code, headers, data) => {
            response.writeHead(Code, headers)
            response.end(data)
        })
    }).listen(8989)
}
cluster.on('exit', () => {
    cluster.fork()
})