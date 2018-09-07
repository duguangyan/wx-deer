const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    // 预览图片
    preview(e) {
        let index = e.currentTarget.dataset.index;
        let imgs = this.data.data.examples;

        wx.previewImage({
            current: imgs[index], // 当前显示图片的http链接
            urls: imgs // 需要预览的图片http链接列表
        })

    },
    // 提交图片预览
    preview2 (e) {
        let index = e.currentTarget.dataset.index;
        let imgs = this.data.data.imgs;
        wx.previewImage({
            current: imgs[index], // 当前显示图片的http链接
            urls: imgs // 需要预览的图片http链接列表
        })
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
         // this.rewardTaskDetail(this.data.id, 'accepted')
          
          this.rewardTaskDetailUnanswered(res.data.task_id);
          
            // // 删除上一页数据
            // try {
            //     let pages = getCurrentPages(),
            //         prevPage = pages[pages.length - 2];

            //     let rewardList = prevPage.data.rewardList;

            //      rewardList.splice(this.data.index, 1);
               
            //     prevPage.setData({
            //         rewardList
            //     })
            // }catch (err) {
            //     console.log(err)
            // }


        }).catch((res) => {
                util.errorTips(res.msg);
            })
    },
  rewardTaskDetailUnanswered(id){
    // 未接悬赏
    api.rewardTaskDetailUnanswered({
      query: {
        id
      }
    }).then((res) => { 
      console.log(res); 
      this.setData({
        data:res.data
      })

      if (res.data.user_has_times ==0){
        let pages = getCurrentPages(),
          prevPage = pages[pages.length - 2];

        let rewardList = prevPage.data.rewardList;

        rewardList.splice(this.data.index, 1);

        prevPage.setData({
          rewardList
        })
      }


    }).catch((res) => {
      console.log(res)

    })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let id = options.id,
            type = options.type,
            index = options.index;

        console.log(id, type)

        this.setData({
            id,
            type,
            index
        })

        if (type === 'accepted') {

            // 已接悬赏
            this.rewardTaskDetail(id, type)

        } else if (type === 'acceptable') {
            // 未接悬赏
            api.rewardTaskDetailUnanswered({
                query: {
                    id
                }
            }).then((res) => {
                console.log(res);

                // 查看
                let taskseen = wx.getStorageSync('taskseen') || [];

                let id_num = parseInt(id);

                if (!taskseen.includes(id_num)) {
                    taskseen.push(id_num)
                    wx.setStorageSync('taskseen', taskseen);

                    // 更新上页数据
                    let pages = getCurrentPages(),
                        prevPage = pages[pages.length - 2];

                     prevPage.data.rewardList[index].is_new = false;

                     prevPage.setData({
                         rewardList: prevPage.data.rewardList
                     })
                }

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
    rewardTaskDetail(id, type) {

        console.log('===========', id, type)

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