// 启动TCP服务
const start = () => {
    const net = require('net')
    const HeadBodyBuffers = require('head_body_buffers').HeadBodyBuffers
    const db = _Index_.Mongodb
    const Mongo = {
        user: db.collection('passport'),
        cache: db.collection('cache'),
        data: db.collection('SystemData'),
        cookie: db.collection('cookie'),
        cookieArray: db.collection('cookieArray')
    }
    // TCP数据类型判断
    const JsonType = (data, Jcallback, Pcallback) => {
        // json类型
        if(data.includes('{') == true && data.includes('}') == true){
            Jcallback(JSON.parse(data))
        }else // 缓存类型
        if(data.includes('****') == true){
            const Mback = data.split('****')
            Pcallback({response:Mback[0],url:Mback[1],snt:Mback[2],title:Mback[3]}) 
        }
    }
    // 启动服务
    const TcpServer = new net.createServer((connection) => {
        // 错误或断开
        connection.on('error', () => setTimeout(() => {
            console.AddError('TCP错误或断开')
            TcpServer.close()
            TcpServer.listen(global._Index_.Config.tcpPort)
        }, 2000))
        const packetLength = (data) => {
            return data.readUInt32BE(0)
        }
        const hdb = new HeadBodyBuffers(4,packetLength)
        // 接收到消息
        connection.on('data', (data) => hdb.addBuffer(data))
        // 发送消息
        global._Index_.RootEvent.on('TCPEMIT', (data) => {
            const SearchString = JSON.stringify(data)
            const packet = new Buffer(4 + Buffer.byteLength(SearchString))
            packet.writeUInt32BE(Buffer.byteLength(SearchString), 0)
            packet.write(SearchString, 4)
            connection.write(packet)
        })
        // 递交事件循环
        hdb.on('packet', (packet) => global._Index_.RootEvent.emit('TCPDATA', packet.slice(4).toString()))
    })
    // 监听端口
    TcpServer.listen(_Index_.Config.tcpPort)
    // 服务器启动错误
    TcpServer.on('error', (data) => {
        console.AddError('TCP服务器启动错误 错误码:' + data.code)
        if(data.code == 'EADDRINUSE'){
            setTimeout(() => TcpServer.listen(_Index_.Config.tcpPort), 2000)
        }
    })
    // tcp接收到数据
    global._Index_.RootEvent.on('TCPDATA', (Magess) => {
        JsonType(Magess, (data) => {
            const socket = _Index_.ConnectionPool[_Index_.UserTag[data.id]]
            if(socket){
                if(typeof data.sercar != 'undefined'){
                    socket.emit('sercar-callback', {magess: data.sercar})
                }else
                if(typeof data.error != 'undefined'){
                    _Index_.RootEvent.emit('TCPEMIT', {"id": data.id,"sercar": data.error})
                }
            }
        }, (data) => {
            Mongo.cache.find({"id":data.response}).toArray((err, docs) => {
                if(docs.length == 1){
                    Mongo.cache.updateOne({'id':data.response}, {$set:{'id':data.response, url:data.url, snt:data.snt, title:data.title}})
                }else{
                    Mongo.cache.insertMany([{'id':data.response, url:data.url, snt:data.snt, title:data.title}])
                }
            })
        })
    })

}
    
 
 
module.exports = {
    start:start
}