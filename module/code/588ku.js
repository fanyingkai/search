const request = require('../request.js')

let codeEdit = (cookie, back) => {
    let array = cookie.split(';')
    let object = {}
    for(let i = 0; i < array.length; i ++){
        let Ai = array[i]
        let arr = Ai.split('=')
        let id = arr[0].replace(' ', "")
        object[id] = arr[1]
        if(i == array.length - 1){
            back(object)
        }
    }
}

let cokObjectEcex = (obj, back) => {
    let str = ''
    let id = Object.keys(obj)
    for(let i = 0; i < id.length; i ++){
        let name = id[i]
        let cok = name + '=' + obj[name]
        str += (i == id.length - 1) ? cok : cok + ';'
        if(i == id.length - 1){
            back(str)
        }
    }
}

let app = (head, cookie, callback) => {
    let AddCookie = ''
    let answer = 0
    for(let i = 0; i < head.length; i ++){
        let dataI = head[i]
        let cokI = dataI.split(';')[0]
        if(cokI.includes('answer') == true || cokI.includes('word') == true){
            let c = cokI.split('=')[1] - ''
            if(typeof c == 'number'){
                if(cokI.includes('answer') == true){
                    answer = c
                    AddCookie += (i == head.length -1) ? cokI : cokI + ';'
                }else{
                    AddCookie += (i == head.length -1) ? cokI : cokI + ';'
                }
            }
        }else{
            AddCookie += (i == head.length -1) ? cokI : cokI + ';'
        }
        if(i == head.length -1){
            codeEdit(AddCookie, (NEW) => {
                codeEdit(cookie, (THIS) => {
                    let NewKeys = Object.keys(NEW)
                    for(let i = 0; i < NewKeys.length; i ++){
                        let name = NewKeys[i]
                        THIS[name] = NEW[name]
                        if(i == NewKeys.length - 1){
                            cokObjectEcex(THIS, (cookie) => {
                                let url = 'http://588ku.com/index.php?m=misc&a=verifyCaptcha&c=' + answer
                                request(url, {
                                    "Accept":"image/webp,image/*,*/*;q=0.8",
                                    "Accept-Language":"zh-CN,zh;q=0.8",
                                    "Connection":"keep-alive",
                                    "Host":"588ku.com",
                                    "cookie": cookie,
                                    "X-Requested-With":"XMLHttpRequest", 
                                    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36"
                                }, (data) => {
                                    let back = JSON.parse(data)
                                    if(back.status == 1){
                                        callback(true)                   
                                    }else
                                    if(back.status == 0){
                                        callback(false) 
                                    }
                                })
                            })
                        }
                    }
                })
            })
        }
    }
}

module.exports = app