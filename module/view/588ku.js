const cheerio = require('cheerio')


module.exports = (data, callback) => {
    const $ = cheerio.load(data)
    const img = $('.img-button .down-big-img')
    const psd = $('.img-button .down-big-y')
    const _psd = $('.load-btns .down-big-y')
    const banner = $('.btns .down-imgs')
    const banner_img = $('.load-btns .down-big-img')
    const mb = $('#download-btn')
    const center = $('.img-center img').attr('src') != undefined ? $('.img-center img').attr('src') : $('.dl-cont-img img').attr('src')
    const title = $('.img-center img').attr('title') != undefined ? $('.img-center img').attr('title') : $('.dl-cont-img img').attr('alt')
    
    
    if(mb.length > 0){
        callback({name:"588ku", response:'img', link:'http://588ku.com/index.php?m=Download&a=downloadPSD&id=' + $('#download-btn').attr('data') + '&picType=11', center:center, title:title})
    }
    
    if(img.length > 0){
        let id1 = $(img).attr('data')
        let tab1 = $(img).attr('data-from')
        let type1 = $(img).attr('type')
        let pro1 = $(banner_img).attr('data-pro')
        if(type1 == 1){
            if(typeof(tab1) == "undefined"){
                callback({name:"588ku", response:'img', link:'http://588ku.com/?m=back&a=down&id=' + id1, center:center, title:title})
            }else{
                callback({name:"588ku", response:'img', link:'http://588ku.com/?m=back&a=down&id=' + id1+"&tab="+tab1+"&pro="+pro1,center:center, title:title})
            }
        }else{
            if(typeof(tab1) == 'undefined'){
                callback({name:"588ku", response:'img', link:'http://588ku.com/?m=element&a=down&id=' + id1,center:center, title:title})
            }else{
                callback({name:"588ku", response:'img', link:'http://588ku.com/?m=element&a=down&id=' + id1+"&tab="+tab1+"&pro="+pro1, center:center, title:title})
            }
        }
    }
    
    if(psd.length > 0){
        let id2 = $(psd).attr('data')
        let tab2 = $(psd).attr('data-from')
        let type2 = $(psd).attr('type')
        if (type2 == 1) {
            callback({name:"588ku", response:'psd', link:'http://588ku.com/?m=back&a=downpsd&id=' + id2, center:center, title:title})
        } else {
            if (typeof tab2 == 'undefined') {
                callback({name:"588ku", response:'psd', link:'http://588ku.com/?m=element&a=downpsd&id=' + id2, center:center, title:title})
            } else {
                callback({name:"588ku", response:'psd', link:'http://588ku.com/?m=element&a=downpsd&id=' + id2 + '&tab=' + tab2, center:center, title:title})
            }
        }
    }
    
    if(_psd.length > 0){
        let id3 = $(_psd).attr('data')
        let tab3 = $(_psd).attr('data-from')
        let type3 = $(_psd).attr('type')
        if (type3 == 1) {
            callback({name:"588ku", response:'psd', link:'http://588ku.com/?m=back&a=downpsd&id=' + id3, center:center, title:title})
        } else {
            if (typeof tab3 == 'undefined') {
                callback({name:"588ku", response:'psd', link:'http://588ku.com/?m=element&a=downpsd&id=' + id3, center:center, title:title})
            } else {
                callback({name:"588ku", response:'psd', link:'http://588ku.com/?m=element&a=downpsd&id=' + id3 + '&tab=' + tab3, center:center, title:title})
            }
        }
    }
    
    if(banner.length > 0){
        let id4 = $(banner).attr('data-id')
        callback({name:"588ku", response:'psd', link:'http://588ku.com/?m=element&a=suitedownpsd&id=' + id4, center:center, title:title})
    }
    
    if(banner_img.length > 0){
        let id5 = $(banner_img).attr('data')
        let tab5 = $(banner_img).attr('data-from')
        let type5 = $(banner_img).attr('type')
        let pro5 = $(banner_img).attr('data-pro')
        if(type5 == 1){
            if(typeof(tab5) == "undefined"){
                callback({name:"588ku", response:'img', link:'http://588ku.com/?m=back&a=down&id=' + id5, center:center, title:title})
            }else{
                callback({name:"588ku", response:'img', link:'http://588ku.com/?m=back&a=down&id=' + id5+"&tab="+tab5+"&pro="+pro5, center:center, title:title})
            }
        }else{
            if(typeof(tab5) == 'undefined'){
                callback({name:"588ku", response:'img', link:'http://588ku.com/?m=element&a=down&id=' + id5, center:center, title:title})
            }else{
                callback({name:"588ku", response:'img', link:'http://588ku.com/?m=element&a=down&id=' + id5+"&tab="+tab5+"&pro="+pro5, center:center, title:title})
            }
        }
    } 
}