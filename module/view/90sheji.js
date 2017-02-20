const cheerio = require('cheerio')
const iconv = require('iconv-lite')

module.exports = (data, callback) => {
    const $ = cheerio.load(iconv.decode(data, 'GBK'))
    let dom = $('.yangjiDiv .yangji_img')
    let snt = $(dom).attr('data-src')
    let title = $('.Snav h1').text()
    callback({snt:snt, title:title})
}