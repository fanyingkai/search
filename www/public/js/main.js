// 初始化
$().ready(function(){
    
    "use strict"
    
    var HomeName = '思月素材'
    var socket = io.connect(location.host)
    var banner = [
        {url:'./img/banner-1.jpg',href:'#'},
        {url:'./img/banner-2.jpg',href:'#'},
        {url:'./img/banner-3.jpg',href:'#'}   
    ]
    // 设置通知默认值
    Index.Notification.Module({icon:'/img/favicon.ico',error:'/img/wolii.png'})
    
    // banner
    var infobanner = function(id){
        var dom = $('.banner-info i')
        for(var i = 0; i < dom.length; i++){
            if(i == id){
                $(dom[i]).addClass('fa-circle-thin').removeClass('fa-circle')
            }else{
                $(dom[i]).removeClass('fa-circle-thin').addClass('fa-circle')
            }
        }
    }
    $('.banner-body').html(function(){
        var str = ''
        for(var i = 0; i < banner.length; i ++){
            str += '<div class="banner-li click-on" style="background-image:url('+banner[i].url+')" data="'+banner[i].href+'"></div>'
            if(i == banner.length -1){
                return str
            }
        }
    })
    $('.banner-info').html(function(){
        var info = ''
        for(var i = 0; i < banner.length; i ++){
            info += '<i class="fa fa-circle"></i>'
            if(i == banner.length -1){
                return info
            }
        }
    })
    $('.banner').css('top', $(window).width() * 0.005)
    $($('.banner .banner-li')[0]).attr('id', 'banner-hide')
    $('.banner').attr('data', '1')
    infobanner(0)
    window.baner = setInterval(function(){
        var i = $('.banner').attr('data') - ''
        infobanner(i == banner.length ? 0 : i)
        var j = i + 1 > banner.length ? 1 : i + 1
        var img = $('.banner .banner-li')
        for(var f = 0; f < img.length; f++){
            var k = f + 1
            if(k == j){
                $(img[f]).attr('id', 'banner-hide')
            }else{
                $(img[f]).attr('id', '')
            }
        }
        $('.banner').attr('data', j)
    }, 10000)
    $('.banner-li').click(function(){
        var url = $(this).attr('data')
        window.open(url)
    })
    
    
    // 下载计数
    var GetSum = function(id){
        socket.emits('DownloadCount', {magess:{name:localStorage.username, id: id}})
    }
    // 下载函数
    var downloadType = {
        '888pic':function(obj){
            Index.SetStyle({remove:['.code$code-show']})
            $('#dowm-auto').css({'opacity':1, 'z-index':3})
            $($('#dowm-auto').parent('a')).unbind()
            $($('#dowm-auto').parent('a')).attr('href', obj.link).click(function(){
                GetSum(obj.name)
            })
        },
        '588ku':function(obj){
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
        },
        '90sheji':function(obj){
            var load = JSON.parse(obj.link)
            if (load.success == 1 && load.link != undefined) {
                $('#dowm-auto').css({'opacity':1, 'z-index':3})
                $($('#dowm-auto').parent('a')).unbind()
                $($('#dowm-auto').parent('a')).attr('href', load.link).click(function(){
                    GetSum(obj.name)
                })
            }
        },
        '58pic':function(obj){
            if (obj.link != undefined) {
                $('#dowm-auto').css({'opacity':1, 'z-index':3})
                $($('#dowm-auto').parent('a')).unbind()
                $($('#dowm-auto').parent('a')).attr('href', obj.link).click(function(){
                    GetSum(obj.name)
                })
            } 
        }
    }
    
    
    // 开始加载 =================================================================>>>
    // 发送函数
    socket.emits = function(Event, data){
        socket.emit('MagesEvent', {_id_:socket.id, event:Event, data:data})
    }
    
    // websocket断开
    socket.on('reconnect', function(){
        document.location.reload(true)
    })
    
    // websocket连接
    socket.on('connect', function(){
        var TupSize = function(WinInner){
            $('.sercar').css('left', WinInner - 300)
            $('.lgoin-body').css('left', WinInner - 150)
            $('.user-div').css('left', WinInner - 150)
        }
        $(window).resize(function(){
            TupSize(window.innerWidth / 2)
        })
        // 刷新
        $('#refresh').click(function(){
            document.location.reload(true)
        })
        // 链接a标签
        $('a').click(function(){
            var url = $(this).attr('data')
            if(url != '' && url != undefined){
                window.open(url)
            }
        })
        // 弹出信息
        $('.hover-info').hover(function(){
            var val = $(this).attr('val')
            $('.info').attr('id', 'info-hide').text(val)
        }, function(){
            $('.info').attr('id', '').text('')
        })
        localStorage.removeItem('Url')
        localStorage.removeItem('Request')
        sessionStorage.removeItem('LoginK')
        sessionStorage.removeItem('download')
        // 初始化时判定
        if(localStorage.username != undefined && localStorage.password != undefined){
            EmitLoginData({name: localStorage.username, pass: localStorage.password, type:true, click:true})
        }else{
            Index.SetStyle({remove:['.lgoin-body$login-body-hide']})
            UserLogin()
        }
        TupSize(window.innerWidth / 2)
    })
    
    
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
        
        // 打开用户信息
        $('#userdataname').text(localStorage.username)
        $('.user-div f').text('有效期： '+ localStorage.time)
        $('#userdataopen').click(function(){
            $('.user-data').attr('id', 'user-data-hide')
            $('.user-div').attr('id', 'user-div-hide')
            $('#user-data-ok').unbind()
            $('#user-data-ok').click(function(){
                var type = $(this).attr('data')
                if(type == 'key'){
                    $('.newkey').attr('id', 'newkey-hide')
                    $(this).attr('data', 'keyon').text('确定')
                }else{
                    var key = $('#newkey-hide input').val()
                    if(key.length != 0) {
                        socket.emits('ChangePassword', {magess: {username: localStorage.username, password: key}})
                        socket.on('edituserkey-callback', function (data){
                            Index.Notification.To('修改密码', 'info', (data.magess == true) ? '修改成功' : '修改失败')
                            if(data.magess == true){
                                $('#user-data-ok').attr('data', 'key').text('修改密码')
                                $('.user-data').attr('id', '')
                                $('.user-div').attr('id', '')
                                $('.newkey').attr('id', '')
                            }
                        })
                    }
                }
            })
            $('#user-data-off').unbind()
            $('#user-data-off').click(function(){
                $('#user-data-ok').attr('data', 'key').text('修改密码')
                $('.user-data').attr('id', '')
                $('.user-div').attr('id', '')
                $('.newkey').attr('id', '')
            })
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
            sessionStorage.removeItem('LoginK')
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
                if(text.search(/http/i) >= 0 && text.search(/\d/g) >= 4 && text.search(/588ku/i) >= 0 || text.search(/90sheji/i) >= 0 || text.search(/888pic/i) >= 0 || text.search(/58pic/i) >= 0 && Index.ClikPerm(JSON.parse(localStorage.permissions), Index.PermName(text)) == true && sessionStorage.download != text){
                    return true
                }
            }

        }
        
        // 修改密码
        $('#userdataon').click(function(){
            var key = $('#userkey').val()
            if(key.length != 0) {
                socket.emits('ChangePassword', {magess: {username: localStorage.username, password: key}})
                socket.on('edituserkey-callback', function (data){
                    Index.Notification.To('修改密码', 'info', (data.magess == true) ? '修改成功' : '修改失败')
                    if(data.magess == true){
                        $('.user-data').removeClass('user-data-hied')
                    }
                })
            }
        })
        
        // 搜索
        socket.on('FlashGot', function(_type_){
            // 获取搜索框输入
            $('#sercar-input').focus(function(){
                $(this).keyup(function(event){
                    var text = $('#sercar-input').val()
                    if(event.which == 13 && InputType(text) == true){
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
                        // 下载块往下
                        $('.sercar').removeClass('sercar-top')
                        $('.banner').css('top', $(window).width() * 0.005)
                        $('.banner').attr('id', '')
                        // 发送请求
                        window[localStorage._id](socket.id, text)
                    }
                })
            })
        })
        
        // 正常响应
        var infoDown = function(obj){
            $('.loading').removeClass('loading-show')
            var SNT = $('.sercar-img').attr('style')
            var background = 'background-image: url("' + obj.snt + '");'
            if(SNT != background && obj.snt != undefined){
                $('.sercar-img').addClass('sercar-img-show').css('background-image','url(' + obj.snt　+ ')')
                $('.sercar-backgro').text(obj.title)
            }
            // 下载块往上
            $('.sercar').addClass('sercar-top')
            $('.banner').css('top', '')
            $('.banner').attr('id', 'banner-top')
            downloadType[obj.name](obj)
        }
        
        // 有问题的响应
        var errorDown = function(obj){
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
        
        // 服务器响应
        socket.on('sercar-callback', function(data){
            $('#sercar-input').attr('name', 'on')
            var obj = (typeof data.magess !== 'object') ? JSON.parse(data.magess) : data.magess
            if(obj.error != undefined){
                Index.Notification.To('下载超量', 'error', '您今日已超最大下载量 50 次，请休息一下')
            }else{
                if(obj.code == undefined){
                    infoDown(obj)
                }else{
                    errorDown(obj)
                }
            }                      
        })
        
    }
    
    
    // 发送登录信息
    var EmitLoginData = function(password){
        if(location.search == '?admin'){
            socket.emits('AdminLogin', {magess: password})
            localStorage.username = password.name
        }else{
            socket.emits('Login', {magess: password})
        } 
        if(password.click == true){
            localStorage.Notification = 'true'
        }else{
            localStorage.Notification = 'false'
        }
    }
    
    // 接收登录回调
    // 管理员
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
            location.href = location.protocol + '//' + location.host + data.magess.url
        }
    })
    
    // 用户
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
            localStorage.Notification = 'false'
        }else{
            if(Index.TypeTime(data.magess.time) == true){
                Index.SetStyle({add:['.lgoin-body$login-body-hide']})
                if(document.getElementById('login-local-key') != null && document.getElementById('login-local-key').checked == true){
                    Index.Storage.Updata('password', data.magess.key) 
                }
                Index.Storage.Updata('username', data.magess.id)
                Index.Storage.Updata('permissions', JSON.stringify(data.magess.permissions))
                window.USER = data.magess
                Index.Storage.Updata('time', data.magess.time)
                Index.Storage.Updata('_id', data.magess._id)
                window.__proto__[data.magess._id] = function(_id_, val){
                    var mage = {name:localStorage.username, url: val, SearchName:Index.PermName(val)}
                    mage[_id_] = {key:localStorage.password}
                    socket.emits('Search', {magess:mage})
                }
                FlashGot()
                if(localStorage.Notification == 'false'){
                    Index.Notification.To('登录成功', 'info', data.magess.id + '    欢迎来到' + HomeName)
                }
            }
        }
    })
    
    // 等待登录
    // 登录输入动作
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
    
    
})