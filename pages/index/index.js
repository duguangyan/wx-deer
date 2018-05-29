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

    //   找料单页
    goFindPage() {

        onfire.on('getInfo', function (data) {

            let pages = getCurrentPages()[0];

            let params = {
                task_type: 1,
                type: 0,
                page: 1
            }

            pages.setData({
                params
            })
         
            pages.getMyOrderList(params)

        })

        wx.switchTab({
            url: '../order/order',
        })

    },

    // 配送单页面
    goSendPage() {

        onfire.on('getInfo', function (data) {

            let pages = getCurrentPages()[0];

            let params = {
                task_type: 2,
                type: 0,
                page: 1
            }

            pages.setData({
                params
            })

            pages.getMyOrderList(params)

        })

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
        //   更新数据
        api.homeData().then((res) => {

            console.log('首页统计数据', res)
            let homeData = res.data;

            this.setData({
                homeData
            })

        }).catch((res) => {

            console.log('首页统计数据', res)

        })
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
