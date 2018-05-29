const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  //   接受悬赏任务
  acceptTask(e) {
      let id = e.currentTarget.dataset.id;
    
      console.log(id);

      wx.showLoading({
          title: '处理中',
          mask: true,
      })

      api.acceptTask({
          method: "POST",
          data: {
              task_id: id
          }
      }).then((res) => {
          console.log('领取任务', res);

          util.successTips('接单成功');
         //   更新数据
         let newid = res.data.id;
         this.rewardTaskDetail(newid,'accepted')

      }).catch((res) => {
          util.errorTips(res.message);
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      let id = options.id,
            type = options.type;

      console.log(id,type)

      if (type === 'accepted'){

          // 已接悬赏
          this.rewardTaskDetail(id,type)

      }else if (type === 'acceptable') {
            // 未接悬赏
          api.rewardTaskDetailUnanswered({
              query: {
                  id
              }
          }).then((res) => {
              console.log(res)

              let data = res.data;
              data.type = type;

              data.examples = JSON.parse(data.examples)

              this.setData({
                  data
              })

          }).catch((res) => {
              console.log(res)

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
  
  },
//   获取已接悬赏内容
  rewardTaskDetail (id,type) {

      console.log('===========',id,type)

      api.rewardTaskDetail({
          query: {
              id
          }
      }).then((res) => {
          console.log(res)

          let data = res.data;

            data.type = type;
         
          // 解json
          data.examples = JSON.parse(data.examples)

          this.setData({
              data
          })
      }).catch((res) => {
          console.log(res)
      })
  }
})