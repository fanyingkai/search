const http = require('http')
const fs = require('fs')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const express = require('express')
const web = express()
const assert = require('assert')
const Connect = require('connect')
const server = http.Server(web)
const Tools = require('./tools.js')
const TcpMages = require('./server/tcp.js')
const httpServer = require('./server/http.js')
const WebSocketMages = require('./server/websocket.js')

// 初始化组件
Tools.ready(__dirname)
// 修改默认函数
Tools.AddLog()
Tools.AddError()

// 连接数据库
MongoClient.connect(_Index_.Config.mongodb, (err, db) => {
    assert.equal(null , err)
    err && console.AddError(err)
    // 数据库已连接
    global._Index_.Mongodb = db
    // 启动WebSocket服务器
    const io = require('socket.io').listen(_Index_.Config.websocket)
    // io.origins('https://www.xivistudio.cn:88') // 禁止WebSocket跨域
    WebSocketMages(Tools, (Sockets) => Sockets(io) )
    // 启动HTTP服务器
    server.listen(_Index_.Config.httpPort)
    web.use(express.static(__dirname + '/www/public')) // Express绑定静态文件目录
    web.use(`/${_Index_.Config.admin.key}${ _Index_.Config.adminpath}`, express.static(__dirname + '/www/public'))
    httpServer(web, (data) => io.sockets.emit('Request-error-callback', {magess:{data:data.data, id:data.id, type: data.type}}) )
    // 启动TCP服务器
    TcpMages.start()
    // 错误日志
    // process.on('uncaughtException', (Error) => io.sockets.emit('SystemError', {error:Error}))
})