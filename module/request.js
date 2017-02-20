const http = require('http')
const urL = require('url')


let app = (request, headers, Callback) => {
    let server = (UrLObject, headers, back) => {
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
                let chunkAll = Buffer.concat(arrBuf, bufLength)
                back(chunkAll)
            })
            req.on('error', (e) => {
                console.log(e.message)
            })
        })
        req.end()
    }
    server(urL.parse(request), headers, (data) => {
        Callback(data.toString())
    })
}

module.exports = app