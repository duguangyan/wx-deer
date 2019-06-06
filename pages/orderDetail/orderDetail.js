const api = require('../../utils/api.js');
let onfire = require('../../utils/onfire.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
      orderItem:'',
      index:1
    },

    // 预览图片
    preview(e) {
      let idx = e.currentTarget.dataset.idx;

      let imgs = this.data.detailData.front_img;

        wx.previewImage({
            current: imgs[idx],
            urls: imgs
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let status = options.status;
      let id = options.id;
      let index = options.index;
      
      this.setData({
        index
      })
      if(index == 1){
        api.findShowDetail({
          data: { id }
        }).then((res) => {
          if (status == 1){
            var pages = getCurrentPages();
            var Page = pages[pages.length - 1];//当前页
            var prevPage = pages[pages.length - 2];  //上一个页面
            var info = prevPage.data //取上页data里的数据也可以修改
            info.orderList.forEach((o, i) => {
              if (o.id == id) {
                info.orderList.splice(i, 1);
              }
            })
            prevPage.setData({ 'orderList': info.orderList })//设置数据
          }
          this.setData({
            detailData: res.data
          })
        })
      }else if(index == 2){
        api.fetchShowDetail({
          data: { id }
        }).then((res) => {
          if (status == 2) {
            var pages = getCurrentPages();
            var Page = pages[pages.length - 1];//当前页
            var prevPage = pages[pages.length - 2];  //上一个页面
            var info = prevPage.data //取上页data里的数据也可以修改
            info.orderList.forEach((o, i) => {
              if (o.id == id) {
                info.orderList.splice(i, 1);
              }
            })
            prevPage.setData({ 'orderList': info.orderList })//设置数据
          }

          
          this.setData({
            detailData: res.data
          })
        })
      }else if(index ==3){
        api.shipShowDetail({
          data: { id }
        }).then((res) => {
          if (status == 2) {
            var pages = getCurrentPages();
            var Page = pages[pages.length - 1];//当前页
            var prevPage = pages[pages.length - 2];  //上一个页面
            var info = prevPage.data //取上页data里的数据也可以修改
            info.orderList.forEach((o, i) => {
              if (o.id == id) {
                info.orderList.splice(i, 1);
              }
            })
            prevPage.setData({ 'orderList': info.orderList })//设置数据
          }


          this.setData({
            detailData: res.data
          })
        })
      }
      
     
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