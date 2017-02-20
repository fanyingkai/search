const cheerio = require('cheerio')

module.exports = (data, callback) => {
    const $ = cheerio.load(data)
    let snt = $('.page-l img').attr('src')
    let title = $('.img-name').text()
    callback({snt:snt, title:title})
}