if(typeof Index === 'undefined'){
    
    var socket = new Object()
    var Index = new Object()
    var CanvasData = {particles: {color: '#00b150',shape: 'circle',opacity: 1,size: 5,size_random: true,nb: 200,line_linked: {enable_auto: true,distance: 100,color: '#000',opacity: 1,width: 1,condensed_mode: {enable: false,rotateX: 600,rotateY: 600}},anim: {enable: true,speed: 1}},interactivity: {enable: true,mouse: {distance: 250},detect_on: 'canvas',mode: 'grab',line_linked: {opacity: 0.5},events: {onclick: {enable: true,mode: 'push',nb: 4}}},retina_detect: true}
    
    
    Index.Notification = function(name, body){
        if (Notification.permission === "granted") {
            var notification = new Notification(name, {"icon":"/img/favicon.ico", "body": body})
        }else 
        if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    var notification = new Notification(name, {"icon":"/img/favicon.ico", "body": body})
                }
            })
        }
    }
    
    
    Index.Login = function(){
        $('.lgoin-body').removeClass('login-body-hide')
        $('#login-user-pass').focus(function(){
            $(this).keyup(function (event){
                if(event.which == 13){
                    Index.LoginEmit({name: $('#login-user-name').val(),pass: $('#login-user-pass').val()})
                }
            })
        })
        $('#login-login-push').click(function(){
            Index.LoginEmit({name: $('#login-user-name').val(),pass: $('#login-user-pass').val()})
        })
    }
    
    Index.LoginEmit = function(password){
        if(location.search == '?xuguanhuo'){
            socket.emit('admin-login', {magess: password})
            socket.on('admin-login-callback', function(data){
                if(data.magess == false){
                    Index.Login()
                }else{
                    if(document.getElementById('login-local-key') != null && document.getElementById('login-local-key').checked == true){
                        localStorage.password = data.magess.key
                    }
                    localStorage.username = password.name
                    document.body.innerHTML = data.magess.dom
                    $.getScript('/js/admin.js')
                }
            })
        }else{
            socket.emit('login', {magess: password})
            socket.on('login-callback', function(data){
                if (data.magess == false){
                    Index.Notification('密码错误', '帐号或密码错误')
                    Index.Login()
                }else{
                    console.log(Index.TypeTime(data.magess.time))
                    if(Index.TypeTime(data.magess.time) == true){
                        $('.lgoin-body').addClass('login-body-hide')
                        if(document.getElementById('login-local-key') != null && document.getElementById('login-local-key').checked == true){
                            localStorage.password = data.magess.key
                        }
                        localStorage.username = password.name
                        localStorage.permissions = JSON.stringify(data.magess.permissions)
                        localStorage.time = data.magess.time
                        Index.SerCar()
                    }
                }
            })
        }
    }
    
    
    Index.TypeTime = function(time){
        var myDate = new Date()
        if(time){
            var dataT = time.split('-')
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
    
    
    // 搜索页
    Index.SerCar = function(){
        // 下载计数
        var GetSum = function(id){
            socket.emit('dowm-i', {magess:{name:localStorage.username, id: id}})
        }
        // 权限检查
        var ClikPerm = function(name){
            if(localStorage.permissions != undefined){
                var permissions = JSON.parse(localStorage.permissions);
                for(var a = 0; a < permissions.length; a++){
                    if(permissions[a] == name){
                        return true
                    }
                }
            } 
        }   
        // 检查url id
        var PermName = function(val){
            if(val.search(/588ku/i) >= 0){
                return '588ku'
            }else
            if(val.search(/90sheji/i) >= 0){
                return '90sheji'
            }else
            if(val.search(/888pic.com/i) >= 0){
                return '888pic'
            }  
        }
        // 匹配url网站名
        var SercarName = function(id){
            if(id){
                return ({'588ku':'千库','90sheji':'90设计','888pic':'包图'})[id]
            }
        }
        // 接收响应
        socket.on('sercar-callback', function(data){
            var obj = (typeof data.magess !== 'object') ? JSON.parse(data.magess) : data.magess
            if(obj.error == undefined){
                // 隐藏并停止loading动画
                $('.loading').removeClass('loading-show')
                // 显示缩略图
                var SNT = $('.sercar-img').attr('style')
                var background = 'background-image: url("' + obj.snt + '");'
                if(SNT != background && obj.snt != undefined){
                    $('.sercar-img').addClass('sercar-img-show').css('background-image','url(' + obj.snt　+ ')')
                    $('.sercar-backgro').text(obj.title)
                }
                // 下载块往上
                $('.sercar').addClass('sercar-top')
                if(obj.name == "588ku"){
                    if(obj.type == 'img'){
                        $('#dowm-img').css({'opacity':1, 'z-index':3})
                        $($('#dowm-img').parent('a')).unbind()
                        $($('#dowm-img').parent('a')).attr('href', obj.link).click(function(){
                            GetSum(obj.name)
                        })
                    }else
                    if(obj.type == 'psd'){
                        $('#dowm-psd').css({'opacity':1, 'z-index':3})
                        $($('#dowm-psd').parent('a')).unbind()
                        $($('#dowm-psd').parent('a')).attr('href', obj.link).click(function(){
                            GetSum(obj.name)
                        })
                    }
                }else
                if(obj.name == "90sheji"){
                    // 判断为直接响应
                    var _obj = JSON.parse(obj.link)
                    if (_obj.success == 1 && _obj.link != undefined) {
                        $('#dowm-auto').css({'opacity':1, 'z-index':3})
                        $($('#dowm-auto').parent('a')).unbind()
                        $($('#dowm-auto').parent('a')).attr('href', _obj.link).click(function(){
                            GetSum(obj.name)
                        })
                    }
                }else
                if(obj.name == "888pic"){
                    $('#dowm-auto').css({'opacity':1, 'z-index':3})
                    $($('#dowm-auto').parent('a')).unbind()
                    $($('#dowm-auto').parent('a')).attr('href', obj.link).click(function(){
                        GetSum(obj.name)
                    })
                }
            }else{
                Index.Notification('下载超量','您今日已超最大下载量 50 次，请休息一下')
            }                      
        })
        // 初始化
	    $('#sercar-input').attr('name', 'on')
        $('.sercar').addClass('sercar-show')
        
        // loading动画
        window.loading = setInterval(function(){
            var text = $('.loading').text()
            if(text.length == 6){
                $('.loading').text('•')
            }else{
                $('.loading').text(text + '•')
            }
        }, 500)
        // 写入用户名
        $('#user-name').text(localStorage.username)
        // 打开用户信息
        $('#user-name').click(function(){
            $('.user-data').addClass('user-data-hied');
            $('#usertime').text(localStorage.time);
        })
        // 退出用户信息
        $('#userdataquit').click(function(){
            $('.user-data').removeClass('user-data-hied');
        }) 
        // 退出
        $('#quitlogin').click(function(){
            localStorage.removeItem('username')
            localStorage.removeItem('password')
            localStorage.removeItem('permissions')
            document.location.reload(true)
        })
        // 获取搜索框输入
        $('#sercar-input').focus(function(){
            $(this).keyup(function(event){
                $('.sercar-type').removeClass('sercar-type-show')
                $('.sercar-type').text(function(){
                    var url = $('#sercar-input').val()
                    if(PermName(url) != undefined){
                        $('.sercar-type').addClass('sercar-type-show')
                        return SercarName(PermName(url))
                    }
                })
                if(event.which == 13){
                    if($('#sercar-input').attr('name') == 'on'){
                        $('#sercar-input').attr('name', 'off')
                        var val = $('#sercar-input').val()
                        // 判断输入内容是否为链接
                        if(val.search(/http/i) >= 0 && val.search(/\d/g) >= 4){
                            if(val.search(/588ku/i) >= 0 || val.search(/90sheji/i) >= 0 || val.search(/888pic/i) >= 0){
                                // 权限通过
                                if(ClikPerm(PermName(val)) == true){
                                    // 避免重复请求，强制阻断
                                    if(sessionStorage.Url != val){
                                        $('#sercar-input').attr('name', 'on')
                                        sessionStorage.Url = val
                                        // 显示loading
                                        $('.loading').addClass('loading-show')
                                        $('.sercar-backgro').text('')
                                        // 隐藏下载点
                                        $('#down-img, #down-psd, #dowm-auto').css({'opacity':0, 'z-index':0})
                                        // 隐藏缩略图
                                        $('.sercar-img').removeClass('sercar-img-show')
                                        // 下载块往下
                                        $('.sercar').removeClass('sercar-top')
                                        // 发送请求
                                        socket.emit('sercar', {magess: {name: localStorage.username, url: val}})
                                    }
                                }
                            }
                        }
                    }
                }
            })
        })
        // 修改密码
        $('#userdataon').click(function(){
            var key = $('#userkey').val()
            if (key.length != 0) {
                socket.emit('edituserkey', {magess: {username: localStorage.username,password: key,permissions: JSON.parse(localStorage.permissions),time: localStorage.time}})
                socket.on('edituserkey-callback', function (data) {
                    Index.Notification('修改密码', (data.magess == true) ? '修改成功' : '修改失败')
                    if(data.magess == true){
                        $('.user-data').removeClass('user-data-hied')
                    }
                })
            }
        })
    }
    
    
    // 页面加载完成
    $().ready(function(){
        socket = io.connect(location.host+':81')
        socket.on('reconnect', function(){
            socket = io.connect(location.host+':81')
            if(localStorage.username != undefined && localStorage.password != undefined){
                Index.LoginEmit({name: localStorage.username,pass: localStorage.password,type: 'password'})
            }else{
                Index.Login()
            }
        })
        // 中部定位
        var TupSize = function(WinInner){
            $('.sercar').css('left', WinInner - 300)
            $('.lgoin-body').css('left', WinInner - 150)
        }
        $(window).resize(function(){
            TupSize(window.innerWidth / 2)
            var canvas = $('#canvas canvas')[0]
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        })
        particlesJS('canvas', CanvasData)
        sessionStorage.removeItem('Url')
        sessionStorage.removeItem('Request')
        if(localStorage.username != undefined && localStorage.password != undefined){
            Index.LoginEmit({name: localStorage.username,pass: localStorage.password,type: 'password'})
        }else{
            Index.Login()
        }
        TupSize(window.innerWidth / 2)
    })
}