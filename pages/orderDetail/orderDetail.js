// pages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  // 预览图片
  preview(e) {
      let idx = e.currentTarget.dataset.idx;

      let imgs = this.data.detailData.imgs;

      wx.previewImage({
          current: imgs[idx], 
          urls: imgs 
      })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      console.log('订单详情：',options.index)
      let index = options.index

      let pages = getCurrentPages(),
          prevPage = pages[pages.length - 2];

      console.log(prevPage.data.orderList[index])

      this.setData({
          detailData: prevPage.data.orderList[index]
      })

  
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