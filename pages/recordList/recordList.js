const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    // 查看更多数据
    more (e) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        
        let page = e.currenTarget.dataset.page + 1;
        this.commissionRecord(page, this.data.asset_type)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let type = options.type,
            num = options.num;

        let asset_type;

        if (type === 'commission') {
            asset_type = 2;
        } else if (type === 'reward') {
            asset_type = 3;
        }

        this.setData({
            type,
            num,
            asset_type: 3
        })

        this.commissionRecord(1, asset_type)

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

    commissionRecord(page, asset_type) {

        api.commissionRecord({
            data: {
                page,
                asset_type
            }
        }).then((res) => {
            console.log('佣金记录', res)
            let list = res.data;

            let fullLoad = false
            if (res.current_page * res.perPage >= res.total) {
                // 加载完毕
                fullLoad = true;
            }

            this.setData({
                list,
                fullLoad,
                nowPage: page
            })

        }).catch((res) => {

        }).finally ( () => {
            wx.hideLoading()
        }) 

    }

})