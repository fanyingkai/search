module.exports = (component, Socket_Callback) => {
    
    const querystring = require('querystring')
    const fs = require('fs')
    const db = global._Index_.Mongodb
    const ModuleIndex = new Object()
    const os = require('os')
    const v8 = require('v8')
    const Mongo = {
        user: db.collection('passport'),
        cache: db.collection('cache'),
        data: db.collection('SystemData'),
        cookie: db.collection('cookie'),
        cookieArray: db.collection('cookieArray'),
    }
	// 时间获取
	const Time = () => {
		let date = new Date().getDate()
		return date = (date >= 0 && date <= 9) ? `0${date}` : date
	}
    
    // 处理函数注册 ==>>
    
    // 下载计数
    ModuleIndex['DownloadCount'] = (socket, data) => {
        Mongo.user.find({"id": data.magess.name }).toArray( (err, docs) => {
            err && console.AddError(err)
            if(docs.length == 1){
                let doc = docs[0]
                doc.Parameter[data.magess.id] = doc.Parameter[data.magess.id] + 1
                Mongo.user.updateOne({'id':data.magess.name}, {$set:doc})
                Mongo.data.find({'id':'PV'}).toArray( (err, docs) => {
                    const obj = new Object
                    obj.id = 'PV'
                    obj.sum = (docs.length == 1) ?  docs[0].sum + 1 : 0
                    Mongo.data.updateOne({'id':'PV'}, {$set:obj})
                })
            }
        })
    }
    
    // 用户登录
    ModuleIndex['Login'] = (socket, data, socketID) => {
        const name = data.magess.name
        const key = (data.magess.type == true) ? component.decrypt(data.magess.pass) : data.magess.pass
        Mongo.user.find({id:name, key:key}).toArray( (err, docs) => {
            err && console.AddError(err)
            if(docs.length != 0 && global._Index_.UserTag[name] == undefined){
                let doc = docs[0]
                if(doc.time != false && component.TypeTime(doc.time) == true){
                    global._Index_.UserTag[name] = socketID
                    global._Index_.UserOFsocket[socketID] = name
                    socket.emit('login-callback', {magess:{
                        "_id":doc._id,
                        "id" : doc.id,
                        "key" : component.encrypt(doc.key),
                        "time" : doc.time,
                        "permissions" : doc.permissions,
                        "RegisTime" : doc.RegisTime,
                        "Limit" : doc.Limit,
                        "Parameter" : doc.Parameter,
                        "LoginIP" : doc.LoginIP
                    }})
                    socket.emit('FlashGot', {_id_:socketID})
                }else{
                    doc.time = false
                    Mongo.user.updateOne({"id": doc.id}, {$set: doc})
                }
				if(doc.Parameter == undefined){
					doc.Parameter = new Object
					doc.Parameter.Time = () => {
						let date = new Date().getDate()
						return (date >= 0 && date <= 9) ? `0${date}` : date
					}
					for(let id of doc.permissions){
						doc.Parameter[id] = 0
					}
					doc.LoginIP = socket.handshake.address
					Mongo.user.updateOne({"id": doc.id}, {$set: doc})
				}
				if(doc.Limit == undefined || doc.Limit != undefined && doc.Limit['588ku'] == 0){
					doc.Limit = new Object
					for(let i = 0; i < doc.permissions.length; i ++){
						let name = doc.permissions[i]
						doc.Limit[name] = (name == '888pic') ? 15 : 50
						if(i == doc.permissions.length-1){
							Mongo.user.updateOne({"id": doc.id}, {$set: doc})
						}
					}
				}
            }else{
                socket.emit('login-callback', {magess: false})
            }
        })
    }
    
    // 请求服务器信息
    ModuleIndex['GetServerDate'] = (socket, data, socketID) => {
        const SystemData = (data) => {
            data.operatingSystem = os.type()
            data.cpu = os.cpus()
            data.idleRam = os.freemem()
            data.sumRam = os.totalmem()
            data.runTime = os.uptime()
            data.config = _Index_.Config
            data.log = fs.readFileSync(_Index_.RootPath + '/Node.log')
            data.log = data.log.toString()
            socket.emit('GetServerDate_callback', {magess:data})
        }
        Mongo.user.count({}, (err, udocs) => {
            err && console.AddError(err)
            const user = (err == undefined) ? udocs : 0
            Mongo.cache.count({}, (err, cdocs) => {
                err && console.AddError(err)
                const cache = (err == undefined) ? cdocs : 0
                Mongo.data.find({}).toArray((err, ddocs) => {
                    err && console.AddError(err)
                    SystemData({
                        user:user,
                        cache:cache,
                        zx:Object.keys(_Index_.UserTag).length
                    })
                })
            })
        })
    }

    // 修改配置
    ModuleIndex['EditConfig'] = (socket, data) => fs.writeFile(_Index_.RootPath + '/config.json', JSON.stringify(data.magess),  (err) => console.AddError(err))

    // 重启进程
    ModuleIndex['RestartWorker'] = (socket, data) => {
        if(data.Restart == true){
            process.send({"Event":"Restart"})
        }else
        if(data.kill == true){
            process.send({"Event":"kill"})
        }
    }
    
    // 请求堆栈信息
    ModuleIndex['ServerSpace'] = (socket, data, socketID) => socket.emit('ServerSpace_callback', {magess: v8.getHeapSpaceStatistics()})
    
    // 管理员登录
    ModuleIndex['AdminLogin'] = (socket, Mag, socketID) => {
        const data = Mag.magess
        const name = data.name
        const key = (data.type == true) ? component.decrypt(data.pass) : data.pass
        if(name == _Index_.Config.admin.name && key == _Index_.Config.admin.key){
            global._Index_.UserTag[name] = socketID
            global._Index_.UserOFsocket[socketID] = name
            socket.emit('admin-login-callback', {magess: {key: component.encrypt(key), url:`/${_Index_.Config.admin.key}${ _Index_.Config.adminpath}`}})
        }else{
            socket.emit('admin-login-callback', {magess: false})
        }
    }
    
    // 修改密码
    ModuleIndex['ChangePassword'] = (socket, data) => {
        const user = data.magess
        Mongo.user.updateOne({ "id": user.username}, {$set: {"id":user.username,"key":user.password,"permissions":user.permissions,time:user.time}}, (err, result) => {
            if(result.result.n == 1){
                socket.emit('edituserkey-callback', {magess: true})
            }else 
            if(result.result.n == 0){
                socket.emit('edituserkey-callback', {magess: false})
            }
        })
    }
    
    // 搜索
    ModuleIndex['Search'] =  (socket, data, socketID) => {
        const ClientSearch = data.magess
        const UserName = ClientSearch.name
        const Search = ClientSearch.url
        const SearchType = ClientSearch.SearchName
        const Key = (ClientSearch[socketID].key != undefined) ? component.decrypt(ClientSearch[socketID].key) : 'false'
        const EmitSearch = () => {
            Mongo.cache.find({"id": Search}).toArray((err, docs) => {
                err && console.AddError(err)
                var Cache = false
                if(docs.length == 1){
                    const CacheData = docs[0]
                    Cache = true
                    socket.emit('sercar-callback', {magess: {name:'588ku', type:'img', link: CacheData.url, snt:CacheData.snt, title:CacheData.title}})
                }else{
                    Cache = false
                }
                global._Index_.RootEvent.emit('TCPEMIT', {"id":UserName,"sercar": Search, "cache":Cache})
            })
        }
        Mongo.user.find({id:UserName, key:Key}).toArray((err, docs) => {
            err && console.AddError(err)
            if(docs.length != 0){
                const UserData = docs[0]
                if(UserData.Parameter.Time == Time()){
					if(UserData.Parameter[SearchType] <= UserData.Limit[SearchType]){
                        EmitSearch()
					}else{
						socket.emit('sercar-callback', {magess: {error: 400}})
					}
				}else{
					UserData.Parameter.Time = Time()
					for(let id of UserData.permissions){
						UserData.Parameter[id] = 0
					}
					Mongo.user.updateOne({'id':UserData.id}, {$set:UserData}, (err) => {
                        err && console.AddError(err)
                        EmitSearch()
                    }) 
				} 
            }
        })
    }
    
    // 验证码
    ModuleIndex['Code'] =  (socket, data) => global._Index_.RootEvent.emit('TCPDATA', {"id": data.name,"code":data.url,"car": data.sercar,"cookie":data.cookie,"backhead":data.backhead})
    
    // 请求用户信息列表
    ModuleIndex['User'] = (socket, data) => {
        Mongo.user.find().skip(data.magess.skip).limit(data.magess.limit).toArray((err, docs) => {
            if(docs.length != 0){
                socket.emit('user-callback', {magess: docs})
            }
        })
    }

    // 请求用户信息条
    ModuleIndex['GetUser'] = (socket, data) => {
        const UserData = data.magess
        Mongo.user.find(UserData).toArray((err, docs) => {
            if(docs.length != 0){
                socket.emit('user-callback', {magess: docs})
            }else{
                socket.emit('user-callback', {magess: false})
            }
        })
    }
    
    // 修改用户信息
    ModuleIndex['UserEdit'] = (socket, data) => {
        const user = data.magess
        Mongo.user.updateOne({"id": user.id}, {$set: user}, (err, result) => {
            err && console.AddError(err)
            if(result.result.n == 1){
                socket.emit('useredit-callback', {magess:user.id})
            }else
            if(result.result.n == 0){
                socket.emit('useredit-callback', {magess:false})
            }
        })
    }
        
    // 请求cookie信息
    ModuleIndex['GetCookie'] = (socket, data) => {
        // 查询cookie信息
        Mongo.cookieArray.find({"obj": data.magess}).toArray( (err,docs) => {
            err && console.AddError(err)
            // 找到cookie信息并发送
            if(docs.length != 0){
                socket.emit('cookiearray-callback', {magess: docs})
            }
        })
    }
    
    // 修改cookie信息
    ModuleIndex['SetCookieData'] = (socket, data) => {
        const id = data.magess.id
        const cookie = data.magess.data
        const type = data.magess.type
        Mongo.cookieArray.updateOne({"id":id, "name":"cookie", "obj":type}, {$set: {"id":id,"name":"cookie","obj":type,"data":cookie}}, function(err){
            if(err){
                socket.emit('SetCookieData-callback', {magess:false})
            }else{
                socket.emit('SetCookieData-callback', {magess:true})
            }
        })
    }

    // 删除cookie
    ModuleIndex['DelCookie'] = (socket, data) => {
        const id = data.magess.id
        const name = data.magess.name
        Mongo.cookieArray.find({"obj": name}).toArray( (err,docs) => {
            err && console.AddError(err)
            if(docs.length != 0){
                for(let i = 0, j = 0; i < docs.length; i ++){
                    const cookie = docs[i]
                    if(cookie.id == id && cookie.obj == name){
                         Mongo.cookieArray.deleteOne({"id": id, "obj":name})
                    }else{
                        cookie.id = j += 1
                        Mongo.cookieArray.updateOne({"obj":name}, {$set: cookie})
                    }
                    if(i == docs.length-1){
                        Mongo.cookie.find({"id": name}).toArray((err, docs) => {
                            err && console.AddError(err)
                            docs[0].sum = docs.length - 1
                            Mongo.cookie.updateOne({"id": name}, {$set: docs[0]})
                        })
                    }
                }
            }
        })
    }

    // 设置Cookie
    ModuleIndex['SetCookie'] = (socket, data) => {
        const id = data.magess.id
        const cookienNo = data.magess.cookienNo
        Mongo.cookie.find({"id":id}).toArray((err, docs) => {
            docs[0].cookienNo = cookienNo
            Mongo.cookie.updateOne({"id":id}, {$set: docs[0]}, (err, result) => {
                err && console.AddError(err)
                if(result.result.n == 1){
                    socket.emit('SetCookie-callback', {magess: true})
                }else 
                if(result.result.n == 0){
                    socket.emit('SetCookie-callback', {magess: false})
                }
            })
        })
    }
    
    // 请求cookie数据
    ModuleIndex['GetCookieDate'] = (socket, data) => {
        // 查询cookie信息
        Mongo.cookie.find().toArray( (err, docs) => {
            err && console.AddError(err)
            // 找到cookie信息并发送
            if(docs.length != 0){
                socket.emit('cookie-callback', {magess: docs})
            }
        })
    }
    
    // 新增用户
    ModuleIndex['NewUser'] = (socket, data) => {
        const user = data.magess
        Mongo.user.find({ "id": user.id}).toArray((err, docs)=>{
            if(docs.length == 0){
                Mongo.user.insertMany([{
                    id:user.id,
                    key:user.key,
                    time:user.time,
                    permissions:user.permissions,
                    RegisTime:user.RegisTime,
                    Limit:user.Limit,
                    Parameter:user.Parameter
                }], (err, result)=>{
                    if(result.result.n == 1){
                        socket.emit('instuser-callback', {magess: true})
                    }else 
                    if(result.result.n == 0){
                        socket.emit('instuser-callback', {magess: false})
                    }
                })
            }else{
                socket.emit('instuser-callback', {magess: false})
            }
        })
    }
    
    // 删除用户
    ModuleIndex['DeleteUser'] = (socket, data) => {
        Mongo.user.deleteOne({"id": data.magess}, (err,result) => {
            err && console.AddError(err)
            if(result.result.n == 1){
                socket.emit('deluser-callback', {magess: data.magess})
            }else 
            if(result.result.n == 0){
                socket.emit('deluser-callback', {magess: false})
            }
        })
    }
    
    // 新增cookie信息
    ModuleIndex['NewCookie'] = (socket, data) => {
        const cookie = data.magess
        // 查询出cookie信息
        Mongo.cookie.find({"id": cookie.id}).toArray( (err, docs) => {
            err && console.AddError(err)
            if(docs.length == 1){
                let newdocs = docs[0]
                newdocs.sum = newdocs.sum + 1
                Mongo.cookie.updateOne({"id": cookie.id}, {$set: newdocs}, (err, result) => {
                    err && console.AddError(err)
                    if(result.result.n != 0){
                        Mongo.cookieArray.insertMany([{"id": newdocs.sum,"name": "cookie","obj": cookie.id,"data": cookie.cookie}], (err,result) => {
                            if(result.result.n == 1){
                                socket.emit('inst-cookie-callback', {magess: true})
                            }else 
                            if(result.result.n == 0){
                                socket.emit('inst-cookie-callback', {magess: false})
                            }
                        })
                    }
                })
            }
        })
    }
    
    // 删除缓存
    ModuleIndex['DeleteCache'] = (socket, data) => Mongo.cache.deleteOne({"id": data.magess})
    
    // 更新cookie信息
    ModuleIndex['UpdataCookie'] = (socket, data) => {
        const age = {"id": data.magess.id,"name": "cookie","obj": data.magess.obj,"data": data.magess.data,"user":data.magess.user}
        Mongo.cookieArray.updateOne({"id": age.id,"name": age.name,"obj": age.obj}, {$set: age}, (err,result) => {
            err && console.AddError(err)
            if(result.result.n != 0){
                socket.emit('upcookie-callback', {magess: true})
            }else{
                socket.emit('upcookie-callback', {magess: false})
            }
        })
    }
    
    // 消息处理
    global._Index_.RootEvent.on('SOCKETDATA', (data) => {
        const socket = global._Index_.ConnectionPool[data._id_]
        if(typeof socket !== 'undefined' && typeof ModuleIndex[data.event] !== 'undefined'){
            ModuleIndex[data.event](socket, data.data, data._id_)
        }
    })
    
    // 启动服务
    Socket_Callback((io) => {
        io.sockets.on('connection', (socket) => {
            // 添加到连接池
            global._Index_.ConnectionPool[socket.id] = socket
            //接收到数据
            socket.on('MagesEvent', (data) => global._Index_.RootEvent.emit('SOCKETDATA', data) )
            // 系统重启
            socket.on('Admin_System_Reboots', (data) => process.send({Event:'Kill'}) )
            // 连接断开
            socket.on('disconnect', () => {
                const name = global._Index_.UserOFsocket[socket.id]
                delete global._Index_.ConnectionPool[socket.id] 
                delete global._Index_.UserTag[name]
                delete global._Index_.UserOFsocket[socket.id]
                delete socket
            })
        })
    })
    
}