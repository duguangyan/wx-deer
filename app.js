const api = require('./utils/api.js');
let onfire = require('./utils/onfire.js');
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录

        // 是否有openid

        let openid = wx.getStorageSync('openid');

        if (!openid) {
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    console.log(res.code)

                    if (res.code) {
                        api.getOpenid({
                            data: {
                                code: res.code,
                                from: '4'
                            }
                        }).then((res) => {
                            console.log('openid信息 == ', res)
                            wx.setStorage({
                                key: 'openid',
                                data: res.data.openid,
                            })
                        })
                    }
                }
            })

        }

        // 获取用户信息
        const access_token = wx.getStorageSync('access_token');

        if (!!access_token) {

            api.getUserInfo(

            ).then((res) => {
                console.log('用户信息', res);
                this.globalData.userInfo = res.data;
            }).catch((res) => {
                console.log('用户信息', res)
            })

        }

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

        if (!this.globalData.userInfo){
            return
        }
        api.saveformid({
            data:{
                form_id,
                from: '4'
            },
            method: 'POST'
        }).then( (res) => {
            
        }).catch((err)=>{

        })
    },
    globalData: {
        userInfo: null
    }
})