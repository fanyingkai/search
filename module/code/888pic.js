const cheerio = require('cheerio')

module.exports = (data, head, name, backhead, callback) => {
    const html = data.toString()
    const cookie = () => {
        const ck = head['set-cookie'][1]
        const id = ck.split(';')[0]
        return id
    }
    if(html.includes('当前下载人数过多，服务器繁忙，请等候5分钟') == true){
        callback({error:0})
    }else{
        const $ = cheerio.load(html)
        const title = $('#main center').html()
        const code = $('#main img')
        let arr = []
        let key = []
        for(let i = 0 ; i < code.length; i++){
            arr.push($(code[i]).attr('src'))
            key.push($(code[i]).attr('data-key'))
            if(i == code.length - 1){
                callback({code:{
                    title:title,
                    imgarr:arr,
                    keyarr:key,
                    key:cookie(),
                    id:name,
                    backhead:backhead
                }})
            }
        }
    }
}