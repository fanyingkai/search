const crypto = require('crypto')
const fs = require('fs')


module.exports = {
    // 加密
    encrypt: (text) => {
        let algorithm = "aes-256-ctr"
        let password = "799497ode8cm45571387"
        let cipher = crypto.createCipher(algorithm, password)
        let crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex')
        return crypted
    },
    // 解密
    decrypt: (text) => {
        let algorithm = "aes-256-ctr"
        let password = "799497ode8cm45571387"
        let decipher = crypto.createDecipher(algorithm, password)
        let dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8')
        return dec
    },
    // 写入日志
    log: (name, log) => {
        let filename = {
            "server": './system/log/server.log',
            "error": './system/log/error.log'
        }
        fs.stat(filename[name], (err, stats) => {
            if (stats.size >= 100000) {
                fs.writeFile(filename[name], '')
            } else {
                fs.appendFile(filename[name], log + '\r\n', (err) => {
                    if (err) {
                        console.error(err)
                    }
                })
            }
        })
    }
}