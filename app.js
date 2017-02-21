const cluster = require('cluster')
const os = require('os')

if (cluster.isMaster) {
    // 复刻一个子进程
    cluster.fork()
}else
if (cluster.isWorker){
    
    // 子进程
    const HeadBodyBuffers = require('head_body_buffers').HeadBodyBuffers
    const net = require('net')
    const url = require('url')
    // 处理层
    const Parsing = require('./module/parsing.js')
    
    let client = new net.Socket()
    // 超时
    client.setTimeout(0) 
    // 心跳
    client.setKeepAlive(true, 5000)
    // 绑定端口
    client.connect({port: 8080, host: '47.89.27.13'})             
    // 包策略
    let packetLength = (data) => {
        return data.readUInt32BE(0);
    }
    let hbd = new HeadBodyBuffers(4, packetLength)
    // 当接收到数据时
    client.on('data', (data) => {
        hbd.addBuffer(data)
    })
    // 连接
    client.on('connect', (data) => {
        console.log('TCP连接')
    })
    // 解包
    hbd.on('packet', (packet) => {
        let head = packet.slice(0, 4)
        let body = packet.slice(4)
        Write(JSON.parse(body.toString()))
    }) 
    // 请求
    let Write = (age) => {
        // 解析请求分析
        if(typeof age.sercar !== 'undefined'){
            Parsing.Input(url.parse(age.sercar), age.query, (data) => {
                if(data.error == undefined){
                    let msg = (typeof data == 'object') ? JSON.stringify({"id":age.id, "sercar":data}) : data
                    let packet = new Buffer(4 + Buffer.byteLength(msg))
                    packet.writeUInt32BE(Buffer.byteLength(msg), 0)
                    packet.write(msg, 4)
                    client.write(packet)
                }else{
                    let msg = JSON.stringify({"id":age.id, "error": data.href})
                    let packet = new Buffer(4 + Buffer.byteLength(msg))
                    packet.writeUInt32BE(Buffer.byteLength(msg), 0)
                    packet.write(msg, 4)
                    client.write(packet)
                }
            })
        }
    }
}
// 监听到子进程退出
cluster.on('exit', (worker, code, signal) => {
    // 新建一个子进程
    cluster.fork()
})
    