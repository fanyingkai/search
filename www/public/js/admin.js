"use strict"

if (typeof Admin == 'undefined') {

    const Admin = new Object()
	var socket = io.connect('http://47.52.43.163')
    

    // ======>>> 控制器
    
    // 弹窗组件
    const PopupWindow = new Object()
    PopupWindow.Exit = function() {
        $('.admin-PopupWindow-body p').text('')
        $('.admin-PopupWindow').removeClass('admin-PopupWindow-on')
        $('.admin-PopupWindow-home').removeClass('admin-PopupWindow-home-on')
        $('.admin-PopupWindow').removeClass('admin-PopupWindow-on')
        $('.admin-PopupWindow-home').removeClass('admin-PopupWindow-home-on')
        $('.admin-PopupWindow-newuser').removeClass('admin-PopupWindow-data-on')
        $('.damin-PopupWindow-newcookie').removeClass('admin-PopupWindow-data-on')
        $('.admin-PopupWindow-newuserPush').removeClass('admin-PopupWindow-data-on')
        $('.admin-PopupWindow-newuser-name').val('')
        $('.admin-PopupWindow-newuser-key').val('')
        $('.admin-PopupWindow-newuser-time').val('')
        const dom = $('.damin-admin-PopupWindow-newuser-qx input')
        for(let i of dom){
            $(i)[0].checked == false
        }
    }
    PopupWindow.To = (text, callback)=>{
        $('.admin-PopupWindow-text p').text(text)
        $('.admin-PopupWindow').addClass('admin-PopupWindow-on')
        $('.admin-PopupWindow-home').addClass('admin-PopupWindow-home-on')
        $('.admin-PopupWindow-text').addClass('admin-PopupWindow-data-on')
        $('.admin-PopupWindow-body-xz button').unbind()
        $('.admin-PopupWindow-body-xz button').click(function() {
            const type = $(this).attr('data')
            if(type == 'ok'){
                callback(true)
            }else{
                PopupWindow.Exit()
            }
        })
    }
    PopupWindow.qx = (id) => {
        const dom = $(id + ' input')
        let arr = []
        for(let i = 0; i < dom.length; i++){
            const j = $(dom[i])
            if(j[0].checked == true){
                arr.push($(j).attr('data'))
            }
            if(i == dom.length - 1){
                return arr
            }
        }
    }
    PopupWindow.NewUserPush = (callback) => {
        $('.admin-PopupWindow').addClass('admin-PopupWindow-on')
        $('.admin-PopupWindow-home').addClass('admin-PopupWindow-home-on')
        $('.admin-PopupWindow-newuserPush').addClass('admin-PopupWindow-data-on')
        $('.admin-PopupWindow-body-xz button').unbind()
        $('.admin-PopupWindow-body-xz button').click(function() {
            const type = $(this).attr('data')
            const time = $('.admin-PopupWindow-newuserPush-time').val()
            const sum = $('.admin-PopupWindow-newuserPush-sum').val()
            const xz = () => {
                const dom = $('.admin-admin-PopupWindow-newuserPush-csxz input')
                let j = {}
                for(let i of dom){
                    const id = $(i).attr('data')
                    const k = $(i).val() == '' ? 0 : $(i).val()
                    j[id] = k
                }
                return j
            }
            if(type == 'no'){
                PopupWindow.Exit()
            }else 
            if(type == 'ok'){
                if(time != '' && time.search(/-/i) == 4 && sum != ''){
                    callback({
                        time: time,
                        permissions: PopupWindow.qx('.damin-admin-PopupWindow-newuserPush-qx'),
                        sum: sum - '',
                        RegisTime: Index.GetTime(),
                        Limit:xz()
                    })
                }else{
                    Index.Notification.To('批量新建用户', 'info', '请正确填写相关信息！')
                }
            }
        })
    }
    PopupWindow.NewUser = (callback)=>{
        $('.admin-PopupWindow').addClass('admin-PopupWindow-on')
        $('.admin-PopupWindow-home').addClass('admin-PopupWindow-home-on')
        $('.admin-PopupWindow-newuser').addClass('admin-PopupWindow-data-on')
        $('.admin-PopupWindow-body-xz button').unbind()
        $('.admin-PopupWindow-body-xz button').click(function() {
            const type = $(this).attr('data')
            const name = $('.admin-PopupWindow-newuser-name').val()
            const time = $('.admin-PopupWindow-newuser-time').val()
            const key = $('.admin-PopupWindow-newuser-key').val()
            if(type == 'no'){
                PopupWindow.Exit()
            }else 
            if(type == 'ok'){
                if(name != '' && name.search(/@/i) < 0 && key != '' && time != '' && time.search(/-/i) == 4){
                    callback({
                        id: name,
                        key: key,
                        time: time,
                        permissions: PopupWindow.qx('.damin-admin-PopupWindow-newuser-qx'),
                        RegisTime: Index.GetTime()
                    })
                }else{
                    Index.Notification.To('新建用户', 'info', '请正确填写相关信息！')
                }
            }
        })
    }
    PopupWindow.NewCookie = (callback) => {
        $('.admin-PopupWindow').addClass('admin-PopupWindow-on')
        $('.admin-PopupWindow-home').addClass('admin-PopupWindow-home-on')
        $('.damin-PopupWindow-newcookie').addClass('admin-PopupWindow-data-on')
        $('.admin-PopupWindow-body-xz button').unbind()
        $('.admin-PopupWindow-body-xz button').click(function() {
            const type = $(this).attr('data')
            const data = $('.admin-PopupWindow-newcookie-data').val()
            if(type == 'no'){
                PopupWindow.Exit()
            }else 
            if(type == 'ok'){
                if(data != ''){
                    callback({name: $('#damin-admin-PopupWindow-newcookie-data-type')[0].value, data: data})
                }else{
                    Index.Notification.To('新建Cookie', 'info', '请正确填写相关信息！')
                }
            }
        })
    }
    

    // 首页
    Admin['admin-home'] = (socket)=>{
        const space = {"space_name": '.admin-pace-new',"space_size": '.admin-pace-old',"space_used_size": '.admin-pace-code',"space_available_size": '.admin-pace-map',"physical_space_size": '.admin-pace-large'}
        const name = {"new_space": '新生代',"old_space": '老生代',"code_space": '程序空间',"map_space": '映射空间',"large_object_space": '大对象空间'}
        const arr = ['space_name', 'space_size', 'space_used_size', 'space_available_size', 'physical_space_size']
        // 定时请求
        const ServerSpace = setInterval(()=>{
            socket.emits('ServerSpace')
            if($('.admin-home').attr('id') != 'damin-on'){
                clearInterval(ServerSpace)
            }
        }
        , 5000)
        // 堆栈信息
        socket.on('ServerSpace_callback', (msg)=>{
            const data = msg.magess
            const body = $('.damin-server-pace')
            for(let i = 0; i < body.length; i++){
                const tab = data[i]
                const div = body[i]
                for(let name_i of arr){
                    if(name_i == 'space_name'){
                        $($(div).find(space['space_name'])).text(name[tab.space_name])
                    }else{
                        $($(div).find(space[name_i])).text(tab[name_i])
                    }
                }
            }
        })
        // 系统信息
        socket.emits('GetServerDate', {magess: true})
        socket.on('GetServerDate_callback', (mag)=>{
            const data = mag.magess
            sessionStorage.SystemData = JSON.stringify(data)
            const ram = (sum)=>{
                return Math.round(sum / 1024 / 1024 / 1024)
            }
            $('#admin-index-dowmload').text(data.zx)
            $('#admin-index-bug').text(data.bug)
            $('#admin-index-cache').text(data.cache)
            $('#admin-index-user').text(data.user)
            $('#admin-index-cpu').text(data.cpu[0].model + ' X ' + data.cpu.length)
            $('#admin-index-sumRam').text(ram(data.sumRam) + 'GB')
            $('#admin-index-idleRam').text(ram(data.idleRam) + 'GB')
            $('#admin-index-operatingSystem').text(data.operatingSystem)
            $('#admin-index-runTime').text(Math.round(data.runTime / 60 / 60) + '小时')
            $('#server-config-httpPort')[0].value = data.config.httpPort
            $('#server-config-websocket')[0].value = data.config.websocket
            $('#server-config-mongodb')[0].value = data.config.mongodb
            $('#server-config-tcpPort')[0].value = data.config.tcpPort
            $('#server-config-adminpath')[0].value = data.config.adminpath
            $('#server-config-adminname')[0].value = data.config.admin.name
            $('#server-config-adminkey')[0].value = data.config.admin.key
            $('#admin-server-config-edit').unbind()
            $('#admin-server-config-edit').click(function(){
                PopupWindow.To(`确认修改服务器配置?`, (type)=>{
                    if(type == true){
                        data.config.httpPort = $('#server-config-httpPort')[0].value
                        data.config.websocket = $('#server-config-websocket')[0].value
                        data.config.mongodb = $('#server-config-mongodb')[0].value
                        data.config.tcpPort = $('#server-config-tcpPort')[0].value
                        data.config.adminpath = $('#server-config-adminpath')[0].value
                        data.config.admin.name = $('#server-config-adminname')[0].value
                        data.config.admin.key = $('#server-config-adminkey')[0].value
                        socket.emits('EditConfig', {magess:data.config})
                        socket.emits('GetServerDate', {magess: true})
                        PopupWindow.Exit()
                        socket.emits('RestartWorker', {Restart:true})
                    }
                })
            })
            $('.System-Start').click(function(){
                PopupWindow.To(`确认重启服务器进程吗?`, (type)=>{
                    if(type == true){
                        socket.emits('RestartWorker', {Restart:true})
                        PopupWindow.Exit()
                    }
                })
            })
        })
    }

    
    // 用户管理
    Admin['admin-user'] = (socket)=>{
        // 每页显示数
        let TableLimit = 10
        const TabLimit = function() {
            const val = $('#table-view-sum')[0].value
            if(val == '显示条数'){
                TableLimit = 10
            } else {
                TableLimit = val - ''
            }
        }
        // 写入翻页控件
        const setTableLimit = ()=>{
            $('.table-magnass').html(function() {
                const user = Math.ceil($('#admin-index-user').text() / TableLimit)
                let button = new String()
                for(let i = 0; i < user; i++){
                    button += `<div class="table-magnass-body-button click-on" value="${i + 1}"  id="${i == 0 ? 'table-magnass-body-button-on' : ''}">${i + 1}</div>`
                    if(i == user - 1){
                        return `
                        <div class="table-magnass-body" data="0" max="${user}">
                            <div class="table-magnass-body-button click-on" id="table-magnass-body-button-no" data="previous">上一页</div>
                            ${button}
                            <div class="table-magnass-body-button click-on" ${$('#admin-index-user').text() / TableLimit == 1 ? 'id="table-magnass-body-button-no"' : ''} data="next">下一页</div>
                        </div>`
                    }
                }
            })
            // 翻页控件翻页动作
            $('.table-magnass-body div').unbind()
            $('.table-magnass-body div').click(function() {
                const Tablimit = TableLimit
                const data = $(this).attr('data')
                const value = $(this).attr('value')
                const id = $(this).attr('id')
                const i = $('.table-magnass-body').attr('data') - ''
                const tableValue = (k)=>{
                    const max = $('.table-magnass-body').attr('max')
                    const dom = $('.table-magnass-body div')
                    for(let l of dom){
                        if ($(l).attr('data') != 'previous' && $(l).attr('data') != 'next') {
                            const q = $(l).attr('value')
                            if(q == k){
                                $(l).attr('id', 'table-magnass-body-button-on')
                            }else{
                                $(l).attr('id', '')
                            }
                        }else{
                            if(k == 1 && $(l).attr('data') == 'previous'){
                                $(l).attr('id', 'table-magnass-body-button-no')
                            }else 
                            if(k == max && $(l).attr('data') == 'next'){
                                $(l).attr('id', 'table-magnass-body-button-no')
                            }else{
                                $(l).attr('id', '')
                            }
                        }
                    }
                }
                if(data != undefined && data != ''){
                    if(data == 'previous'){
                        if (id != 'table-magnass-body-button-no') {
                            const j = i - 1
                            socket.emits('User', {magess: {skip: j * Tablimit,limit: Tablimit}})
                            $('.table-magnass-body').attr('data', j)
                            $(this).attr('id', '')
                            tableValue(j + 1)
                        }
                    }else 
                    if(data == 'next'){
                        if(id != 'table-magnass-body-button-no'){
                            const j = i + 1
                            socket.emits('User', {magess: {skip: j * Tablimit,limit: Tablimit}})
                            $('.table-magnass-body').attr('data', j)
                            tableValue(j + 1)
                        }
                    }
                }else 
                if(value != undefined && value != ''){
                    tableValue(value - '')
                    const j = value - '' - 1
                    socket.emits('User', {magess: {skip: j * Tablimit,limit: Tablimit}})
                    $('.table-magnass-body').attr('data', j)
                }
            })
        }
        // 更改显示数
        $('#table-view-sum').change(function() {
            TabLimit()
            setTableLimit()
            socket.emits('User', {magess: {skip: 0,limit: TableLimit}})
        })
        setTableLimit()
        // 写入用户信息表单
        const userdatainnerHTML = (data)=>{
            let a = new String()
            let b = new String()
            for (let j = 0; j < data.permissions.length; j++) {
                let id = Index.WebCode(data.permissions[j])
                let ys = Index.WebStyle(id)
                let down = data.Parameter != undefined && data.Parameter[data.permissions[j]] != undefined ? data.Parameter[data.permissions[j]] : 0
                a += '<span style="color:' + ys + ';padding-right: 1em;">' + id + '</span>'
                b += '<span style="color:' + ys + ';padding-right: 1em;">' + down + '</span>'
                if (j == data.permissions.length - 1) {
                    document.getElementById('zsygyhsjxr').innerHTML += `
                    <div class="table-ul table-ul-li" id="user-data-name-${data.id}"  ${Index.TypeTime(data.time) == false ? 'style="background-color: #F00222;color:#fff;"' : ''}>
                        <div class="table-li li-1"><input type="checkbox" class="click-on checkbox-li" data="${data.id}"></div>
                        <div class="table-li li-3">
                            <span>${data.id}</span>
                        </div>
                        <div class="table-li li-3">
                            <span>${data.key}</span>
                        </div>
                        <div class="table-li li-3">
                            <span>${data.time}</span>
                        </div>
                        <div class="table-li li-2">
                            <span>${Index.TypeTime(data.time) == true ? '有效' : '过期'}</span>
                        </div>
                        <div class="table-li li-4">${a}</div>
                        <div class="table-li li-3">
                            <span>${data.RegisTime ? data.RegisTime : 'false'}</span>
                        </div>
                        <div class="table-li li-3">
                            <span>${data.LoginIP != undefined ? data.LoginIP.split(':')[3] : 'false'}</span>
                        </div>
                        <div class="table-li li-4">${b}</div>
                        <div class="table-li li-3">
                            <span style="color:${Index.TypeTime(data.time) == false ? '#fff;' : '#00B150;'}text-indent: 0;" data="${data.id}" class="admin-user-edit">
                                <i class="fa fa-search-plus click-on"></i>
                            </span>
                            <span style="color: ${Index.TypeTime(data.time) == false ? '#fff;' : '#F44336;'}" data="${data.id}" class="admin-user-delete">
                                <i class="fa fa-trash click-on"></i>
                            </span>
                        </div>
                    </div>`
                }
            }
        }
        // 点击弹出用户详细资料
        const PopupUserData = ()=>{
            $('#zsygyhsjxr .admin-user-edit').unbind()
            $('#zsygyhsjxr .admin-user-edit').click(function(){
                const name = $(this).attr('data')
                let userdataJson = JSON.parse(sessionStorage['user-' + name])
                // 弹出详情节点
                const UserData = (data)=>{
                    return `
                    <div class="tab-data" id="PopupUserData-data-${name}">
                        <div class="tab-data-name">
                            <p>${name}</p>
                            <div class="tab-data-edit">
                                <button style="background-color: #F44336;margin-right: 1em;" class="PopupUserData-on" data="${name}">确定</button>
                                <button style="background-color: #2196F3;" class="PopupUserData-off" data="${name}">取消</button>
                            </div>
                        </div>
                        <div class="damin-home-border"></div>
                        <div class="tab-data-body">
                            <div class="tab-data-ul"><span>密码:<input placeholder="${data.key}" id="table-user-key-${name}"></span></div>
                            <div class="tab-data-ul">
                                <span>有效期:
                                    <input class="li-4" placeholder="${data.time.split('-')[0]}" id="table-user-time-n-${name}"> -
                                    <input class="li-3" placeholder="${data.time.split('-')[1]}" id="table-user-time-y-${name}"> -
                                    <input class="li-3" placeholder="${data.time.split('-')[2]}" id="table-user-time-r-${name}">
                                </span>
                            </div>
                            <div class="tab-data-ul" id="table-user-xzxk-${name}">
                                <span>下载许可:
                                    <input style="margin-left:0;" type="checkbox" ${Index.ClikPerm(data.permissions, '588ku') == true ? 'checked="checked"' : ''} value="588ku">千库
                                    <input style="margin-left:0;" type="checkbox" ${Index.ClikPerm(data.permissions, '90sheji') == true ? 'checked="checked"' : ''} value="90sheji">90设计
                                    <input style="margin-left:0;" type="checkbox" ${Index.ClikPerm(data.permissions, '888pic') == true ? 'checked="checked"' : ''} value="888pic">包图
                                    <input style="margin-left:0;" type="checkbox" ${Index.ClikPerm(data.permissions, '58pic') == true ? 'checked="checked"' : ''} value="58pic">千图
                                </span>
                            </div>
                            <div class="tab-data-ul" id="table-user-xzs-${name}">
                                <span>下载数:
                                    ${typeof data.Parameter['588ku'] != 'undefined' ? `<input class="li-3" style="color: #2196F3;" placeholder="${data.Parameter['588ku']}" data="588ku">` : ''}
                                    ${typeof data.Parameter['90sheji'] != 'undefined' ? `<input class="li-3" style="color: #F44336;" placeholder="${data.Parameter['90sheji']}" data="90sheji">` : ''}
                                    ${typeof data.Parameter['888pic'] != 'undefined' ? `<input class="li-3" style="color: #00B150;" placeholder="${data.Parameter['888pic']}" data="888pic">` : ''}
                                    ${typeof data.Parameter['58pic'] != 'undefined' ? `<input class="li-3" style="color: #F00222;" placeholder="${data.Parameter['58pic']}" data="58pic">` : ''}
                                </span>
                            </div>
                            <div class="tab-data-ul" id="table-user-xzsxz-${name}">
                                <span>下载数限制:
                                    ${typeof data.Limit['588ku'] != 'undefined' ? `<input class="li-3" style="color: #2196F3;" placeholder="${data.Limit['588ku']}" data="588ku">` : ''}
                                    ${typeof data.Limit['90sheji'] != 'undefined' ? `<input class="li-3" style="color: #F44336;" placeholder="${data.Limit['90sheji']}" data="90sheji">` : ''}
                                    ${typeof data.Limit['888pic'] != 'undefined' ? `<input class="li-3" style="color: #00B150;" placeholder="${data.Limit['888pic']}" data="888pic">` : ''}
                                    ${typeof data.Limit['58pic'] != 'undefined' ? `<input class="li-3" style="color: #F00222;" placeholder="${data.Limit['58pic']}" data="58pic">` : ''}
                                </span>
                            </div>
                        </div>
                    </div>`
                }
                // 没有打开  打开
                if($(`#PopupUserData-data-${name}`).attr('id') == undefined){
                    $(UserData(userdataJson)).insertAfter(`#zsygyhsjxr #user-data-name-${name}`)
                    setTimeout(()=>$(`#PopupUserData-data-${name}`).addClass('tab-data-on'), 300)
                    // 确定
                    // 修改用户信息
                    $('.PopupUserData-on').unbind()
                    $('.PopupUserData-off').unbind()
                    $('.PopupUserData-on').click(function() {
                        const data = $(this).attr('data')
                        let userdataJson = JSON.parse(sessionStorage['user-' + data])
                        let index = `#PopupUserData-data-${data}`
                        let permissions = []
                        let key = $(`${index} #table-user-key-${data}`).val()
                        let time = `${$(`${index} #table-user-time-n-${data}`).val()}-${$(`${index} #table-user-time-y-${data}`).val()}-${$(`${index} #table-user-time-r-${data}`).val()}`
                        userdataJson.key = key != '' ? key : userdataJson.key
                        userdataJson.time = time != '--' ? time : userdataJson.time
                        const xzxk = $(`${index} #table-user-xzxk-${data}`)
                        for(let j of $(xzxk).find('input')){
                            if($(j)[0].checked == true){
                                permissions.push($(j).attr('value'))
                            }
                        }
                        userdataJson.permissions = permissions
                        let Parameter = new Object
                        Parameter.permissions = permissions
                        const xzs = $(`${index} #table-user-xzs-${data}`)
                        for (let j of $(xzs).find('input')) {
                            let id = $(j).attr('data')
                            let sum = $(j).val()
                            if (id != '') {
                                Parameter[id] = sum != '' ? sum - '' : userdataJson.Parameter[id]
                            }
                        }
                        Parameter.permissions = permissions
                        userdataJson.Parameter = Parameter
                        delete userdataJson._id
                        socket.emits('UserEdit', {magess: userdataJson})
                        socket.on('useredit-callback', (cdata)=>{
                            if(cdata.magess == false){
                                Index.Notification.To(`修改 ${data} 用户信息`, 'info', '修改失败')
                            } else {
                                Index.Notification.To(`修改 ${cdata.magess} 用户信息`, 'info', `${cdata.magess} 用户信息修改成功`)
                            }
                        })
                    })
                    // 取消
                    $('.PopupUserData-off').click(() => {
                        $(`#PopupUserData-data-${name}`).removeClass('tab-data-on')
                        setTimeout(()=>$(`#PopupUserData-data-${name}`).remove(), 1000)
                    })
                }
            })
        }
        // 接收用户信息
        socket.on('user-callback', (data)=>{
            if(data.magess == false){
                Index.Notification.To('搜索结果', 'info', '没有找到结果')
            }else{
                // 先清空
                document.getElementById('zsygyhsjxr').innerHTML = ''
                // 遍历写入
                for(let i = 0; i < data.magess.length; i++){
                    const user = data.magess[i]
                    // 存入本地存储
                    sessionStorage['user-' + user.id] = JSON.stringify(user)
                    if($(`#user-data-name-${user.id}`).attr('id') == undefined){
                        userdatainnerHTML(user)
                        // 绑定节点
                        if(i == data.magess.length - 1){
                            // 清空绑定
                            $('#zsygyhsjxr .table-ul').unbind()
                            // 写入弹出控件
                            PopupUserData()
                            // 删除单个
                            $('.admin-user-delete').unbind()
                            $('.admin-user-delete').click(function() {
                                const userid = $(this).attr('data')
                                PopupWindow.To(`删除账号 ${userid} ?`, (type)=>{
                                    if(type == true){
                                        socket.emits('DeleteUser', {magess: userid})
                                        socket.on('deluser-callback', (data)=>{
                                            if(data.magess == false){
                                                Index.Notification.To('删除失败', 'error', '账号删除失败')
                                            }else{
                                                $(`#user-data-name-${data.magess}`).remove()
                                                PopupWindow.Exit()
                                            }
                                        })
                                    }
                                })
                            })
                        }
                    }
                }
            }
        })
        // 搜索
        $('#admin-user-seacr').unbind()
        $('#admin-user-seacr').click(function() {
            const value = $('.admin-user-head-tj')[0].value
            if(value == '已过期'){
                socket.emits('GetUser', {magess: {"time": false}})
            }else{
                const val = $('#admin-user-seacr-text').val()
                if(val != ''){
                    if(value == '用户名'){
                        socket.emits('GetUser', {magess: {"id": val}})
                    }else 
                    if(value == '创建时间'){
                        socket.emits('GetUser', {magess: {"RegisTime": val}})
                    }
                }
            }
        })
        // 批量新建
        $('#installUserPush').unbind()
        $('#installUserPush').click(function(){
            PopupWindow.NewUserPush( (data) => {
                PopupWindow.Exit()
                $('.install-user-list').addClass('install-user-list-on')
                $('#install-user-body-exit').click(function(){
                    $('.install-user-list').removeClass('install-user-list-on')
                    document.getElementById('install-user-body-list').innerHTML = ''
                })
                const time = data.time
                const sum = data.sum
                const permissions = data.permissions
                const RegisTime = data.RegisTime
                const Limit = data.Limit
                const dictionary = [1,2,3,4,5,6,7,8,9,0,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
                let user = 0
                const install = () => {
                    if(user < sum){
                        let _id = ''
                        for(let k = 0; k < 12; k ++){
                            _id += dictionary[Math.round(Math.random()*35)]
                            if(k == 11){
                                socket.emits('NewUser', {magess: {
                                    id:_id,
                                    key:'123456',
                                    permissions:permissions,
                                    time:time,
                                    RegisTime:RegisTime,
                                    Limit:Limit
                                }})
                                socket.on('instuser-callback', function(data) {
                                    if(data.magess == true){
                                        user = user + 1
                                        if(document.getElementById(`installuserpush-${_id}`) == null){
                                            document.getElementById('install-user-body-list').innerHTML += `<p id="installuserpush-${_id}"><span>${_id} </span><span> 123456</span></p>`
                                        }
                                    }
                                    install()
                                })
                            }
                        }
                    }
                }
                install()
            })
        })
        // 新建用户
        $('#installUser').unbind()
        $('#installUser').click(function() {
            PopupWindow.NewUser((data)=>{
                socket.emits('NewUser', {magess: data})
                socket.on('instuser-callback', function(data) {
                    if(data.magess == true){
                        PopupWindow.Exit()
                        userdatainnerHTML(data)
                    }else{
                        Index.Notification.To('新建失败', 'error', '账号新建失败')
                    }
                })
            })
        })
        // 删除多选
        $('#deleteUser').unbind()
        $('#deleteUser').click(()=>{
            const checkboxArr = $('#zsygyhsjxr .checkbox-li')
            let userArr = []
            for (let i = 0; i < checkboxArr.length; i++) {
                const id = checkboxArr[i]
                if ($(id)[0].checked == true) {
                    const userid = $(id).attr('data')
                    userArr.push(userid)
                }
                if (i == checkboxArr.length - 1 && userArr.length != 0){
                    PopupWindow.To(`删除 ${userArr.length} 个账号 ?`, (type)=>{
                        if (type == true) {
                            for(let j of userArr){
                                socket.emits('DeleteUser', {magess: j})
                                socket.on('deluser-callback', (data)=>{
                                    if(data.magess == false){
                                        Index.Notification.To('删除失败', 'error', '账号删除失败')
                                    }else{
                                        $(`#user-data-name-${j}`).remove()
                                    }
                                    PopupWindow.Exit()
                                })
                            }
                        }
                    })
                }
            }
        })
        // 选择全部
        $('#admin-user-checkbox').unbind()
        $('#admin-user-checkbox').click(function() {
            const checkbox = document.getElementById('admin-user-checkbox').checked
            const checkboxArr = $('#zsygyhsjxr .checkbox-li')
            if(checkbox == true){
                for(let i of checkboxArr){
                    $(i)[0].checked = true
                }
            }else 
            if(checkbox == false){
                for(let i of checkboxArr){
                    $(i)[0].checked = false
                }
            }
        })
        // 发送第一页
        socket.emits('User', {magess: {skip: 0,limit: TableLimit}})
    }

    
    // cookie管理
    Admin['admin-cookie'] = (socket)=>{
        let cookieType = Index.WebName($('.admin-cookie-head-tj')[0].value)
        let CookieData = new Object
        // 正在使用的下标
        const CookieIndexOf = (name) => {
            for(let i of CookieData){
                if(i.id == name){
                    return i.cookienNo
                }
            }
        }
        // 删除单选
        const delCookie = () => {
            $('#zscookiebflb .admin-cookie-delete').unbind()
            $('#zscookiebflb .admin-cookie-delete').click(function(){
                const id = $(this).attr('data') - ''
                PopupWindow.To(`删除第 ${id} 个 ${$('.admin-cookie-head-tj')[0].value} cookie ?`, (type)=>{
                    if(type == true){
                        socket.emits('DelCookie', {magess:{"id":id, "name":cookieType}})
                        socket.emits('GetCookieDate')
                        socket.emits('GetCookie', {magess: cookieType})
                        PopupWindow.Exit()
                    }
                })
            })
            // 设置为使用
            $('#zscookiebflb .admin-cookie-set').unbind()
            $('#zscookiebflb .admin-cookie-set').click(function(){
                const id = $(this).attr('data') - ''
                PopupWindow.To(`设置第 ${id} 个为 ${$('.admin-cookie-head-tj')[0].value} cookie ?`, (type)=>{
                    if(type == true){
                        socket.emits('SetCookie', {magess:{"id":cookieType, "cookienNo":id}})
                        socket.on('SetCookie-callback', (data) => {
                            if(data.magess == true){
                                socket.emits('GetCookieDate')
                                socket.emits('GetCookie', {magess: cookieType})
                                PopupWindow.Exit()
                            }else{
                                Index.Notification.To('设置cookie失败', 'error', `设置第${id}个为${$('.admin-cookie-head-tj')[0].value}cookie失败`)
                            }
                        })
                    }
                })
            })
            // 更改cookie信息
            $('#zscookiebflb .admin-cookie-edit').unbind()
            $('#zscookiebflb .admin-cookie-edit').click(function(){
                const id = $(this).attr('data') - ''
                const cookie = $(`#table-cookie-name-${id} .admin-cookie-data`).val()
                if(cookie.length != 0){
                    PopupWindow.To(`确定修改第 ${id} 个 ${cookieType} 的cookie ?`, (type)=>{
                        if(type == true){
                            socket.emits('SetCookieData', {magess:{id:id,data:cookie,type:cookieType}})
                            socket.on('SetCookieData-callback', (data) => {
                                if(data.magess == true){
                                    socket.emits('GetCookieDate')
                                    socket.emits('GetCookie', {magess: cookieType})
                                    PopupWindow.Exit()
                                }else{
                                    Index.Notification.To('修改cookie失败', 'error', `修改第 ${id} 个 ${cookieType} cookie失败`)
                                }
                            })
                        }
                    }) 
                }else{
                    Index.Notification.To('修改cookie失败', 'error', `请输入正确信息！！！不接受空输入！！！`)
                }
            })
        }
        // 写入cookie信息
        const SetCookie = (data)=>{
            document.getElementById('zscookiebflb').innerHTML += `
            <div class="table-ul" id="table-cookie-name-${data.id}">
                <div class="table-li li-1">
                    <input type="checkbox" class="click-on checkbox-li" data="${data.id}">
                </div>
                <div class="table-li li-2">
                    <span>${Index.WebCode(data.obj)}</span>
                </div>
                <div class="table-li li-2">
                    <span>${data.id}</span>
                </div>
                <div class="table-li li-7">
                    <input class="admin-cookie-data" value="${data.data}">
                </div>
                <div class="table-li li-3">
                    <span style="color:#00B150;text-indent: 0;" data="${data.id}" class="admin-cookie-edit">
                        <i class="fa fa-edit click-on"></i>
                    </span>
                    <span style="color: #F44336;" data="${data.id}" class="admin-cookie-delete">
                        <i class="fa fa-trash click-on"></i>
                    </span>
                    <span style="color: #F44336;" data="${data.id}" class="admin-cookie-set">
                        <i class="fa fa-check click-on"></i>
                    </span>
                </div>
                <div class="table-li li-2">
                    <span>${CookieIndexOf(data.obj) == data.id ? '使用中' : '闲置'}<span>
                </div>
            </div>`
        }
        // 添加cookie
        $('#installCookie').unbind()
        $('#installCookie').click(function(){
            PopupWindow.NewCookie((data) => {
                const name = Index.WebName(data.name)
                const cookie = data.data
                socket.emits('NewCookie', {magess:{id:name, cookie:cookie}})
                socket.on('inst-cookie-callback', (msg) => {
                    if(msg.magess == true){
                        socket.emits('GetCookieDate')
                        socket.emits('GetCookie', {magess: cookieType})
                        PopupWindow.Exit()
                    }else
                    if(msg.magess == false){
                        Index.Notification.To('新建cookie失败', 'error', `新建${data.name}cookie失败`)
                    }
                })
            })
        })
        // 请求cookie数据和详情
        socket.emits('GetCookieDate')
        socket.emits('GetCookie', {magess: cookieType})
        // 接收到cookie基本数据
        socket.on('cookie-callback', function(data) {
            CookieData = data.magess
            sessionStorage.CookieData = JSON.stringify(data.magess)
        })
        // 更改显示类型
        $('.admin-cookie-head-tj').change(function() {
            cookieType = Index.WebName($('.admin-cookie-head-tj')[0].value)
            socket.emits('GetCookie', {magess: cookieType})
        })
        // 接收到cookie详细数据
        socket.on('cookiearray-callback', function(data) {
            document.getElementById('zscookiebflb').innerHTML = ''
            for(let i = 0; i < data.magess.length; i ++){
                SetCookie(data.magess[i])
                if(i == data.magess.length-1){
                    delCookie()
                }
            }
        })
        // 选择全部
        $('#admin-cookie-checkbox').unbind()
        $('#admin-cookie-checkbox').click(function() {
            const checkbox = document.getElementById('admin-cookie-checkbox').checked
            const checkboxArr = $('#zscookiebflb .checkbox-li')
            if(checkbox == true){
                for(let i of checkboxArr){
                    $(i)[0].checked = true
                }
            }else 
            if(checkbox == false){
                for(let i of checkboxArr){
                    $(i)[0].checked = false
                }
            }
        })
        // 删除多选cookie
        $('#deleteCookie').unbind()
        $('#deleteCookie').click(function(){
            let oncookie = []
            const checkboxArr = $('#zscookiebflb .checkbox-li')
            for(let i = 0; i < checkboxArr.length; i ++){
                const cookie = checkboxArr[i]
                if($(cookie)[0].checked == true){
                    oncookie.push($(cookie).attr('data') - '')
                }
                if(i == checkboxArr.length - 1 && oncookie.length != 0){
                    PopupWindow.To(`删除 ${oncookie.length} 个 cookie ?`, (type)=>{
                        if(type == true){
                            for(let j = 0, k = true; j < oncookie.length; j ++){
                                socket.emits('DelCookie', {magess:{"id":oncookie[j], "name":cookieType}})
                                if(j == oncookie.length - 1){
                                    socket.emits('GetCookie', {magess: cookieType})
                                    PopupWindow.Exit()
                                }
                            }
                        }
                    })
                }
            }
        })
    }

    // 页面加载完成
    $().ready(()=>{
        // 设置通知默认值
        Index.Notification.Module({
            icon:'/img/favicon.ico',
            error:'/img/favicon.ico'
        })
        socket.emits = (Event,data)=>{
            socket.emit('MagesEvent', {_id_: socket.id,event: Event,data: data})
        }
        $($('.admin-head-title-logo')[1]).hide()
        $($('.admin-head-title-logo')[2]).hide()
        socket.on('System', (data) => Index.Notification.To('服务器错误！！！', 'icon', data.error))
        //socket.on('reconnect', ()=> document.location.reload(true))
        $('.admin-head-menu').unbind()
        $('.admin-head-menu').click(()=>{
			const ClassArray = ['admin-home', 'admin-user', 'admin-cookie']
            const index = $('.admin-head-menu-body')
            if ($(index).attr('on') == 'true') {
                $(index).removeClass('admin-head-menu-body-on')
                $(index).attr('on', 'false')
            } else {
                $(index).addClass('admin-head-menu-body-on')
                $(index).attr('on', 'true')
                $('.admin-head-menu-body span').unbind()
                $('.admin-head-menu-body span').click(function() {
                    const style = $(this).attr('data')
                    const title = $('.admin-head-title-logo')
                    Admin[style] && Admin[style](socket)
                    for(let i of ClassArray){
                        if(i == style){
                            $('.' + i).attr('id', 'damin-on')
                        }else{
                            $('.' + i).attr('id', '')
                        }
                    }
                    for(let i of title){
                        if($(i).attr('data') == style){
                            $(i).show()
                        }else{
                            $(i).hide()
                        }
                    }
                })
            }
        })
        Admin['admin-home'](socket)
    })

}
