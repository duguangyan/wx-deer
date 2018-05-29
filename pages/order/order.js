const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let onfire = require('../../utils/onfire.js');

Page({

    /**
     * 页面的初始数据
     */
    //   订单类型1找料订单2取料订单
    //   0全部1找料中2配送中3已完成
    data: {
        params: {
            task_type: 1,
            type: 0,
            page: 1
        },

        files: [{}],
        multiIndex: [6, 0, 8]
    },

    // 大类选择
    getOrderData(e) {

        let task_type = e.currentTarget.dataset.task_type;

        this.setData({
            params: {
                task_type,
                type: 0,
            }
        })

        let params = this.data.params;

        this.getMyOrderList(params)
    },
    // 获取下栏目数据
    getOrderTypeData(e) {

        let type = e.currentTarget.dataset.type;

        let params = this.data.params;

        params.type = type;

        this.setData({
            params
        })

        this.getMyOrderList(params)
    },

    // 弹窗

    showForm(e) {

        let formtype = e.currentTarget.dataset.type,
            id = e.currentTarget.dataset.id;
        console.log(formtype)
        this.setData({
            id,
            formtype,
            formshow: true
        })

    },

    //   选择上传图片
    chooseImage: function (e) {

        const i = e.currentTarget.dataset.id;

        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let files = this.data.files;
                files[i].url = res.tempFilePaths[0];
                files[i].pct = 'wait';
                this.setData({
                    files
                });

                const access_token = wx.getStorageSync('access_token') || '';
                // 上传图片，返回链接地址跟id,返回进度对象
                let uploadTask = wx.uploadFile({
                    url: `${api.apiUrl}/api/upload/simpleUpload`,
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    header: {
                        'content-type': 'multipart/form-data',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                    formData: {
                        'type': 'reward_img'
                    },
                    success: (res) => {
                        console.log(res);
                        var res = JSON.parse(res.data);

                        if (200 === res.code) {
                            files[i].full_url = res.data.full_url;
                            files[i].path = res.data.path;

                            this.setData({
                                files,
                            })

                        } else {
                            util.errorTips('上传错误');

                            files[i] = {};

                            this.setData({
                                files,
                            })

                        }

                    },
                    fail(err) {
                        console.log(err)
                    },
                    complete() {

                    }
                })

                uploadTask.onProgressUpdate((res) => {
                    console.log('上传进度', res.progress);
                    files[i].pct = res.progress + '%';

                    this.setData({
                        files
                    })

                })

            }
        })
    },

    // 删除上传
    deleteItem(e) {

        const i = e.currentTarget.dataset.id;
        let files = this.data.files;
        files[i] = {};
        this.setData({
            files
        });
    },

    // 关闭弹窗

    close() {

        this.setData({
            formshow: false
        })
    },

    //地区选择器
    bindMultiPickerChange: function (e) {
        //console.log('picker发送选择改变，地区', e, e.detail.value)
        this.setData({
            multiIndex: e.detail.value
        })
    },
    bindMultiPickerColumnChange: function (e) {
        console.log('bindMultiPickerColumnChange改变 ==', e, e.detail.value);
        const column = e.detail.column;
        const i = e.detail.value;

        switch (column) {
            case 0:
                this.setData({
                    province: i
                });
                break;
            case 1:
                this.setData({
                    city: i
                });
                break;
            default: ;
        }

    },
    // 提交表单
    formSubmit1(e) {
        let formData = e.detail.value;
        let id = this.data.id;

        //  限制填写

        if (formData.name.trim().length === 0) {
            util.errorTips('请填写档口信息');
            return false
        }
        if (formData.contacts.trim().length === 0) {
            util.errorTips('请填写联系人');
            return false
        }

        if (formData.phone.trim().length === 0) {
            util.errorTips('请填联系电话');
            return false
        }

        if (formData.address.trim().length === 0) {
            util.errorTips('请填写详细地址');
            return false
        }

        // 判断地区,获取id
        const [one, two, three] = this.data.multiIndex;
        let multiArray = this.data.multiArray;

        // 填补其他所需参数
        formData.id = id;
        formData.province = multiArray[one].id;
        formData.city = multiArray[one].children[two].id;
        formData.area = multiArray[one].children[two].children[three].id;

        console.log('表单提交信息', formData)

        wx.showLoading({
            title: '正在提交...',
            mask: true
        })
  
        api.orderBeenFound({
            data: formData,
            query:{
                id
            },
            method:"POST"
        }).then( (res) => {
            console.log(res);

            // 提交成功，关闭窗口，清空
            this.setData({
                multiIndex: [6, 0, 8],
                formshow: false
            })

            // 更新数据
            let params = this.data.params;
            this.getMyOrderList(params)


        }).catch( (res) => {

            util.errorTips(res.message);

        }).finally( () => {

            wx.hideLoading()

        })




    },

    formSubmit2(e) {
        let formData = e.detail.value;
        let id = this.data.id;

        if (formData.remark.trim().length === 0) {
            util.errorTips('请填写回执内容');
            return false
        }

        formData.id = id;

        console.log(formData)

        wx.showLoading({
            title: '提交中..',
            maskt:true
        })

        api.orderNotFound({
            data: formData,
            query: {
                id
            },
            method: "POST"
        }).then( (res) => {
            console.log('找不到物料回执',res.data)

            this.setData({
                formshow: false,
            })

            // 更新数据
            let params = this.data.params;
            this.getMyOrderList(params)

        }).catch( (res) => {

        }).finally( () => {
            wx.hideLoading()
        })
    },
    // 提交表单
    formSubmit3(e) {

        let formData = e.detail.value;

        let id = this.data.id;

        formData.id = id;

        formData.imgs = [];

        // 暂时 上传图片
        if (formData.img1.length !== 0) {
            formData.imgs.push(formData.img1)
        }

        console.log(formData);

        if (formData.imgs.length === 0) {
            util.errorTips('请上传图片');
            return false
        }
        // 内容不为空
        if (formData.back_info.trim().length === 0) {
            util.errorTips('请填写内容')
            return false
        }

        wx.showLoading({
            title: '处理中',
            mask: true,
        })


        // 上传数据
        api.orderFeedback({
            method: "POST",
            data: formData,
            query: {
                id
            }
        }).then((res) => {
            util.successTips('提交成功');
            // 更新列表数据

            this.setData({
                formshow: false,
                files: [{}],
            })

            let params = this.data.params;
            this.getMyOrderList(params);

            console.log(res)

        }).catch((res) => {
            util.errorTips(res.message);
        }).finally(() => {
            wx.hideLoading()
        })


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let params = this.data.params;

        this.getMyOrderList(params)

        // 缓存地址信息
        let addressList = wx.getStorageSync('addressList');

        if (!!addressList){

            this.setData({
                multiArray: addressList,
                province: this.data.multiIndex[0],
                city: this.data.multiIndex[1]
            })

        }else {

            api.getAddress(

            ).then((res) => {
                console.log('地址信息', res);
                let addressList = res.data;

                wx.setStorage({
                    key: 'addressList',
                    data: addressList,
                })
                this.setData({
                    multiArray: addressList,
                    province: this.data.multiIndex[0],
                    city: this.data.multiIndex[1]
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
        console.log('onSHow 进入');
        onfire.fire('getInfo', '参数');

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

        onfire.un('getInfo')

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

        this.getMyOrderListNextPage();

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 获取数据
    getMyOrderList(params = {}) {

        wx.showLoading({
            title: '加载中',
            mask: true
        })

        this.setData({
            orderList: [],
            isFullLoad: false,
            isShow: false
        })

        this.data.page = 1;

        api.myOrderList({
            query: params,
            data: {
                page: 1
            }
        }).then((res) => {

            console.log('订单列表', res.data);

            let orderList = res.data;

            // 判断是否完毕
            let isFullLoad = this.isFullLoad(res);
            console.log('是否加载完毕', isFullLoad)
            this.setData({
                orderList,
                isFullLoad,
                isShow: true
            })

        }).catch((res) => {

            util.errorTips(res.message)

        }).finally((res) => {
            wx.hideLoading()
        })

    },

    // 下拉加载数据
    getMyOrderListNextPage() {

        wx.showLoading({
            title: '加载中',
            mask: true
        })
        let params = this.data.params;

        let page = this.data.page += 1;

        api.myOrderList({
            query: params,
            data: {
                page
            }
        }).then((res) => {

            console.log('订单列表', res.data);

            let orderList = res.data;

            // 判断是否完毕
            let isFullLoad = this.isFullLoad(res);
            console.log('是否加载完毕', isFullLoad)

            this.setData({
                orderList: this.data.orderList.concat(orderList),
                isFullLoad
            })

        }).catch((res) => {

            util.errorTips(res.message)

        }).finally((res) => {
            wx.hideLoading()
        })

    },

    // 判断是否加载完毕函数
    isFullLoad(res) {

        if (res.current_page * res.perPage >= res.total) {
            return true
        } else {
            return false
        }
    }

})