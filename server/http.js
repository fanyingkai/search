// http server
module.exports = (web, io) => {

    web.get('/', (req, res) => {
        res.sendFile(global._Index_.RootPath + '/www/html/index.html')
    })

    // 后台管理
    web.get(`/${_Index_.Config.admin.key}${ _Index_.Config.adminpath}`, (req, res) => {
        res.sendFile(global._Index_.RootPath + '/www/html/admin.html')
    })

    // 获取cookie信息
    web.get('/cookie', (req, res) => {
        if(req.query.key == 'xivistudio'){
            _Index_.Mongodb.collection('cookie').find({"id": req.query.name }).toArray( (err, docs) => {
                if(docs.length == 1){
                    const NO = docs[0].cookienNo
                    _Index_.Mongodb.collection('cookieArray').find({"id": NO, "name":"cookie", "obj": req.query.name}).toArray( (err,docs) => {
                        if(docs.length == 1){
                            res.send(docs[0].data)
                        }
                    })
                }
            })
        }
    })
    
    // cookie信息出错
    web.get('/cookie-error', (req, res) => {
        if(req.query.key == 'xivistudio'){
            const name = req.query.name
            const dbKey = _Index_.Mongodb.collection('cookie')
            dbKey.find({"id": name}).toArray( (err, docs) => {
                if(docs.length == 1){
                    let newdocs = docs[0]
                    io('Request-error-callback', {magess:{data:req.query.name, id:docs[0].cookienNo, type: req.query.type}})
                    newdocs.cookienNo = (newdocs.cookienNo + 1 > newdocs.sum) ? 1: newdocs.cookienNo + 1
                    dbKey.updateOne({"id": name}, {$set: newdocs}, (err, result) => {
                        res.send(true)
                    })
                }
            })
        }
    })

}