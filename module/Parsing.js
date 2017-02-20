const server = require('./http.js')
const fs = require('fs')
const http = require('http')
const urL = require('url')
const request = require('./request.js')
const app = {
    nubmer: (PATH) => {
        let SumArray = PATH.match(/\d/g)
        let NewSum = ''
        for(let i = 0; i < SumArray.length; i ++){
            let SumArray_i = SumArray[i];
            NewSum += SumArray_i
            if(i == SumArray.length - 1){
                return NewSum
            }
        }
    },
    Input: (URL, QUERY, CALLBACK) => {
        const IndexurlData = urL.parse(URL)
        let protocol = IndexurlData.protocol
        let host = IndexurlData.host
        let port = IndexurlData.port
        let path = IndexurlData.path
        let href = IndexurlData.href
        const index = (HeadersData, Ydz, _cookie) => { 
            server.Request(HeadersData, (data, Headers) => {
                let BodyBuffer = data.toString()
                if(host == '588ku.com'){
                    let body = require('./view/588ku.js')
                    body(BodyBuffer, (url) => {
                        let snt = url.center
                        let title = url.title
                        let _urldata = urL.parse(url.link)
                        let [protocol, host, port, path, href] = [_urldata.protocol, _urldata.host, _urldata.port, _urldata.path, _urldata.href]
                        let Filter = (QUERY != undefined && QUERY == true) ? 'img' : false
                        if(protocol != null && url.response != Filter){
                            server.Request({
                                type: "GET",
                                url: href,
                                headers:{
                                    "Accept":"application/json, text/javascript, */*; q=0.01",
                                    "Accept-Language":"zh-CN,zh;q=0.8",
                                    "Connection":"keep-alive",
                                    "Content-Type":"application/json",
                                    "Host":"588ku.com",
                                    "cookie":_cookie,
                                    "X-Requested-With":"XMLHttpRequest", 
                                    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
                                }
                            }, (data, headers) => {
                                let StatusBody = data.toString()
                                let Status = (StatusBody.includes('{') && StatusBody.includes('}') == true) ? JSON.parse(StatusBody) : StatusBody
                                if(typeof Status === 'object'){
                                    if(Status.status == -3){
                                        let code = require('./code/588ku.js')
                                        code(headers['set-cookie'], _cookie, (If) => {
                                            if(If == true){
                                                CALLBACK({error:URL})
                                            }else
                                            if(If == false){
                                                request('http://47.89.27.13/cookie-error?key=xivistudio&name=588ku&type=-3')
                                                CALLBACK({error:URL})
                                            }
                                        })
                                    }else
                                    if(Status.status == 0){
                                        if(url.response == 'img'){
                                            CALLBACK(`${URL.href}****${Status.url}****${snt}****${title}`)
                                        }
                                        CALLBACK({name:url.name, type:url.response, link: Status.url, snt:snt, title:title})
                                    }else{
                                        request('http://47.89.27.13/cookie-error?key=xivistudio&name=588ku&type=-44')
                                        CALLBACK({error:URL})
                                    }
                                }else{
                                    if(Status == ' 请先登录' || '请先登录'){
                                        request('http://47.89.27.13/cookie-error?key=xivistudio&name=588ku&type=404')
                                        CALLBACK({error:URL})
                                    }else
                                    if(Status.includes('账号同时段多人使用') == true){
                                        request('http://47.89.27.13/cookie-error?key=xivistudio&name=588ku&type=error')
                                        CALLBACK({error:URL})
                                    }
                                }
                            })
                        }
                    })
                }else
                if(host == '90sheji.com'){
                    if(BodyBuffer.includes('{') == true){
                        let back = JSON.parse(BodyBuffer)
                        if(back.success == 1){
                            server.Request({
                                type:"GET",
                                url:Ydz,
                                headers: {
                                    "Accept":"application/json, text/javascript, */*; q=0.01",
                                    "Accept-Language":"zh-CN,zh;q=0.8",
                                    "Connection":"keep-alive",
                                    "Content-Type":"application/json",
                                    "Host":"90sheji.com",
                                    "Cookie":_cookie,
                                    "X-Requested-With":"XMLHttpRequest",
                                    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
                                }
                            }, (data) => {
                                let body = require('./view/90sheji.js')
                                body(data, (data) => {
                                    CALLBACK({name:"90sheji", link:BodyBuffer, snt:data.snt, title:data.title })
                                })
                            })
                        }else{
                            request('http://47.89.27.13/cookie-error?key=xivistudio&name=90sheji&type=404')
                            CALLBACK({error:URL})
                        }
                    }
                }else
                if(host == '888pic.com'){
                    if(Headers.location){
                        const backhead = urL.parse(Headers.location)
                        if(backhead.query){
                            if(backhead.query.includes('m=downVarify') == true){
                                request('http://47.89.27.13/cookie-error?key=xivistudio&name=888pic&type=-44')
                                CALLBACK({error:Ydz})
                            }else{
                                server.Request({ 
                                    type:"GET", 
                                    url: `http://888pic.com/?m=download&id=${app.nubmer(path)}`, 
                                    headers: {
                                        "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                                        "Accept-Language":"zh-CN,zh;q=0.8,la;q=0.6",
                                        "Cache-Control":"max-age=0",
                                        "Connection":"keep-alive",
                                        "DNT":1,
                                        "Host":"888pic.com",
                                        "Referer":Ydz,
                                        "Cookie":_cookie,
                                        "Upgrade-Insecure-Requests":1,
                                        "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                                    }
                                }, (_data) => {
                                    let body = require('./view/888pic.js')
                                    body(_data, (data) => {
                                        CALLBACK({name:"888pic", link:Headers.location, snt:data.snt, title:data.title })
                                    })
                                })
                            }
                        }
                    }
                }
            })
        }
        if(protocol != null){
            if(host == '588ku.com'){
                request('http://47.89.27.13/cookie?key=xivistudio&name=588ku', undefined, (cookie) => {
                    index({
                        type:"GET",
                        url:href,
                        headers: {
                            "Accept":"application/json, text/javascript, */*; q=0.01",
                            "Accept-Language":"zh-CN,zh;q=0.8",
                            "Connection":"keep-alive",
                            "Content-Type":"application/json",
                            "Host":"588ku.com",
                            "cookie": cookie,
                            "X-Requested-With":"XMLHttpRequest",
                            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
                        }
                    }, href, cookie)
                })
            }else
            if(host == '90sheji.com'){
                request('http://47.89.27.13/cookie?key=xivistudio&name=90sheji', undefined, (cookie) => {
                    index({ 
                        type:"POST", 
                        url: "http://90sheji.com/index.php?m=inspireAjax&a=getDownloadLink", 
                        headers: {
                            "Accept":"application/json, text/javascript, */*; q=0.01",
                            "Accept-Language":"zh-CN,zh;q=0.8",
                            "Connection":"keep-alive",
                            "Content-Length": app.nubmer(path).length + 3,
                            "Host":"90sheji.com",
                            "Origin":"http://90sheji.com",
                            "cookie":cookie,
                            "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
                            "Referer":"http://90sheji.com/?m=Inspire&a=download&id=" + app.nubmer(path),
                            "X-Requested-With":"XMLHttpRequest",
                            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
                        }, 
                        from:{ 
                            id: app.nubmer(path) - '' 
                        }
                    }, href, cookie)
                })
            }else
            if(host == '888pic.com'){
                request('http://47.89.27.13/cookie?key=xivistudio&name=888pic', undefined, (cookie) => {
                    index({ 
                        type:"GET", 
                        url: `http://888pic.com/?m=downloadopen&a=open&id=${app.nubmer(path)}&down_type=1`, 
                        headers: {
                            "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                            "Accept-Language":"zh-CN,zh;q=0.8,la;q=0.6",
                            "Connection":"keep-alive",
                            "Cookie":cookie,
                            "DNT":1,
                            "Host":"888pic.com",
                            "Referer":href,
                            "Upgrade-Insecure-Requests":1,
                            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                        }
                    }, href, cookie)
                })
            }
        }
    }
}


module.exports = app