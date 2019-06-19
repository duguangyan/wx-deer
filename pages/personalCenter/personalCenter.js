const app = getApp();

let api = require('../../utils/api.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        formid: []
    },
    switchTab(){
      // wx.setStorageSync('statusT', 1);

      // wx.switchTab({
      //   url: '../rewardTask/rewardTask',
      // })

      wx.showModal({
        title: '提示',
        content: '确认联系平台客服吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.makePhoneCall({
              phoneNumber: '400-8088-156'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      

    },
    saveformid(e) {
        // 增加formid
        let formId = e.detail.formId;
        app.saveformid(formId);
    },
    formSubmit(e) {
        console.log(e.detail.formId);
        let formid = this.data.formid;
        formid.push(e.detail.formId);

        this.setData({
            formid
        })
    },
    // 复制订单
    copy(e) {

        let data = e.currentTarget.dataset.formid;

        wx.setClipboardData({
            data,
            success: function (res) {
                wx.hideToast();

                wx.showToast({
                    title: '复制成功',
                })
   
            }
        })

    },
    goout(){

      wx.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        showCancel: true,//是否显示取消按钮
        // cancelText: "否",//默认是“取消”
        // cancelColor: 'skyblue',//取消文字的颜色
        // confirmText: "是",//默认是“确定”
        // confirmColor: 'skyblue',//确定文字的颜色
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            //点击确定
            wx.clearStorageSync();
            wx.navigateTo({
              url: '../login/login'
            })
          }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      })
      

      
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    
      // 版本号
      let v = wx.getStorageSync('v');
      this.setData({
        v
      })
      // 获取用户信息
      api.getUserInfo().then((res) => {
          console.log('用户信息', res);
          app.globalData.userInfo = res.data;
          this.setData({
              userInfo: res.data
          })

      }).catch((res) => {
          console.log('用户信息err', res)
      }).finally(() => {

      })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})