const api = require('./utils/api.js');
let onfire = require('./utils/onfire.js');
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
        this.initSocket()
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
        userInfo: null,
        localSocket: {},
        callback: function() {}
    },
    initSocket() {
      let that = this
      let userId = wx.getStorageSync('userId')
      console.log('app用户id',userId)
      that.globalData.localSocket = wx.connectSocket({
        url: 'ws://192.168.11.113:9099/notice/socket?userId=' + userId +'&openType=1&sms=1',
      })

      that.globalData.localSocket.onOpen(function(res) {
        console.log('WebSocket连接已打开！readyState=' + that.globalData.localSocket.readyState)
      })

      that.globalData.localSocket.onError(function (res) {
        console.log('readyState=' + that.globalData.localSocket.readyState)
      })

      that.globalData.localSocket.onClose(function (res) {
        console.log('WebSocket连接已关闭！readyState=' + that.globalData.localSocket.readyState)
        if (that.data.initSocket <= 2) {
          that.initSocket()
          that.data.initSocket++
        } else {
          console.log('连接次数超出限制')
        }
      })
      
      that.globalData.localSocket.onMessage(function (res) {
        // 用于在其他页面监听 websocket 返回的消息
        that.globalData.callback(res)
      })
    },
    sendSocketMessage: function(res) {
      let that = this
      return new Promise((resolve, reject) => {
        if (that.globalData.localSocket.readyState == 1) {
          console.log('发送消息', res)
          that.globalData.localSocket.send({
            data: res,
            success: function(res) {
              resolve(res)
            },
            fail: function(e) {
              reject(e)
            }
          })
        } else {
          console.log('连接已断开')
        }
      })
    }
})