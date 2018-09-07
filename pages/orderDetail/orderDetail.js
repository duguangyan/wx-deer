const api = require('../../utils/api.js');
let onfire = require('../../utils/onfire.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

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

        let index = options.index,
            id = options.id;
        console.log('订单详情：', options.index, id);

        let pages = getCurrentPages(),
            prevPage = pages[pages.length - 2];

        let detailData = prevPage.data.orderList[index];
        console.log(detailData)

        if (detailData.task_type === 1 && (detailData.find_status === 1 || (detailData.find_status !== 1 && detailData.distribution_status === 1)) || (detailData.task_type === 2 && detailData.distribution_status === 1)) {

            api.receiveOrder({
                method: "POST",
                data: {
                    id
                }
            }).then((res) => {
                console.log(res);
                // 更新成功本页数据

                if (detailData.task_type === 1 && detailData.find_status === 1) {
                    detailData.find_status = 2;
                    detailData.button_status = {
                        red_title: '找料中',
                        status: 1
                    }
                    // 挑去找料中
                    onfire.on('updataOrder', function (data) {

                        let pages = getCurrentPages()[0];

                        let params = pages.data.params;

                        params.task_type = 1;
                        params.type = 1;

                        pages.setData({
                            params
                        })
                        pages.getMyOrderList(params)

                    })

                }
                // 返回201不生效
                else if (detailData.task_type === 1 && (detailData.find_status === 4 && detailData.distribution_status === 1)) {
                    detailData.distribution_status = 2;
                    detailData.button_status = {
                        red_title: '配送中',
                        status: 2
                    }
                    // 跳去配送中
                    onfire.on('updataOrder', function (data) {

                        let pages = getCurrentPages()[0];

                        let params = pages.data.params;

                        params.task_type = 1;
                        params.type = 2;

                        pages.setData({
                            params
                        })
                        pages.getMyOrderList(params)

                    })
                }
                else if (detailData.task_type === 2) {
                    detailData.distribution_status = 2;
                    detailData.button_status = {
                        red_title: '配送中',
                        status: 2
                    }

                    onfire.on('updataOrder', function (data) {
                        console.log(data)
                        let pages = getCurrentPages()[0];

                        let params = pages.data.params;

                        params.task_type = 2;
                        params.type = 2;

                        pages.setData({
                            params
                        })
                        pages.getMyOrderList(params)

                    })
                }

                // prevPage.setData({
                //     orderList: prevPage.data.orderList
                // })

   
            }).catch((res) => {
                console.log(res);
            })

        }

        this.setData({
            detailData
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