const cheerio = require('cheerio')

module.exports = (data, callback) => {
    const html = data.toString()
     console.log(html)
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
                    keyarr:key
                }})
            }
        }
    }
}