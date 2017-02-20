const http = require('http')
const URL = require('url')
const querystring = require('querystring')
    
    
let app = {
    Request: (data, callback) => {
        let type = data.type
        let headers = data.headers
        let from = data.from
        let RequestDate = URL.parse((data.url.startsWith('http://') == false) ? 'http://' + data.url : data.url)
        app.Server({
            host: (RequestDate.host != null) ? RequestDate.host : 'localhost',
            port: (RequestDate.port != null) ? RequestDate.port : '80',
            path: (RequestDate.path != null) ? RequestDate.path : '/',
            method: (typeof type !== 'undefined') ? type : 'GET',
            headers: (typeof headers !== 'undefined') ? headers : {
                "Connection":"keep-alive",
                "X-Requested-With":"XMLHttpRequest",
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
            }
        }, (typeof from !== 'undefined' && type == 'POST') ? from : undefined, (back, head) => {
            callback(back, head)
        })      
    },
    Server: (options, from, callback) => {
        let req = http.request(options, (response) => {
            let arrBuf = []
            let bufLength = 0
            response.on('data', (data) => {
                arrBuf.push(data)
                bufLength += data.length
            })
            response.on('end', () => {
                let chunkAll = Buffer.concat(arrBuf, bufLength)
                callback(chunkAll, response.headers)
            })
            req.on('error', (e) => {
                console.log(e.message)
            })
        })
        if(typeof from !== 'undefined' && typeof from === 'object'){
            req.write(querystring.stringify(from))
        }
        req.end()
    }
}

module.exports = app