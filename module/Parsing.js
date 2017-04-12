const server = require('./http.js')
const fs = require('fs')
const http = require('http')
const urL = require('url')
const request = require('./request.js')
const Toole = require('../tools.js')
let switchChannel = true


const CookieZh = (ckk, cookie) => {
    let ckarr = cookie.split(';')
    let obj = {}
    for(let i = 0; i < ckarr.length; i ++){
        let id = ckarr[i].split('=')
        obj[id[0].replace(' ', '')] = id[1]
        if(i == ckarr.length - 1){
            let ckl = ckk.split('=')
            obj[ckl[0]] = ckl[1]
            let oarr = Object.keys(obj)
            let nck = ''
            for(let i = 0; i < oarr.length; i ++){
                let keys = oarr[i]
                let value = obj[oarr[i]]
                nck += (i != oarr.length - 1) ? `${keys}=${value};` : `${keys}=${value}`
                if(i == oarr.length - 1){
                   return nck 
                }
            }
        }
    }
}


const TypeTime = () => {
    setTimeout(()=> switchChannel = true ,30000)
}

const Input = (URL, QUERY, COOKIE, UserName, EventLoop, CALLBACK) => {
    const IndexurlData = urL.parse(URL)
    let protocol = IndexurlData.protocol
    let host = IndexurlData.host
    let port = IndexurlData.port
    let path = IndexurlData.path
    let href = IndexurlData.href
    // 请求页面
    const index = (HeadersData) => { 
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
                                "cookie":COOKIE,
                                "X-Requested-With":"XMLHttpRequest", 
                                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
                            }
                        }, (data, headers) => {
                            let StatusBody = data.toString()
                            let Status = (StatusBody.includes('{') && StatusBody.includes('}') == true) ? JSON.parse(StatusBody) : StatusBody
                            if(typeof Status === 'object'){
                                if(Status.status == -3){
                                    let code = require('./code/588ku.js')
                                    code(headers['set-cookie'], COOKIE, (If) => {
                                        if(If == true){
                                            CALLBACK({error:Tools.PermName(URL)})
                                            EventLoop.emit('search', {id:UserName, sercar:URL})
                                        }else
                                        if(If == false){
                                            CALLBACK({error:Tools.PermName(URL)})
                                            EventLoop.emit('search', {id:UserName, sercar:URL})
                                        }
                                    })
                                }else
                                if(Status.status == 0){
                                    if(url.response == 'img'){
                                        CALLBACK({cache:{href:href,url:Status.url, snt:snt, title:title}})
                                    }
                                    CALLBACK({name:url.name, type:url.response, link: Status.url, snt:snt, title:title})
                                }else{
                                    CALLBACK({error:Tools.PermName(URL)})
                                    EventLoop.emit('search', {id:UserName, sercar:URL})
                                }
                            }else{
                                if(Status == ' 请先登录' || '请先登录'){
                                    CALLBACK({error:Tools.PermName(URL)})
                                    EventLoop.emit('search', {id:UserName, sercar:URL})
                                }else
                                if(Status.includes('账号同时段多人使用') == true){
                                    CALLBACK({error:Tools.PermName(URL)})
                                    EventLoop.emit('search', {id:UserName, sercar:URL})
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
                            url:URL,
                            headers: {
                                "Accept":"application/json, text/javascript, */*; q=0.01",
                                "Accept-Language":"zh-CN,zh;q=0.8",
                                "Connection":"keep-alive",
                                "Content-Type":"application/json",
                                "Host":"90sheji.com",
                                "Cookie":COOKIE,
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
                        CALLBACK({error:Tools.PermName(URL)})
                        EventLoop.emit('search', {id:UserName, sercar:URL})
                    }
                }
            }else
            if(host == '888pic.com'){
                if(Headers.location != undefined){
                    const backhead = urL.parse(Headers.location)
                    if(backhead.query != undefined){
                        if(backhead.query.includes('m=downVarify') == true){
                            server.Request({ 
                                type:"GET", 
                                url:Headers.location, 
                                headers: {
                                    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                                    "Accept-Language":"zh-CN,zh;q=0.8,la;q=0.6",
                                    "Cache-Control":"max-age=0",
                                    "Connection":"keep-alive",
                                    "DNT":1,
                                    "Host":"888pic.com",
                                    "Referer":URL,
                                    "Cookie":COOKIE,
                                    "Upgrade-Insecure-Requests":1,
                                    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                                }
                            }, (_data, head) => {
                                let On = _data.toString()
                                if(On.includes('location.href = ') == true){
                                    server.Request({ 
                                        type:"GET", 
                                        url:On.split("'")[1], 
                                        headers: {
                                            "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                                            "Accept-Language":"zh-CN,zh;q=0.8,la;q=0.6",
                                            "Cache-Control":"max-age=0",
                                            "Connection":"keep-alive",
                                            "DNT":1,
                                            "Host":"888pic.com",
                                            "Referer":Headers.location,
                                            "Cookie":COOKIE,
                                            "Upgrade-Insecure-Requests":1,
                                            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                                        }
                                    }, (_data, head) => {
                                        let body = require('./code/888pic.js')
                                        body(_data, head, backhead, Toole.nubmer(path), (data) => {
                                            if(data.error == 0){
                                                CALLBACK({error:Tools.PermName(URL)})
                                                EventLoop.emit('search', {id:UserName, sercar:URL})
                                            }else
                                            if(data.code != undefined){
                                                switchChannel = false
                                                TypeTime()
                                                CALLBACK({code:data.code})
                                            }
                                        })
                                    })
                                }else{
                                    let body = require('./code/888pic.js')
                                    body(_data, head, backhead, Toole.nubmer(path), (data) => {
                                        if(data.error == 0){
                                            CALLBACK({error:Tools.PermName(URL)})
                                            EventLoop.emit('search', {id:UserName, sercar:URL})
                                        }else
                                        if(data.code != undefined){
                                            switchChannel = false
                                            TypeTime()
                                            CALLBACK({code:data.code})
                                        }
                                    })
                                }
                            })
                        }else
                        if(backhead.query.includes('.zip') == true){
                            server.Request({ 
                                type:"GET", 
                                url: `http://888pic.com/?m=download&id=${Toole.nubmer(path)}`, 
                                headers: {
                                    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                                    "Accept-Language":"zh-CN,zh;q=0.8,la;q=0.6",
                                    "Cache-Control":"max-age=0",
                                    "Connection":"keep-alive",
                                    "DNT":1,
                                    "Host":"888pic.com",
                                    "Referer":URL,
                                    "Cookie":COOKIE,
                                    "Upgrade-Insecure-Requests":1,
                                    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                                }
                            }, (_data) => {
                                let body = require('./view/888pic.js')
                                body(_data, (data) => {
                                    CALLBACK({name:"888pic", link:Headers.location, snt:data.snt, title:data.title })
                                })
                            })
                        }else{
                            CALLBACK({error:Tools.PermName(URL)})
                            EventLoop.emit('search', {id:UserName, sercar:URL})
                        }
                    }
                }
            }
        })
    }
    // run
    if(protocol != null){
        if(host == '588ku.com'){
            index({
                type:"GET",
                url:href,
                headers: {
                    "Accept":"application/json, text/javascript, */*; q=0.01",
                    "Accept-Language":"zh-CN,zh;q=0.8",
                    "Connection":"keep-alive",
                    "Content-Type":"application/json",
                    "Host":"588ku.com",
                    "cookie": COOKIE,
                    "X-Requested-With":"XMLHttpRequest",
                    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
                }
            }, href)
        }else
        if(host == '90sheji.com'){
            index({ 
                type:"POST", 
                url: "http://90sheji.com/index.php?m=inspireAjax&a=getDownloadLink", 
                headers: {
                    "Accept":"application/json, text/javascript, */*; q=0.01",
                    "Accept-Language":"zh-CN,zh;q=0.8",
                    "Connection":"keep-alive",
                    "Content-Length": Toole.nubmer(path).length + 3,
                    "Host":"90sheji.com",
                    "Origin":"http://90sheji.com",
                    "cookie":COOKIE,
                    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
                    "Referer":"http://90sheji.com/?m=Inspire&a=download&id=" + Toole.nubmer(path),
                    "X-Requested-With":"XMLHttpRequest",
                    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
                }, 
                from:{ 
                    id: Toole.nubmer(path) - '' 
                }
            }, href)
        }else
        if(host == '888pic.com' && switchChannel == true){
            index({ 
                type:"GET", 
                url: `http://888pic.com/?m=downloadopen&a=open&id=${Toole.nubmer(path)}&down_type=1`, 
                headers: {
                    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language":"zh-CN,zh;q=0.8,la;q=0.6",
                    "Connection":"keep-alive",
                    "Cookie":COOKIE,
                    "DNT":1,
                    "Host":"888pic.com",
                    "Referer":href,
                    "Upgrade-Insecure-Requests":1,
                    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                }
            }, href)
        }
    }
}


const Code = (data, callback) => {
    request('http://47.89.27.13/cookie?key=xivistudio&name=888pic', undefined, (cookie) => {
        server.Request({ 
            type:"GET", 
            url: data.code, 
            headers: {
                "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language":"zh-CN,zh;q=0.8,la;q=0.6",
                "Connection":"keep-alive",
                "Cookie":CookieZh(data.cookie, cookie),
                "DNT":1,
                "Host":"888pic.com",
                "Referer":data.backhead,
                "Upgrade-Insecure-Requests":1,
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
            }
        }, (_data) => {
            console.log(_data.toString())
            switchChannel = true
            callback({error:urL.parse(data.car)})
        })
    })
}


module.exports = {
    Input:Input
}