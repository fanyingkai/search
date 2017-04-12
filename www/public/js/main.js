"use strict"

// Contact GitHub API Training Shop Blog About
// © 2017 GitHub, Inc. Terms Privacy Security Status Help
// Skip to content
// This repository
// @xivistudios
// xivistudios/gulp
// Branch: master Find file Copy pathgulp/local/public/js/index.js
// @xivistudios xivistudios Panda
// @xivistudios www.github.com//xivistudios
// RawBlameHistory


// 初始化
$().ready(function(){
    
    var socket = io(location.host == 'www.xivistudio.cn' ? location.host : location.host + ':88')
    // 下载计数
    var GetSum = function(id){
        socket.emits('DownloadCount', {magess:{name:localStorage.username, id: id}})
    }
    
    var downloadType = new Object()
    downloadType['588ku'] = new Object()
    downloadType['888pic'] = function(obj){
        Index.SetStyle({remove:['.code$code-show']})
        $('#dowm-auto').css({'opacity':1, 'z-index':3})
        $($('#dowm-auto').parent('a')).unbind()
        $($('#dowm-auto').parent('a')).attr('href', obj.link).click(function(){
            GetSum(obj.name)
        })
    }
    downloadType['588ku'] = function(obj){
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
    }
    downloadType['90sheji'] = function(obj){
        var load = JSON.parse(obj.link)
        if (load.success == 1 && load.link != undefined) {
            $('#dowm-auto').css({'opacity':1, 'z-index':3})
            $($('#dowm-auto').parent('a')).unbind()
            $($('#dowm-auto').parent('a')).attr('href', load.link).click(function(){
                GetSum(obj.name)
            })
        }
    }
    
    // ==========================>>> ready
    socket.emits = function(Event, data){
        socket.emit('MagesEvent', {_id_:socket.id, event:Event, data:data})
    }
    socket.on('reconnect', function(){
        document.location.reload(true)
    })
    socket.on('connect', function(){
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
        particlesJS('canvas', {particles: {color: '#f00222',shape: 'circle',opacity: 0.5,size: 10,size_random: true,nb: 200,line_linked: {enable_auto: true,distance: 100,color: '#00b150',opacity: 0.1,width: 1,condensed_mode: {enable: false,rotateX: 600,rotateY: 600}},anim: {enable: true,speed: 1}},interactivity: {enable: true,mouse: {distance: 250},detect_on: 'canvas',mode: 'grab',line_linked: {opacity: 0.5},events: {onclick: {enable: true,mode: 'push',nb: 4}}},retina_detect: true})
        Index.Storage.Del('Url')
        Index.Storage.Del('Request')
        // 初始化时判定
        if(localStorage.username != undefined && localStorage.password != undefined){
            EmitLoginData({name: localStorage.username, pass: localStorage.password, type:true})
        }else{
            Index.SetStyle({remove:['.lgoin-body$login-body-hide']})
            UserLogin()
        }
        TupSize(window.innerWidth / 2)
    })
    // 设置通知默认值
    Index.Notification.Module({
        icon:'/img/favicon.ico',
        error:'/img/favicon.ico'
    })
    // 发送登录信息
    var EmitLoginData = function(password){
        if(location.search == '?xuguanhuo'){
            socket.emits('AdminLogin', {magess: password})
            socket.on('admin-login-callback', function(data){
                if(data.magess == false){
                    if(sessionStorage.LoginK != '0'){
                        UserLogin()
                    }
                    localStorage.removeItem('username')
                    localStorage.removeItem('password')
                    localStorage.removeItem('permissions')
                    Index.SetStyle({remove:['.lgoin-body$login-body-hide']})
                }else{
                    if(document.getElementById('login-local-key') != null && document.getElementById('login-local-key').checked == true){
                        localStorage.password = data.magess.key
                    }
                    localStorage.username = password.name
                    console.log(location.protocol + '//' + location.host + data.magess.url)
                    location.href = location.protocol + '//' + location.host + data.magess.url
                }
            })
        }else{
            socket.emits('Login', {magess: password})
            socket.on('login-callback', function(data){
                if(data.magess == false){
                    if(sessionStorage.LoginK != '0'){
                        UserLogin()
                    }
                    localStorage.removeItem('username')
                    localStorage.removeItem('password')
                    localStorage.removeItem('permissions')
                    Index.Notification.To('登录失败', 'error', '账号或密码错误')
                    Index.SetStyle({remove:['.lgoin-body$login-body-hide', '.sercar$sercar-show']})
                }else{
                    if(Index.TypeTime(data.magess.time) == true){
                        Index.SetStyle({add:['.lgoin-body$login-body-hide']})
                        if(document.getElementById('login-local-key') != null && document.getElementById('login-local-key').checked == true){
                            Index.Storage.Updata('password', data.magess.key) 
                        }
                        Index.Storage.Updata('username', password.name)
                        Index.Storage.Updata('permissions', JSON.stringify(data.magess.permissions))
                        Index.Storage.Updata('time', data.magess.time)
                        Index.Storage.Updata('_id', data.magess._id)
                        window.__proto__[data.magess._id] = function(_id_, val){
                            var mage = {name:localStorage.username, url: val, SearchName:Index.PermName(val)}
                            mage[_id_] = {key:localStorage.password}
                            socket.emits('Search', {magess:mage})
                        }
                        FlashGot()
                    }
                }
            })
        }
    }
    // 等待登录
    var UserLogin = function(){
        sessionStorage.LoginK = '0'
        $('#login-user-pass').focus(function(){
            $(this).keyup(function(event){
                if (event.which == 13) {
                    var name = $('#login-user-name').val()
                    var pass = $('#login-user-pass').val()
                    if(name.length > 0 && pass.length > 0 ){
                        EmitLoginData({name: name,pass: pass, type: false})
                    }
                }
            })
        })
        $('#login-login-push').click(function () {
            var name = $('#login-user-name').val()
            var pass = $('#login-user-pass').val()
            if(name.length > 0 && pass.length > 0 ){
                EmitLoginData({name: name, pass: pass, type: false})
            }
        })
    }
    // 下载
    var FlashGot = function(){
        $('#sercar-input').attr('name', 'on')
        Index.SetStyle({add:['.sercar$sercar-show']})
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
            Index.SetStyle({add:['.user-data$user-data-hied']})
            $('#usertime').text(localStorage.time)
        })
        // 退出用户信息
        $('#userdataquit').click(function(){
            Index.SetStyle({remove:['.user-data$user-data-hied']})
        }) 
        // 退出
        $('#quitlogin').click(function(){
            localStorage.removeItem('username')
            localStorage.removeItem('password')
            localStorage.removeItem('permissions')
            document.location.reload(true)
        })
        // 输入验证
        var InputType = function(text){
            Index.SetStyle({remove:['.sercar-type$sercar-type-show']})
            $('.sercar-type').text(function(){
                var text = $('#sercar-input').val()
                if(Index.PermName(text) != undefined){
                    $('.sercar-type').addClass('sercar-type-show')
                    return Index.WebCode(Index.PermName(text))
                }
            })
            if($('#sercar-input').attr('name') == 'on'){
                $('#sercar-input').attr('name', 'off')
                if(text.search(/http/i) >= 0 && text.search(/\d/g) >= 4 && text.search(/588ku/i) >= 0 || text.search(/90sheji/i) >= 0 || text.search(/888pic/i) >= 0 && Index.ClikPerm(JSON.parse(localStorage.permissions), Index.PermName(text)) == true && sessionStorage.download != text){
                    return true
                }
            }

        }
        // 搜索
        socket.on('FlashGot', function(_type_){
            // 获取搜索框输入
            $('#sercar-input').focus(function(){
                $(this).keyup(function(event){
                    if(event.which == 13){
                        var text = $('#sercar-input').val()
                        if(InputType(text) == true){
                            $('#sercar-input').attr('name', 'on')
                            sessionStorage.download = text
                            // 显示loading
                            Index.SetStyle({add:['.loading$loading-show']})
                            $('.sercar-backgro').text('')
                            // 隐藏下载点
                            $('#dowm-img').css({'opacity':0, 'z-index':-1})
                            $('#dowm-psd').css({'opacity':0, 'z-index':-1})
                            $('#dowm-auto').css({'opacity':0, 'z-index':-1})
                            // 隐藏缩略图
                            Index.SetStyle({remove:['.sercar-img$sercar-img-show']})
                            Index.SetStyle({remove:['.sercar$sercar-top']})
                            // 发送请求
                            window[localStorage._id](socket.id, text)
                        }
                    }
                })
            })
            // 修改密码
            $('#userdataon').click(function(){
                var key = $('#userkey').val()
                if(key.length != 0) {
                    sockets.emit('ChangePassword', {magess: {username: localStorage.username,password: key,permissions: JSON.parse(localStorage.permissions),time: localStorage.time}})
                    socket.on('edituserkey-callback', function (data){
                        Index.Notification.To('修改密码', 'info', (data.magess == true) ? '修改成功' : '修改失败')
                        if(data.magess == true){
                            $('.user-data').removeClass('user-data-hied')
                        }
                    })
                }
            })
        })
        // 服务器响应
        socket.on('sercar-callback', function(data){
            var obj = (typeof data.magess !== 'object') ? JSON.parse(data.magess) : data.magess
            $('#sercar-input').attr('name', 'on')
            if(obj.error != undefined){
                Index.Notification.To('下载超量', 'error', '您今日已超最大下载量 50 次，请休息一下')
            }else{
                if(obj.code == undefined){
                    $('.loading').removeClass('loading-show')
                    var SNT = $('.sercar-img').attr('style')
                    var background = 'background-image: url("' + obj.snt + '");'
                    if(SNT != background && obj.snt != undefined){
                        $('.sercar-img').addClass('sercar-img-show').css('background-image','url(' + obj.snt　+ ')')
                        $('.sercar-backgro').text(obj.title)
                    }
                    // 下载块往上
                    $('.sercar').addClass('sercar-top')
                    downloadType[obj.name](obj)
                }else{
                    $('.code').addClass('code-show')
                    $('.code-title').html(obj.code.title)
                    var title = $('.code-title h1').text()
                    $('.code-title').html('').text(title)
                    var img = new String
                    for(var i = 0; i < obj.code.imgarr.length; i ++){
                        img += '<img src="'+ obj.code.imgarr[i] +'" data="'+ obj.code.keyarr[i] +'">'
                        if(i == obj.code.imgarr.length - 1){
                            $('.code-img').html(img)
                            sessionStorage.CookieKey = obj.code.key
                            sessionStorage.CookieName = obj.code.id
                            sessionStorage.backhead = obj.code.backhead
                            $('.code-img img').unbind('click')
                            $('.code-img img').click(function(Event){
                                var id = $(Event.target).attr('data')
                                var url = 'http://888pic.com/index.php?m=downVarify&a=verifyCaptcha&answer_key=' + id + 'callback=' + sessionStorage.CookieName
                                 sockets.emit('Code', {url:url, sercar: $('#sercar-input').val(), cookie:sessionStorage.CookieKey, name:localStorage.username, backhead: sessionStorage.backhead})
                            })
                        }
                    }
                }
            }                      
        })
    }
})