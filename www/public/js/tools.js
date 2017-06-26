if (typeof Index === 'object') {

    // 无法运行  Index函数已被沾染
    console.error('内部函数错误！！！ => [object : Index]')

} else {

    // index对象
    var Index = function() {
        // 更新节点 写入节点内容
        // ([{Node, Html}])
        var SetDOM = function(Node) {
            for (var i = 0; i < Node.length; i++) {
                var NodeLi = Node[i]
                $(Node[i].Node).html(Node[i].Html)
            }
        }
        var GetTime = function() {
            var myDate = new Date()
            return myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate()
        }
        // 判断url的所属
        var PermName = function(text) {
            if(text.search(/588ku/i) >= 0){
                return '588ku'
            }else 
            if(text.search(/90sheji/i) >= 0){
                return '90sheji'
            }else 
            if(text.search(/888pic.com/i) >= 0){
                return '888pic'
            }else
            if(text.search(/58pic.com/i) >= 0){
                return '58pic'
            }
        }
        // 转义网站简码
        var WebCode = function(name) {
            return ({
                '588ku': '千库',
                '90sheji': '90设计',
                '888pic': '包图',
                '58pic' : '千图'
            })[name]
        }
        // 转义网站名称
        var WebName = function(name) {
            return ({
                '千库': '588ku',
                '90设计': '90sheji',
                '包图': '888pic',
                '千图': '58pic'
            })[name]
        }
        var ClikPerm = function(permissions, name) {
            for (var a = 0; a < permissions.length; a++) {
                if (permissions[a] == name) {
                    return true
                }
            }
        }
        var LSJ = {ToUnicode:function(k){for(var i=0,t=[];i<k.length;i++){t.push(k.charCodeAt(i));if(i==k.length-1){return JSON.stringify(t);}}},ToString:function(j){var k=JSON.parse(j);for(var i=0,t='';i<k.length;i++){t+=String.fromCharCode(k[i]);if(i==k.length-1){return t;}}}}
        // 网站所属颜色
        var WebStyle = function(name) {
            return ({
                '千库': '#2196F3',
                '90设计': '#F44336',
                '包图': '#00B150',
                '千图': '#F00222'
            })[name]
        }
        // 判断时间过期
        var TypeTime = function(time) {
            var myDate = new Date()
            if (time) {
                var dataT = time.split('-')
                if (dataT[0] - '' > myDate.getFullYear()) {
                    return true
                } else {
                    if (dataT[1] - '' > myDate.getMonth() + 1) {
                        return true
                    } else {
                        if (dataT[2] - '' > myDate.getDate()) {
                            return true
                        } else {
                            return false
                        }
                    }
                }
            } else {
                return true
            }
        }
        // 注册事件
        var EventId = []
        var OnEvent = function(event, callback) {
            if (EventId[event] == undefined) {
                EventId[event] = true
                socket.on(event + '_callback', function(data) {
                    callback(data)
                })
            }
        }
        // 关闭样式
        var disableStylesheet = function(name, type) {
            if (typeof name === "number") {
                document.styleSheets[name].disabled = type
            } else {
                var sheets = document.querySelectorAll(name)
                for (var i = 0; i < sheets.length; i++) {
                    sheets[i].disabled = type
                }
            }
        }
        // 动态加载js和css
        var loadjscssfile = function(arr) {
            for (var i = 0; i < arr.length; i++) {
                var name = arr[i].split('.')
                var filetype = name[(name.length - 1 == 0) ? 0 : name.length - 1]
                if (filetype == 'js') {
                    var fileref = document.createElement('script')
                    fileref.setAttribute('type', 'text/javascript')
                    fileref.setAttribute('src', arr[i])
                } else if (filetype == 'css') {
                    var fileref = document.createElement('link')
                    fileref.setAttribute('rel', 'stylesheet')
                    fileref.setAttribute('type', 'text/css')
                    fileref.setAttribute('href', arr[i])
                }
                if (typeof fileref != 'undefined') {
                    document.getElementsByTagName('head')[0].appendChild(fileref)
                }
            }
        }
        // class设置
        var SetStyle = function(event) {
            if (event.add != undefined) {
                for (var i = 0, arr = event.add; i < arr.length; i++) {
                    var id = arr[i]
                    var split = id.split('$')
                    $(split[0]).addClass(split[1])
                }
            }
            if (event.remove != undefined) {
                for (var i = 0, arr = event.remove; i < arr.length; i++) {
                    var id = arr[i]
                    var split = id.split('$')
                    $(split[0]).removeClass(split[1])
                }
            }
        }
        // 更新 localStorage
        var Storage = function() {
            var Type = function(str) {
                return (str.search('{') >= 0 || str.search('}') >= 0 || str.search('[') >= 0 || str.search(']') >= 0) ? true : false
            }
            return {
                Del: function(name) {
                    if (localStorage[name] == undefined) {
                        return false
                    } else {
                        localStorage.removeItem(name)
                    }
                },
                Updata: function(name, Storage) {
                    if (typeof name == 'string') {
                        localStorage[name] = (typeof Storage == 'string') ? Storage : JSON.stringify(Storage)
                    } else if (typeof name == 'object' && name.length != undefined) {
                        for (var I of name) {
                            localStorage[I.Name] = (typeof I.Age == 'object') ? JSON.stringify(I.Age) : I.Age
                        }
                    }
                },
                To: function(name) {
                    if (typeof name == 'string') {
                        if (localStorage[name] !== undefined) {
                            return (Type(localStorage[name]) == false) ? localStorage[name] : JSON.parse(localStorage[name])
                        }
                    } else if (typeof name == 'object' && name.length != undefined) {
                        var Arr = []
                        for (var i = 0; i < name.length; i++) {
                            Arr.push = (Type(localStorage[name[i]]) == true) ? JSON.parse(localStorage[name[i]]) : localStorage[name[i]]
                            if (i == name.length - 1) {
                                return Arr
                            }
                        }
                    }
                }
            }
        }
        // 浏览器通知
        var _Notification = function() {
            var Config = new Object()
            return {
                Module: function(type) {
                    Config.error = type.error
                    Config.log = type.log
                    Config.info = type.info
                    Config.icon = type.icon
                    if (Notification) {
                        Notification.requestPermission()
                    }
                },
                To: function(name, type, body) {
                    if (Notification) {
                        var icon = (Config[type] != undefined) ? Config[type] : Config.icon
                        var age = {
                            "icon": icon,
                            "body": body
                        }
                        if (Notification.permission === "granted") {
                            new Notification(name,age)
                        } else if (Notification.permission !== 'denied') {
                            Notification.requestPermission(function(permission) {
                                if (permission === "granted") {
                                    new Notification(name,age)
                                }
                            })
                        }
                    } else {
                        alert(type + ' => ' + name + ' : [ ' + body + ' ]')
                    }
                }
            }
        }
        // 抛出所有方法
        return {
            SetDOM: SetDOM,
            Notification: new _Notification(),
            Storage: new Storage(),
            SetStyle: SetStyle,
            loadjscssfile: loadjscssfile,
            disableStylesheet: disableStylesheet,
            OnEvent: OnEvent,
            SetDOM: SetDOM,
            TypeTime: TypeTime,
            PermName: PermName,
            WebCode: WebCode,
            WebStyle: WebStyle,
            ClikPerm: ClikPerm,
            GetTime: GetTime,
            WebName: WebName,
            LSJ: LSJ
        }
    }

    Index = new Index()

}
