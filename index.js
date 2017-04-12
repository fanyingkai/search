if(typeof Worker == 'undefined'){
    
    "use strict"

    const childProcess = require('child_process')
    const fs = require('fs')
    const events = require('events')
    const IndexEvent = new events.EventEmitter()
    let Worker = childProcess.fork('./main.js')
    let config = JSON.parse(fs.readFileSync('./config.json'))
    let Restart = true
    IndexEvent.on('OpenAgent', () => {
        const http = require('http')
        http.createServer((request, response) => {
            if(request.headers.key == config.admin.key){
                Restart = true
                IndexEvent.emit('fork')
            } 
        }).listen(7777)
        IndexEvent.on('OffAgent', () => http.close() )
    })
    IndexEvent.on('fork', () => { 
        WorkerEvent()
        IndexEvent.emit('OffAgent')
    })
    // fork进程重启
    const WorkerEvent = () => {
        Worker.on('exit', (code) => {
            if(Restart == true){
                Worker = childProcess.fork('./main.js')
                config = JSON.parse(fs.readFileSync('./config.json'))
                WorkerEvent()
            }else
            if(Restart == false){
                IndexEvent.emit('OpenAgent')
            }
        })
        // 接收到子进程发送的消息
        Worker.on('message', (data) => IndexEvent.emit('WorkerData', data))
    }
    IndexEvent.on('WorkerData', (data) => {
        const Event = new Object()
        // 指令处理函数
        Event['Kill'] = () => {
            Restart = false
            Worker.kill()
        }
        Event['Restart'] = () => {
            Restart = true
            Worker.kill()
        }
        Event[data.Event] && Event[data.Event]()
    })
    WorkerEvent()
    
}