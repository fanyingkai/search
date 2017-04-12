const cluster = require('cluster')

if(cluster.isMaster){
    
    cluster.fork()
    cluster.on('exit', (worker, code, signal) => {
        cluster.fork()
    })
    
}else
if(cluster.isWorker){
    
    const net = require('net')
    const fs = require('fs')
    const url = require('url')
    const Parsing = require('./module/parsing.js')
    const HeadBodyBuffers = require('head_body_buffers').HeadBodyBuffers
    const events = require('events')
    const IndexEvent = new events.EventEmitter()
    const Config = JSON.parse(fs.readFileSync('./config.json'))
    const client = new net.Socket()
    const Cookie = new Object()
    const Tools = require('./tools.js')
    client.setTimeout(0) 
    client.setKeepAlive(true, 5000)
    client.connect({port: Config.tcpPort, host: Config.index}) 
    client.on('connect', (data) => console.error(Date(), '已连接到TCP服务器') )
    const TcpEmit = (data) => {
        const msg = JSON.stringify(data)
        const packet = new Buffer(4 + Buffer.byteLength(msg))
        packet.writeUInt32BE(Buffer.byteLength(msg), 0)
        packet.write(msg, 4)
        client.write(packet)
    }
    const packetLength = (data) => {return data.readUInt32BE(0)}
    const hbd = new HeadBodyBuffers(4, packetLength)
    client.on('data', (data) => hbd.addBuffer(data) )
    hbd.on('packet', (packet) => {
        console.log(packet)
        const data = packet.slice(4).toString()
        if(data.includes('{') && data.includes('}') ){
            IndexEvent.emit('search', JSON.parse(data)) 
        }
    })
    IndexEvent.on('search', (age) => {
        if(age.setCookie != undefined){
            Cookie[age.setCookie.id] = age.setCookie.data
        }else
        if(age.sercar != undefined){
            Parsing.Input(age.sercar, age.cache, Cookie[Tools.PermName(age.sercar)], UserName, IndexEvent, (data) => {
                if(data.error != undefined){
                    TcpEmit(JSON.stringify({"id":age.id, "error": data.error.href}))
                }else
                if(data.cache != undefined){
                    TcpEmit(JSON.stringify({"id":age.id, "cache": data.cache}))
                }else{
                    TcpEmit((typeof data == 'object') ? JSON.stringify({"id":age.id, "sercar":data}) : data)
                }
            })
        }
    })
    
}    