//index.js
//获取应用实例
const app = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

let onfire = require('../../utils/onfire.js');

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    close1 () {
        wx.showToast({
            title: '已读',
        })
    },
  click(){
    wx.navigateToMiniProgram({
      appId: 'wx57bc26c9fbe8dbfb', // 要跳转的小程序的appid
      path: 'pages/index/index', // 跳转的目标页面
      extarData: {
        open: 'auth'
      },
      success(res) {
        // 打开成功  
        console.log('xxx');
      }
    })
    // wx.scanCode({
    //   success: (res) => {
    //     console.log(res)

         
    //   }
    // })

  },
    //   找料单页
    goFindPage(e) {
     
      let index = e.currentTarget.dataset.index;
      if (index == 1){
        wx.setStorageSync('status', 1);
      }
       wx.setStorageSync('nav', 1);
        wx.switchTab({
            url: '../order/order',
        })

    },
    // 配送页面
    switchTab(e){
      let status = e.currentTarget.dataset.status;     
      
      wx.setStorageSync('statusT', status)
      
      wx.switchTab({
        url: '../rewardTask/rewardTask',
      })
    },
    // 订单页面
    goSendPage(e) {
      let index = e.currentTarget.dataset.index;
      if (index == 1) {
        wx.setStorageSync('status', 1);
      }
      wx.setStorageSync('nav', 2);
        wx.switchTab({
            url: '../order/order',
        })

    },
    onLoad: function () {
        
        // if (app.globalData.userInfo) {
        //   this.setData({
        //     userInfo: app.globalData.userInfo,
        //     hasUserInfo: true
        //   })
        // } else if (this.data.canIUse){
        //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //   // 所以此处加入 callback 以防止这种情况
        //   app.userInfoReadyCallback = res => {
        //     this.setData({
        //       userInfo: res.userInfo,
        //       hasUserInfo: true
        //     })
        //   }
        // } else {
        //   // 在没有 open-type=getUserInfo 版本的兼容处理
        //   wx.getUserInfo({
        //     success: res => {
        //       app.globalData.userInfo = res.userInfo
        //       this.setData({
        //         userInfo: res.userInfo,
        //         hasUserInfo: true
        //       })
        //     }
        //   })
        // }
    },

    onShow() {
      let _this = this;
        if (app.globalData.userInfo) {
          this.setData({
            userInfo: app.globalData.userInfo,
          })
        }else{
          // wx.showModal({
          //   title: '提示',
          //   content: '您还没有使用权限，如果您是我们公司的找(送）料员，请前往登录页登录使用系统',
          //   confirmText: '前往',
          //   confirmColor: '#c81a29',
          //   success: (res) => {

          //     if (res.confirm) {
          //       wx.navigateTo({
          //         url: '../login/login',
          //       })
          //     } else if (res.cancel) {
          //       console.log('用户点击取消')
          //     }
          //   }
          // })
        }
        // 触发
        //onfire.fire('updataUserInfo',app);
        //   更新数据

      // 获取用户信息
      const access_token = wx.getStorageSync('access_token');

      if (!!access_token) {

        

      }

      api.getUserInfo(

      ).then((res) => {
        console.log('用户信息', res);

        app.globalData.userInfo = res.data;
        this.setData({
          userInfo: res.data
        })
        api.homeData().then((res) => {

          console.log('首页统计数据', res)
          let homeData = res.data;

          this.setData({
            homeData
          })

        }).catch((res) => {
          if (res.code !== 401) {
            util.errorTips(res.msg)
          }

        }).finally(() => {

        })
      }).catch((res) => {
        console.log('用户信息', res)
      })
    },
    
    /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
    onPullDownRefresh: function () {
       this.onShow();
       setTimeout( () => {
            wx.stopPullDownRefresh();
       },500)
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})
