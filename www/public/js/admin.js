    var ADMIN = {
        // 用户模块
        user: {
            // 权限
            permissions: function(data) {
                var perm = ''
                for (var c = 0, d = data; c < d.length; c++) {
                    if (d[c] == '588ku') { perm += '千库,' } else if (d[c] == '90sheji') { perm += '90设计,' } else if (d[c] == '58pic') {perm += '千图,'} else if (d[c] == 'ooopic') {perm += '我图,'}
                    if (c == d.length - 1) {
                        return perm.slice(0, perm.length - 1)
                    }
                }
            },
            // 用户有效期
            usertime: function(time) {
                var myDate = new Date(), n = myDate.getFullYear(), y = myDate.getMonth(), r = myDate.getDate();
                if (time != undefined) {
                    var dataT = time.split('-');
                    if(dataT[0] - '' > n){
                        return 'admin-user-li '
                    }else{
                        if(dataT[1] - '' > y + 1){
                            return 'admin-user-li '
                        }else{
                            if(dataT[2] - '' > r){
                                return 'admin-user-li '
                            }else{
                                return 'admin-user-li admin-user-li-error'
                            }
                        }
                    }
                }else{
                    return 'admin-user-li'
                }
            },
            // 用户信息编辑
            edit: function() {
                // 点击单个用户
                $('.admin-user-li').click(function(Event) {
                    // 判断点击不是 checkbox
                    if($(Event.target).attr('type')  != 'checkbox'){
                        var id = $(this).attr('id');
                        // 从存储中提取数据
                        var userdata = JSON.parse(sessionStorage['userdata_' + id]);
                        // 填充数据
                        $('.admin-user-data').addClass('admin-user-data-on').attr('name', 'edit');
                        $('#admin-user-data-id').html('帐号:<span>' + userdata.id + '</span>').attr('name', userdata.id);
                        $('#admin-user-data-key')[0].value = userdata.key;
                        // 有效期
                        if (userdata.time != undefined) {
                            var time = userdata.time.split('-');
                            $('#damin-user-data-time-n')[0].value = time[0];
                            $('#damin-user-data-time-y')[0].value = time[1];
                            $('#damin-user-data-time-r')[0].value = time[2];
                        }
                        // 权限
                        var pemr = $('.damin-user-data-li').find('input');
                        for (var a = 0; a < userdata.permissions.length; a++) {
                            var name = userdata.permissions[a];
                            for (var b = 0; b < pemr.length; b++) {
                                if ($(pemr[b]).attr('name') == name) {
                                    $(pemr[b])[0].checked = true;
                                }
                            }
                        }
                    }
                });
                // 退出编辑
                $('#damin-user-data-quit').click(function() {
                    $('.admin-user-data').removeClass('admin-user-data-on');
                    $('#admin-user-data-key')[0].value = '';
                    // 清除数据
                    var pemr = $('.damin-user-data-li').find('input');
                    for (var b = 0; b < pemr.length; b++) {
                        $(pemr[b])[0].checked = false;
                    }
                    $('#damin-user-data-time-n')[0].value = '';
                    $('#damin-user-data-time-y')[0].value = '';
                    $('#damin-user-data-time-r')[0].value = '';
                });
                // 确认
                $('#damin-user-data-ok').click(function() {
                    // id
                    var id = function(){
                        if($('.admin-user-data').attr('name') == 'edit'){
                            return $('#admin-user-data-id').attr('name');
                        }else
                        if($('.admin-user-data').attr('name') == 'new'){
                            return $('#admin-user-data-name').val();
                        };
                    };
                    // key
                    var key = $('#admin-user-data-key').val();
                    // time
                    var time = function() {
                        var n = $('#damin-user-data-time-n').val();
                        var y = $('#damin-user-data-time-y').val();
                        var r = $('#damin-user-data-time-r').val();
                        return n + '-' + y + '-' + r;
                    };
                    // permissions
                    var pemr = function() {
                        var ayyr = [];
                        var pemr = $('.damin-user-data-permissions').find('input');
                        for (var a = 0; a < pemr.length; a++) {
                            if ($(pemr[a])[0].checked == true) {
                                ayyr.push($(pemr[a]).attr('name'));
                            }
                            if (a == pemr.length - 1) {
                                return ayyr;
                            }
                        }
                    };
                    // 用户数据
                    var userDATA = {
                        id: id(),
                        key: key,
                        time: time(),
                        permissions: pemr()
                    };
                    // 编辑信息
                    if($('.admin-user-data').attr('name') == 'edit'){
                        socket.emit('useredit', {magess: userDATA});
                        socket.on('useredit-callback', function(data) {
                            if (data.magess != false) {
                                $('.admin-user-data').removeClass('admin-user-data-on');
                                $('#admin-user-data-key')[0].value = '';
                                var pemr = $('.damin-user-data-li').find('input');
                                for (var b = 0; b < pemr.length; b++) {
                                    $(pemr[b])[0].checked = false;
                                }
                                $('#damin-user-data-time-n')[0].value = '';
                                $('#damin-user-data-time-y')[0].value = '';
                                $('#damin-user-data-time-r')[0].value = '';
                                if($('#' + data.magess).length != 0){
                                    var dom = $('#' + data.magess);
                                    if($(dom).attr('class')  == 'admin-user-li' || 'admin-user-li-error'){
                                        $(dom).html('<span class="admin-user-name"><input type="checkbox">' + userDATA.id + '</span><span class="admin-user-key">' + userDATA.key + '</span><span class="admin-user-pem">' + ADMIN.user.permissions(userDATA.permissions) + '</span><span class="admin-user-time">' + userDATA.time + '</span>');
                                    }
                                }
                            }
                        });
                    }else
                    // 新建用户
                    if($('.admin-user-data').attr('name') == 'new'){
                        socket.emit('instuser', {magess: userDATA});
                        socket.on('instuser-callback', function(data){
                            if(data.magess == true){
                                alert('成功');
                            }else
                            if(data.magess == false){
                                alert('失败');
                            }
                        })
                    };
                });
            },
            // 用户信息列表
            tab:function(data){
                if (data.magess.length != 0) {
                    $('.admin-user').html('');
                    var userData = data.magess;
                    for (var a = 0; a < userData.length; a++) {
                        // 单个用户信息
                        var dataLI = userData[a];
                        sessionStorage['userdata_' + dataLI.id] = JSON.stringify(dataLI);
                        // 写入节点
                        if (dataLI.id.search(/@/i) < 0 && $('#' + dataLI.id).length == 0) {
                            var time = (dataLI.time != undefined) ? dataLI.time : '0';
                            var newdom = '<div class="' + ADMIN.user.usertime(dataLI.time) + '" id="' + dataLI.id + '"><span class="admin-user-name"><input type="checkbox">' + dataLI.id + '</span><span class="admin-user-key">' + dataLI.key + '</span><span class="admin-user-pem">' + ADMIN.user.permissions(dataLI.permissions) + '</span><span class="admin-user-time">' + time + '</span></div>';
                            var dom = $('.admin-user').html();
                            $('.admin-user').html(dom + newdom);
                        }
                        if (a == userData.length - 1) {
                            ADMIN.user.edit();
                        }
                    }
                }
                if (data.magess.length < 30){
                    $('#admin-user-tab-bottem').attr('name', 'end');
                }
            }
        },
        // cookie
        cookie:{
            li:function(id){
                var cookie = JSON.parse(sessionStorage.COOKIEARRAY);
                $('.admin-cookie-ul').html('');
                for(var a = 0; a<cookie.length; a++){
                    var data = cookie[a];
                    if(data.obj == id){
                        sessionStorage['cookie_' + data.user] = JSON.stringify(data);
                        var dom = '<div class="admin-cookie-li" id="' + data.user + '"><span class="admin-cookie-li-name"><input type="text"  id="admin-cookie-li-id"></span><span class="admin-cookie-li-cookie"><input type="text"  id="admin-cookie-li-cookie"><div class="admin-cookie-li-edit"><button id="admin-cookie-li-ok" name="' + data.user     + '">确定</button><button id="admin-cookie-li-del" name="' + data.user + '">删除</button></div></span></div>';
                        document.getElementsByClassName('admin-cookie-ul')[0].innerHTML += dom;
                    }
                    if(a == cookie.length -1){
                        for(var a = 0; a<cookie.length; a++){
                            var data = cookie[a];
                            if(data.obj == id){
                                $($('#' + data.user).find('#admin-cookie-li-id'))[0].value = data.user;
                                $($('#' + data.user).find('#admin-cookie-li-cookie'))[0].value = data.data;
                            }
                            if(a == cookie.length - 1){
                                $('.admin-cookie-li-edit #admin-cookie-li-ok').click(function(){
                                    var id = $(this).attr('name'); 
                                    var data = JSON.parse(sessionStorage['cookie_' + id]);
                                    data.data = $($('#' + id).find('#admin-cookie-li-cookie')).val();
                                    data.user = $($('#' + id).find('#admin-cookie-li-id')).val();
                                    socket.emit('upcookie', {magess:data});
                                    socket.on('upcookie-callback', function(_data){
                                        if(_data.magess == true){
                                            $($('#' + id).find('#admin-cookie-li-cookie'))[0].value = data.data;
                                            $($('#' + id).find('#admin-cookie-li-id'))[0].value = data.user;
                                        }
                                    });
                                });
                                $('.admin-cookie-li-edit #admin-cookie-li-del').click(function(){
                                    alert('暂不支持');
                                });
                            }
                        }
                    }
                }
            }
        }
    };




    $('#admin-cookiegl').hide();
    // 用户信息
    socket.emit('user', {magess: {skip: 0, limit: 31}});
    socket.on('user-callback', function(data) {
        ADMIN.user.tab(data);
    });
    // mune
    $('.admin-title button').click(function(){
        var name = $(this).attr('name');
        if(name == 'off'){
            $('#admin-cookiegl').show();
            $('#admin-zhgl').show();
            $(this).attr('name', 'on');
            $('#admin-cookiegl').click(function(){
                $('#admin-zhgl').hide();
                $(this).attr('name', 'off');
                $('.admin-title').attr('name', 'cookie');
                $('.admin-body').attr('id','');
                $('.admin-cookie').attr('id','admin-html-on');
            });
            $('#admin-zhgl').click(function(){
                $('#admin-cookiegl').hide();
                $(this).attr('name', 'off');
                $('.admin-title').attr('name', 'zh');
                $('.admin-body').attr('id','admin-html-on');
                $('.admin-cookie').attr('id','');
            });
        }else{
            var id = $('.admin-title').attr('name');
            if(id == 'zh'){
                $('#admin-cookiegl').hide();
                $(this).attr('name', 'off');
            }else
            if(id == 'cookie'){
                $('#admin-zhgl').hide();
                $(this).attr('name', 'off');
            };
        };
    });
    // 数据分页
    // 上一页
    $('#admin-user-tab-top').click(function(){
        var tab = $('.admin-user-tab-body').attr('name') - '';
        if(tab != 1){
            var limit = tab - 1;
            var skip = function(){
                if(limit == 1){
                    return 0;
                }else{
                    var a = limit - 2;
                    if(a == 0){
                        return 31;
                    }else{
                        return a * 31;
                    }
                }
            };
            socket.emit('user', {magess: {skip: skip(), limit: 31}});
            $('.admin-user-tab-body').attr('name', limit);
        }
    })
    // 下一页
    $('#admin-user-tab-bottem').click(function(){
        var tab = $('.admin-user-tab-body').attr('name') - '';
        var skip = tab * 31;
        var limit = tab + 1;
        if($('#admin-user-tab-bottem').attr('name') != 'end'){
            socket.emit('user', {magess: {skip: skip, limit: 31}});
            $('.admin-user-tab-body').attr('name', limit);
        }
    })
    // 删除帐号
    $('#userdata-del').click(function(){
        var dom = $('.admin-user-li');
        for(var a = 0; a < dom.length; a ++){
            var tab = $(dom[a]).find('input');
            if($(tab)[0].checked == true){
                socket.emit('deluser', {magess: $(dom[a]).attr('id')});
            };
        };
        socket.on('deluser-callback', function(data){
            if(data.magess != false){
                $('#'+ data.magess).remove();
            };
        });
    });
    // 全选
    $('#userdata-all').click(function(){
        if($(this)[0].checked == true){
            check(true);
        }else{
            check(false);
        }
        function check(tb){
            var dom = $('.admin-user-li');
            for(var a = 0; a < dom.length; a ++){
                var tab = $(dom[a]).find('input');
                $(tab)[0].checked = tb;
            };
        };
    });
    // 新建帐号
    $('#userdata-new').click(function(){
        $('.admin-user-data').addClass('admin-user-data-on').attr('name', 'new');
        $('#admin-user-data-id').html('帐号:<span><input type="text"  id="admin-user-data-name"></span>');
    });
    // 批量删除
    $('#admin-userdata-sumnew-on').click(function(){
        var text = $('#admin-userdata-sumnew-txt').val();
        var tabarray = text.split('帐号');
        for(var a=0; a < tabarray.length; a ++){
            socket.emit('deluser', {magess: tabarray[a]});
            socket.on('deluser-callback', function(data){
                if(data.magess == false){
                    alert('错误');
                }
            })
        };
    });
    // cookie信息
    socket.emit('cookiearray');
    socket.emit('cookie');
    socket.on('cookiearray-callback', function(data){
        sessionStorage.COOKIEARRAY = JSON.stringify(data.magess);
        // 千库cookie
        ADMIN.cookie.li('588ku');
    });
    socket.on('cookie-callback', function(data){
        sessionStorage.COOKIE = JSON.stringify(data.magess);
    });
    // 新建cookie
    $('#admin-cookie-li-newok').click(function(){
        var user = $('.admin-cookie-data #admin-cookie-li-id').val();
        var data = $('.admin-cookie-data #admin-cookie-li-cookie').val();
        var type = $('.admin-cookie-data').attr('name');
        socket.emit('inst-cookie', {magess:{
            id:type,
            cookie:data,
            user:user
        }});
        socket.on('inst-cookie-callback', function(data){
            if(data.magess == true){
                alert('成功')
            }else{
                alert('失败')
            }
        })
    });
    // 切换cookie
    $('.admin-cookie-title button').click(function(){
        var name = $(this).attr('name')
        ADMIN.cookie.li(name);
        $('.admin-cookie-data').attr('name', name);
    })
    // 接受cookie错误信息
    socket.on('Request-error-callback', function(data){
        var type = function(id){
            if(id == -1){
                return '未知类型'
            }else
            if(id == -3){
                return '需要确认验证码'
            }else
            if(id == 404){
                return 'COOKIE失效'
            }else
            if(id == 'error'){
                return '帐号被封'
            }else
            if(id == -14 || -12){
                return '帐号繁忙,自动跳过'
            }
        }
        var name = function(id){
            if(id == '588ku'){
                return '千库'
            }else
            if(id == '90sheji'){
                return '90设计'
            }
        }
        var Body = name(data.magess.data) + " NO: " + data.magess.id + "\n 类型 : " + type(data.magess.type) 
        if (Notification.permission === "granted") {
            var notification = new Notification("帐号错误", {"icon":"/img/wolii.png", "body": Body})
        }else 
        if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    var notification = new Notification("帐号错误", {"icon":"/img/wolii.png", "body": Body})
                }
            })
        }
    })