const v8 = require('v8')
const os = require('os')
const fs = require('fs')
const events = require('events')
const crypto = require('crypto')


// 准备函数
const ready = (path) => {
    if(typeof global._Index_ == 'undefined'){
        // 初始化全局变量
        global._Index_ = new Object()
        // websocket连接池
        global._Index_.ConnectionPool = new Object
        global._Index_.UserTag = new Object
        global._Index_.UserOFsocket = new Object
        // 数据库
        global._Index_.Mongodb = new Object
        // 全局事件循环
        global._Index_.RootEvent = new events.EventEmitter()
        // 全局更改事件监听数为100 防止内存溢出
        events.EventEmitter.defaultMaxListeners = 100
        // 配置
        global._Index_.Config = JSON.parse(fs.readFileSync('./config.json'))
        // 根目录
        global._Index_.RootPath = path
    }
}


// 时间格式化
const GetTime = () => {
    const myDate = new Date()
    return `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}`
}

// 判断时间过期
const TypeTime = function(time){
    const myDate = new Date()
    if(time){
        const dataT = time.split('-')
        if(dataT[0] - '' > myDate.getFullYear()){
            return true
        }else{
            if(dataT[1] - ''> myDate.getMonth() + 1){
                return true
            }else{
                if(dataT[2] - '' > myDate.getDate()){
                    return true
                }else{
                    return false
                }
            }
        }
    }else{
        return true
    } 
}


const PermName = function(text) {
    if(text.includes('588ku')){
        return '588ku'
    }else 
    if(text.includes('90sheji')){
        return '90sheji'
    }else 
    if (text.includes('888pic')){
        return '888pic'
    }
}


// 堆栈信息调试
const SpaceDev = () => {
    const name = {"new_space":'新生代', "old_space":'老生代', "code_space":'程序空间', "map_space":'映射空间', "large_object_space":'大对象空间'}
    const space = v8.getHeapSpaceStatistics()
    const add = (space_i) => console.AddLog(`
        [   ${name[space_i.space_name]} ===>>  总数： ${space_i.space_size}  使用： ${space_i.space_used_size}  可用： ${space_i.space_available_size}   物理： ${space_i.physical_space_size}   ]
    `)
    for(let space_i of space){
        add(space_i)
    }
}


// 添加日志动作
const AddLog = () => {
    global.console.__proto__.AddLog = (data) => {
        fs.appendFile(__dirname + _Index_.Config.log, `${GetTime()}   ${data}${os.EOL}`, (err) => {
            err && console.log(err)
        })
    }
}


// 添加错误日志
const AddError = () => {
    global.console.__proto__.AddError = (data) => {
        fs.appendFile(__dirname + _Index_.Config.error, `[===>>> ${GetTime()} >>> ${data} <<<===] ${os.EOL}`, (err) => {
            err && console.log(err)
        })
    }
}


// 加密
const encrypt = (text) => {
    let algorithm = "aes-256-ctr"
    let password = '799497ode8cm45571387'
    let cipher = crypto.createCipher(algorithm, password)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}


// 解密
const decrypt = (text) => {
    let algorithm = "aes-256-ctr"
    let password = '799497ode8cm45571387'
    let decipher = crypto.createDecipher(algorithm, password)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
}


// 提取字符串中的数字
const nubmer = (string) => {
     const SumArray = string.match(/\d/g)
     let NewSum = ''
     for(let i = 0; i < SumArray.length; i ++){
         NewSum += SumArray[i]
         if(i == SumArray.length - 1){
             return NewSum
         }
     }
 }


module.exports = {
    SpaceDev:SpaceDev,
    ready:ready,
    encrypt:encrypt,
    decrypt:decrypt,
    GetTime:GetTime,
    TypeTime:TypeTime,
    AddLog:AddLog,
    AddError:AddError,
    nubmer:nubmer,
    PermName:PermName
}