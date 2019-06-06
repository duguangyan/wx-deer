const app = getApp();

let api = require('../../utils/api.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        formid: []
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
      wx.clearStorageSync();
      wx.navigateTo({
        url: '../login/login'　　
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
      
      // 获取用户信息
      api.getUserInfo().then((res) => {
          console.log('用户信息', res);
          app.globalData.userInfo = res.data;
          this.setData({
              v,
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