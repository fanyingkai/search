// 服务器端
// 持久运行自动管理
// 维护用户连接 操作数据库 加密解密
// 与客户端之间的中间层
const cluster = require('cluster')
const os = require('os')

// 多进程  判断有无子进程
// 主进程
if (cluster.isMaster) {
    
    
    // net模块
    const net = require('net')
    // 复刻一个子进程
    let worker = cluster.fork()
    // TCP协议包
    const HeadBodyBuffers = require('head_body_buffers').HeadBodyBuffers
     
    // 新建服务端并监听端口
    // TCP服务器 接受客户端连接
    let server = new net.createServer( (connection) => {
        
        // TCP连接断开
        connection.on('error', () => {
            // 2s之后重新监听
            setTimeout( () => {
                server.listen(8080)
            }, 2000)
        })
        // 包策略
        let packetLength = (data) => {
            return data.readUInt32BE(0)
        }
        // 数据包响应
        let hdb = new HeadBodyBuffers(4,packetLength)
        hdb.on('packet', (packet) => {
            let head = packet.slice(0, 4)
            let body = packet.slice(4)
            // 发送消息给子进程
            // 默认消息body是buffer     
            worker.send(body.toString())
        })
        // TCP 接收到数据
        connection.on('data', (data) => {
            // 解析包协议
            hdb.addBuffer(data)
        })
        // 接受来自子进程的消息
        worker.on('message', (msg) => {
            // 打包TCP包
            let packet = new Buffer(4 + Buffer.byteLength(JSON.stringify(msg)))
            packet.writeUInt32BE(Buffer.byteLength(JSON.stringify(msg)), 0)
            packet.write(JSON.stringify(msg), 4)
            // TCP发送给客户端
            connection.write(packet)
        })
    })
    // TCP监听8080端口
    server.listen(8080)
    // TCP端口被占用
    server.on('error', (data) => {
        if (data.code == 'EADDRINUSE') {
            setTimeout(() => {
                // 关闭TCP
                server.close()
                // 重新启动
                server.listen(8080)
            }, 2000)
        }
    })
    
    
} else {
    
    const querystring = require('querystring')
    // 子进程
    const db = require('mongodb')
    // websocket 监听81端口
    const io = require('socket.io').listen(81)
    const fs = require('fs')
    const assert = require('assert')
    const Connect = require('connect')
    // 组件
    const component = require('./module/component.js')
    const HeadBodyBuffers = require('head_body_buffers').HeadBodyBuffers
    const MongoClient = db.MongoClient
    
    // 新建用户连接池
    let userlisten = []
    let usersocket = []
    
    const express = require('express')
    const web = express()
    const server = web.listen(80)
    const Time = () => {
        let date = new Date()
        let strDate = date.getDate()
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate
        }
        return strDate
    }
    
    // 连接数据库
    MongoClient.connect('mongodb://127.0.0.1:3306/db', (err,db)=>{
        // 深度测试ERR错误
        assert.equal(null , err)
        
    
        // 接收父进程的消息
        process.on('message', (magess) => {
            // 判断是否为json对象
            // 是否过期
            if (magess.includes('{') && magess.includes('}') == true){
                // 字符串转对象
                let age = JSON.parse(magess)
                // 判断用户连接池有无连接
                if(userlisten['name:' + age.id] != undefined){
                    if(typeof age.sercar !== 'undefined'){
                        let UserDown = db.collection('down')
                        UserDown.find({"id": age.id }).toArray( (err, docs) => {
                            if(docs.length == 1){
                                let data = docs[0]
                                if(data.time == Time()){
                                    if(data[age.sercar.name] <= 50){
                                        userlisten['name:' + age.id].emit('sercar-callback', {magess: age.sercar})
                                    }else{
                                        userlisten['name:' + age.id].emit('sercar-callback', {magess: {error: 400}})
                                    }
                                }else{
                                   UserDown.updateOne({'id':data.id}, {$set:{
                                       "id":data.id,
                                       "time":Time(),
                                       "588ku":0,
                                       "90sheji":0,
                                       "888pic":0
                                    }}, (err) => {
                                        if(err){console.log(err)}
                                        userlisten['name:' + age.id].emit('sercar-callback', {magess: age.sercar})
                                    }) 
                                }
                            }else
                            if(docs.length == 0){
                                UserDown.insertMany([{
                                    "id":age.id,
                                    "time":Time(),
                                    "588ku":0,
                                    "90sheji":0,
                                    "888pic":0
                                }], (err, result)=>{
                                    if(err){console.log(err)}
                                })
                            }
                        })
                    }else
                    if(age.error != undefined){
                        console.log(age)
                        process.send({
                            "id": age.id,
                            "sercar": age.error
                        })
                    }
                }
            }else
            if(magess.includes('****') == true){
                let dbCdn, response, url, snt, title
                dbCdn = db.collection('cache')
                const Mback = magess.split('****')
                response = Mback[0]
                url = Mback[1]
                snt = Mback[2]
                title = Mback[3]
                dbCdn.find({"id":response}).toArray( (err, docs) => {
                    if(docs.length == 1){
                        dbCdn.updateOne({'id':response}, {$set:{'id':response, url:url, snt:snt, title:title}}, (err) => {
                            if(err){console.log(err)}
                        })
                    }else{
                        dbCdn.insertMany([{'id':response, url:url, snt:snt, title:title}], (err)=>{
                            if(err){console.log(err)}
                        })
                    }
                })
            }
        })
        
        
        web.use(express.static(__dirname + '/www/public'))
        web.use(express.static(__dirname + '/www/html'))
        web.get('/', (req, res) => {
            res.sendFile(__dirname + '/www/html/index.html')
        })
        web.get('/cookie', (req, res) => {
            if(req.query.key == 'xivistudio'){
                let dbKey = db.collection('cookie')
                dbKey.find({"id": req.query.name }).toArray( (err, docs) => {
                    if(docs.length == 1){
                        let NO, dbKey
                        NO = docs[0].cookienNo
                        dbKey = db.collection('cookieArray')
                        dbKey.find({"id": NO, "name":"cookie", "obj": req.query.name}).toArray( (err,docs) => {
                            if(err){console.log(err)}
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
                let name, dbKey
                name = req.query.name
                dbKey = db.collection('cookie')
                dbKey.find({"id": name}).toArray( (err, docs) => {
                    if(docs.length == 1){
                        io.sockets.emit('Request-error-callback', {magess:{data:req.query.name, id:docs[0].cookienNo, type: req.query.type}})
                        let newdocs = docs[0]
                        newdocs.cookienNo = (newdocs.cookienNo + 1 > newdocs.sum) ? 1: newdocs.cookienNo + 1
                        dbKey.updateOne({"id": name}, {$set: newdocs}, (err, result) => {
                            if(err){console.log(err)}
                            res.send('0')
                        })
                    }
                })
            }
        })
    
        
        // 客户端连接
        io.sockets.on('connection', (socket) => {
        
            // 用户退出
            socket.on('disconnect', () => {
                // 将用户从连接池中剔除
                let name = usersocket[socket.id]
                usersocket[socket.id] = null
                userlisten['name:' + name] = null
            })
            
            // 下载计数
            socket.on('dowm-i', (data) => {
                let UserDown = db.collection('down')
                UserDown.find({"id": data.magess.name }).toArray( (err, docs) => {
                    if(docs.length == 1){
                        let obj = docs[0]
                        obj["588ku"] = (data.magess.id == "588ku") ? obj['588ku'] + 1 : obj['588ku']
                        obj["90sheji"] = (data.magess.id == "90sheji") ? obj['90sheji'] + 1 : obj['90sheji']
                        UserDown.updateOne({'id':data.magess.name}, {$set:obj}, (err) => {
                            if(err){console.log(err)}
                        })
                    }
                })
            })
        
            // 用户登录
            socket.on('login', (data) => {
                const name = data.magess.name
                // 如果是加密先解密
                const key = typeof data.magess.type !== 'undefined' && data.magess.type == 'password' ? component.decrypt(data.magess.pass) : data.magess.pass
                // 连接key表
                const dbKey = db.collection('passport')
                // 判断用户是否以连接
                // 如果连接池存在链接  不接受新连接
                // 查询用户passport信息
                dbKey.find({"id": name}).toArray( (err, docs) => {
                    if(err){console.log(err)}
                    // 有信息
                    // 密钥不为空
                    // 密钥正确
                    if(docs.length != 0 && docs[0].key != undefined && docs[0].key == key && userlisten['name:' + name] == null){
                        // 新建用户访问域
                        userlisten['name:' + name] = socket
                        usersocket[socket.id] = name
                        socket.emit('login-callback', {magess: {key:component.encrypt(key), permissions:docs[0].permissions, time:docs[0].time }})
                    }else{
                        // 发送错误信息
                        socket.emit('login-callback', {magess: false})
                    }
                })
            })
        
            // 管理员登录
            socket.on('admin-login', (data) => {
                var name, key
                data = data.magess
                name = data.name
                key = (typeof data.type !== 'undefined') ? component.decrypt(data.pass) : data.pass
                // 判断passport信息
                if (name == 'admin' && key == 'xivistudio') {
                    // 读取ADMIN页面
                    fs.readFile(__dirname + '/www/dom/admin.html', 'utf8', (err,data) => {
                        // 发送加密key
                        // 发送页面
                        socket.emit('admin-login-callback', {magess: {key: component.encrypt(key),dom: data}})
                    })
                } else {
                    // 发送错误信息
                    socket.emit('admin-login-callback', {magess: false})
                }
            })
        
            // 修改密码
            socket.on('edituserkey', (data) => {
                let dbKey, user
                dbKey = db.collection('passport')
                user = data.magess
                // 更新passport信息
                dbKey.updateOne({ "id": user.username}, {$set: {
                    "id":user.username,
                    "key":user.password,
                    "permissions":user.permissions,
                    time:user.time
                }}, (err, result) => {
                    if(err){console.log(err)}
                    // 修改成功
                    if (result.result.n == 1) {
                        socket.emit('edituserkey-callback', {magess: true})
                    } else 
                    // 失败
                    if (result.result.n == 0) {
                        socket.emit('edituserkey-callback', {magess: false})
                    }
                })
            })
        
            // 搜索
            socket.on('sercar', (data) => {
                let dbCdn = db.collection('cache')
                dbCdn.find({"id": data.magess.url}).toArray( (err, docs) => {
                    if(err){console.log(err)}
                    if(docs.length == 1){
                        if (userlisten['name:' + data.magess.name] != undefined) {
                            let query = querystring.parse(docs[0].url)
                            if(query.e != undefined){
                                dbCdn.deleteOne({"id": docs[0].url}, (err, result) => {
                                    if(err){console.log(err)}
                                    process.send({
                                        "id": data.magess.name,
                                        "sercar": data.magess.url
                                    })
                                })
                            }else{
                                userlisten['name:' + data.magess.name].emit('sercar-callback', {magess: {
                                    name:'588ku',
                                    type:'img',
                                    link: docs[0].url,
                                    snt:docs[0].snt,
                                    title:docs[0].title
                                }})
                                process.send({
                                    "id": data.magess.name,
                                    "sercar": data.magess.url,
                                    "query": true
                                })
                            }
                        }
                    }else{
                        process.send({
                            "id": data.magess.name,
                            "sercar": data.magess.url
                        })
                    }
                })
            })
            
            // 请求用户信息
            socket.on('user', (data) => {
                let dbKey = db.collection('passport')
                dbKey.find().skip(data.magess.skip).limit(data.magess.limit).toArray( (err,docs) => {
                    if(err){console.log(err)}
                    if(docs.length != 0){
                        socket.emit('user-callback', {magess: docs})
                    }
                })
            })
            
            // 修改用户信息
            socket.on('useredit', (data) => {
                let user, dbKey
                user = data.magess
                dbKey = db.collection('passport')
                dbKey.updateOne({"id": user.id}, {$set: user}, (err,result) => {
                    if(err){console.log(err)}
                    if(result.result.n == 1){
                        socket.emit('useredit-callback', {magess:user.id})
                    }else
                    if(result.result.n == 0){
                        socket.emit('useredit-callback', {magess:false})
                    }
                })
            })
        
            // 请求cookie信息
            socket.on('cookiearray', () => {
                let dbKey = db.collection('cookieArray')
                // 查询cookie信息
                dbKey.find({"name": "cookie"}).toArray( (err,docs) => {
                    if(err){console.log(err)}
                    // 找到cookie信息并发送
                    if (docs.length != 0) {
                        socket.emit('cookiearray-callback', {magess: docs})
                    }
                })
            })
            
            // 请求cookie数据
            socket.on('cookie', () => {
                let dbKey = db.collection('cookie')
                // 查询cookie信息
                dbKey.find().toArray( (err, docs) => {
                    if(err){console.log(err)}
                    // 找到cookie信息并发送
                    if (docs.length != 0) {
                        socket.emit('cookie-callback', {magess: docs})
                    }
                })
            })
        
            // 新增用户
            socket.on('instuser', (data) => {
                let user, dbKey
                user = data.magess
                dbKey = db.collection('passport')
                dbKey.find({ "id": user.id}).toArray((err, docs)=>{
                    if (docs.length == 0) {
                        dbKey.insertMany([user], (err, result)=>{
                            if(err){console.log(err)}
                            if (result.result.n == 1) {
                                socket.emit('instuser-callback', {magess: true})
                            } else 
                            if (result.result.n == 0) {
                                socket.emit('instuser-callback', {magess: false})
                            }
                        })
                    }else{
                        socket.emit('instuser-callback', {magess: false})
                    }
                })
            })
        
            // 删除用户
            socket.on('deluser', (data) => {
                let dbKey = db.collection('passport')
                // 删除
                // 成功和失败回调
                dbKey.deleteOne({"id": data.magess}, (err,result) => {
                    if(err){console.log(err)}
                    if (result.result.n == 1) {
                        socket.emit('deluser-callback', {magess: data.magess})
                    } else 
                    if (result.result.n == 0) {
                        socket.emit('deluser-callback', {magess: false})
                    }
                })
            })
        
            // 新增cookie信息
            socket.on('inst-cookie', (data) => {
                let cookie, cookiedb, cookieArraydb
                cookie = data.magess
                cookiedb = db.collection('cookie')
                cookieArraydb = db.collection('cookieArray')
                // 查询出cookie信息
                cookiedb.find({"id": cookie.id}).toArray( (err, docs) => {
                    if (docs.length == 1) {
                        // 递增计算
                        let newdocs = docs[0]
                        newdocs.sum += 1
                        // 更新cookie信息
                        cookiedb.updateOne({"id": cookie.id}, {$set: newdocs}, (err, result) => {
                            if (result.result.n != 0) {
                                // 将新cookie写入
                                cookieArraydb.insertMany([{
                                    "id": newdocs.sum,
                                    "name": "cookie",
                                    "obj": cookie.id,
                                    "data": cookie.cookie,
                                    "user": cookie.user
                                }], (err,result) => {
                                    if(err){console.log(err)}
                                    if (result.result.n == 1) {
                                        socket.emit('inst-cookie-callback', {magess: true})
                                    } else 
                                    if (result.result.n == 0) {
                                        socket.emit('inst-cookie-callback', {magess: false})
                                    }
                                })
                            }
                        })
                    }
                })
            })
            
            // 删除缓存
            socket.on('cdn-error', (data) => {
                let dbCdn = db.collection('cache')
                dbCdn.deleteOne({"id": data.magess}, (err, result) => {
                    if(err){console.log(err)}
                })
            })
        
            // 更新cookie信息
            socket.on('upcookie', (data) => {
                let age, dbKey
                age = {
                    "id": data.magess.id,
                    "name": "cookie",
                    "obj": data.magess.obj,
                    "data": data.magess.data,
                    "user":data.magess.user
                }
                dbKey = db.collection('cookieArray')
                dbKey.updateOne({"id": age.id,"name": age.name,"obj": age.obj}, {$set: age}, (err,result)=>{
                    if(err){console.log(err)}
                    if (result.result.n != 0) {
                        socket.emit('upcookie-callback', {magess: true})
                    } else {
                        socket.emit('upcookie-callback', {magess: false})
                    }
                })
            })
        })
    })  
}
// 监听到子进程退出
cluster.on('exit', (worker, code, signal) => {
    // 新建一个子进程
    cluster.fork()
})