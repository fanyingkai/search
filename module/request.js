const http = require('http')
const urL = require('url')


let app = (request, headers, callback) => {
    let UrLObject = urL.parse(request)
    let req = http.request({
        host: UrLObject.host, 
        port:'80', 
        method:'GET', 
        path: UrLObject.path,
        headers: (headers != undefined) ? headers : {
            "Connection":"keep-alive",
            "X-Requested-With":"XMLHttpRequest",
            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
        }
    }, (response) => {
        let arrBuf = []
        let bufLength = 0
        response.on('data', (data) => {
            arrBuf.push(data)
            bufLength += data.length
        })
        response.on('end', () => {
            const chunkAll = Buffer.concat(arrBuf, bufLength)
            callback && callback(chunkAll.toString())
        })
        req.on('error', (e) => {
            console.log(e.message)
        })
    })
    req.end()
}

module.exports = app