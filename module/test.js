const server = require('./http.js')
const fs = require('fs')
const http = require('http')
const urL = require('url')
const request = require('./request.js')
const tools = require('../tools.js')
let Config = new Object()


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


const SearchPk = new Object()
SearchPk['588ku'] = (Html, Search, IndexEvent) => {
    const body = require('./view/588ku.js')
    body(Html, (data) => {
        const Snt = data.center
        const Title = data.title
        const Urldata = urL.parse(data.link)
        const Filter = (Search.Cache == true) ? 'img' : false
        const [protocol, host, port, path, href] = [Urldata.protocol, Urldata.host, Urldata.port,Urldata.path, Urldata.href]
        if(protocol != null && data.response != Filter){
             server.Request({
                 type: "GET",
                 url: href,
                 headers:{
                     "Accept":"application/json, text/javascript, */*; q=0.01",
                     "Accept-Language":"zh-CN,zh;q=0.8",
                     "Connection":"keep-alive",
                     "Content-Type":"application/json",
                     "Host":"588ku.com",
                     "cookie":Search.Cookie,
                     "X-Requested-With":"XMLHttpRequest", 
                     "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
                 }
             }, (data, headers) => {
                 const StatusBody = data.toString()
                 const Status = (StatusBody.includes('{') && StatusBody.includes('}') == true) ? JSON.parse(StatusBody) : StatusBody
                 if(typeof Status === 'object'){
                     if(Status.status == -3){
                         let code = require('./code/588ku.js')
                         code(headers['set-cookie'], Search.Cookie, (If) => {
                             if(If == true){
                                 IndexEvent.emit('Parsing', {
                                     UserName:Search.UserName,
                                     Search:Search.Search,
                                     SearchType:Search.SearchType,
                                     Cookie:Search.Cookie,
                                     Cache:Search.Cache
                                 })
                             }else
                             if(If == false){
                                 IndexEvent.emit('Callback', {
                                     Event:'Cookie',
                                     UserName:Search.UserName,
                                     id:Search.SearchType,
                                     ErrorCode:'-3'
                                 })
                             }
                         })
                     }else
                     if(Status.status == 0){
                         if(data.response == 'img'){
                             IndexEvent.emit('Callback', {
                                 Event:'Cache',
                                 UserName:Search.UserName,
                                 req:Search.Search,
                                 href:Status.url,
                                 Title:Title,
                                 Thumbnail:Snt
                             })
                             IndexEvent.emit('Callback', {
                                 UserName:data.UserName,
                                 Event:'Body',
                                 UserName:Search.UserName,
                                 req:Search.Search,
                                 [data.response]:Status.url
                             })
                         }
                     }else{
                         IndexEvent.emit('Callback', {
                             Event:'Cookie',
                             UserName:Search.UserName,
                             id:Search.SearchType,
                             ErrorCode:'-44'
                         })
                     }
                 }else{
                     if(Status == ' 请先登录' || '请先登录'){
                         IndexEvent.emit('Callback', {
                             Event:'Cookie',
                             UserName:Search.UserName,
                             id:Search.SearchType,
                             ErrorCode:'404'
                         })
                     }else
                     if(Status.includes('账号同时段多人使用') == true){
                         IndexEvent.emit('Callback', {
                             Event:'Cookie',
                             UserName:Search.UserName,
                             id:Search.SearchType,
                             ErrorCode:'error'
                         })
                     }
                 }
             })
         }
     })
}
SearchPk['90sheji'] = (Html, Search, IndexEvent) => { 
    if(Html.includes('{') == true){
         const back = JSON.parse(Html)
         if(back.success == 1){
             server.Request({
                 type:"GET",
                 url:Search.Search,
                 headers: {
                     "Accept":"application/json, text/javascript, */*; q=0.01",
                     "Accept-Language":"zh-CN,zh;q=0.8",
                     "Connection":"keep-alive",
                     "Content-Type":"application/json",
                     "Host":"90sheji.com",
                     "Cookie":Search.Cookie,
                     "X-Requested-With":"XMLHttpRequest",
                     "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
                 }
             }, (data) => {
                 const body = require('./view/90sheji.js')
                 body(data, (data) => {
                     IndexEvent.emit('Callback', {
                         UserName:data.UserName,
                         Event:'Body',
                         UserName:Search.UserName,
                         req:Search.Search,
                         [data.response]:Html
                     })
                     CALLBACK({name:"90sheji", link:Html, snt:data.snt, title:data.title })
                 })
             })
         }else{
             request('http://'+ Config.index +'/cookie-error?key=xivistudio&name=90sheji&type=404')
             CALLBACK({error:URL})
         }
     }
}


// 请求获取
const RunEvent = (IndexEvent) => {
    // 包图验证码
    let switchChannel = true
    // 包图验证码自动解除
    const TypeTime = () => {
        setTimeout(()=> switchChannel = true ,30000)
    }
    // 打包基本信息
    const ParsingData = new Object()
    ParsingData['588ku'] = (Search, IndexEvent) => {
        server.Request({
            type:"GET",
            url:Search.Search,
            headers: {
                "Accept":"application/json, text/javascript, */*; q=0.01",
                "Accept-Language":"zh-CN,zh;q=0.8",
                "Connection":"keep-alive",
                "Content-Type":"application/json",
                "Host":"588ku.com",
                "cookie": Search.Cookie,
                "X-Requested-With":"XMLHttpRequest",
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
            }
        }, (data, Headers) => {
            IndexEvent.emit('Search', data.toString(), Search, IndexEvent)
        })
    }
    ParsingData['90sheji'] = (Search, IndexEvent) => {
        server.Request({
            type:"POST", 
            url: "http://90sheji.com/index.php?m=inspireAjax&a=getDownloadLink", 
            headers: {
                "Accept":"application/json, text/javascript, */*; q=0.01",
                "Accept-Language":"zh-CN,zh;q=0.8",
                "Connection":"keep-alive",
                "Content-Length": tools.nubmer(Search.Search).length + 3,
                "Host":"90sheji.com",
                "Origin":"http://90sheji.com",
                "cookie":Search.Cookie,
                "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
                "Referer":"http://90sheji.com/?m=Inspire&a=download&id=" + tools.nubmer(Search.Search),
                "X-Requested-With":"XMLHttpRequest",
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
            }, 
            from:{ 
                id: tools.nubmer(Search.Search) - '' 
            }
        }, (data, Headers) => {
            IndexEvent.emit('Search', data.toString(), Search, IndexEvent)
        })
    }
    ParsingData['888pic'] = (Search, IndexEvent) => {
        server.Request({
            type:"GET", 
            url: `http://888pic.com/?m=downloadopen&a=open&id=${tools.nubmer(Search.Search)}&down_type=1`, 
            headers: {
                "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language":"zh-CN,zh;q=0.8,la;q=0.6",
                "Connection":"keep-alive",
                "Cookie":Search.Cookie,
                "DNT":1,
                "Host":"888pic.com",
                "Referer":Search.Search,
                "Upgrade-Insecure-Requests":1,
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
            }
        }, (data, Headers) => {
            IndexEvent.emit('Search', data.toString(), Search, IndexEvent)
        })
    }
    // 接收获取请求
    IndexEvent.on('Parsing', (data) => {
        // 解析链接
        const SearchData = urL.parse(data.Search)
        // 链接符合http协议
        if(SearchData.protocol != null){
            // 如果是包图先检查是否已过验证码
            if(data.SearchType == '888pic' && switchChannel == true){
                ParsingData[data.SearchType] && ParsingData[data.SearchType]({
                    UserName:data.UserName,
                    Search:data.Search,
                    SearchType:data.SearchType,
                    Cookie:data.Cookie,
                    Cache:data.Cache,
                    SearchData:SearchData
                }, IndexEvent)
            }
        }
    })
    IndexEvent.on('Search', (request, Search) => {
        server.Request(request, (data, Headers) => {
            const Body = data.toString()
            SearchPk[Search.SearchType] && SearchPk[Search.SearchType](Body, Search)
        })
    })
    IndexEvent.on('switch', (data) => switchChannel = data )
}


const Run = (Event, config) => {
    Config = config
    RunEvent(Event)
}