
let onfire = require('./utils/onfire.js');
const api = require('./utils/api.js');
const util = require('./utils/util.js');
App({
    data: {
      initSocket: 0
    },
    onLaunch: function () {

        // 版本更新
        if (wx.getUpdateManager) {

            const updateManager = wx.getUpdateManager();
            console.log('updata version', updateManager);

            updateManager.onCheckForUpdate(function (res) {
                // 请求完新版本信息的回调
                console.log(res.hasUpdate)
            })

            updateManager.onUpdateReady(function () {
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                            updateManager.applyUpdate()
                        }
                    }
                })

            })
        }
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录

        // 是否有openid

        // let openid = wx.getStorageSync('openid');

        // if (!openid) {
        //     wx.login({
        //         success: res => {
        //             // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //             console.log(res.code)

        //             if (res.code) {
        //                 api.getOpenid({
        //                     data: {
        //                         code: res.code,
        //                         from: '4'
        //                     }
        //                 }).then((res) => {
        //                     console.log('openid信息 == ', res)
        //                     wx.setStorage({
        //                         key: 'openid',
        //                         data: res.data.openid,
        //                     })
        //                 })
        //             }
        //         }
        //     })

        // }

        

        // 获取用户信息
        // wx.getSetting({
        //   success: res => {
        //     if (res.authSetting['scope.userInfo']) {
        //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //       wx.getUserInfo({
        //         success: res => {
        //           // 可以将 res 发送给后台解码出 unionId
        //           this.globalData.userInfo = res.userInfo

        //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //           // 所以此处加入 callback 以防止这种情况
        //           if (this.userInfoReadyCallback) {
        //             this.userInfoReadyCallback(res)
        //           }
        //         }
        //       })
        //     }
        //   }
        // })
        
    },

    saveformid(form_id) {

        // if (!this.globalData.userInfo){
        //     return
        // }
        // api.saveformid({
        //     data:{
        //         form_id,
        //         from: '4'
        //     },
        //     method: 'POST'
        // }).then( (res) => {
            
        // }).catch((err)=>{

        // })
    },
    globalData: {
        userInfo: null
    }
})