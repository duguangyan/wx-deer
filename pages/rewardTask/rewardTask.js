const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rewardList: [],
        type: 'acceptable',
        status: 0,
        page: 1,
        // 弹窗
        isShowPop: false,
        // 回执信息图片
        files: [{}, {}],
    },

    // 预览图片
    preview(e) {

        let index = e.currentTarget.dataset.index;
        let idx = e.currentTarget.dataset.idx;

        let imgs = this.data.rewardList[index].examples

        wx.previewImage({
            current: imgs[idx], // 当前显示图片的http链接
            urls: imgs // 需要预览的图片http链接列表
        })

    },

    //   接受悬赏任务
    acceptTask(e) {
        let id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        console.log(id, index);

        wx.showModal({
            title: '温馨提示',
            content: '是否接受此任务',
            confirmText: '是',
            confirmColor: '#c81a29',
            success: (res) => {

                if (res.confirm) {

                    api.acceptTask({
                        method: "POST",
                        data: {
                            task_id: id
                        }
                    }).then((res) => {
                        console.log('领取任务', res);

                        util.successTips('接单成功')

                        let rewardList = this.data.rewardList;

                        rewardList.splice(index, 1);

                        this.setData({
                            rewardList
                        })

                    }).catch((res) => {
                        util.errorTips(res.msg);
                    })

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })


    },

    // 提交任务
    submitJob(e) {

        let id = e.currentTarget.dataset.id,
            index = e.currentTarget.dataset.index;

        this.setData({
            isShowPop: true,
            id,
            index
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

                    // if (res.progress == 100){
                    //     files[i].pct = '上传成功'
                    // }
                    this.setData({
                        files
                    })
                    // console.log('已经上传的数据长度', res.totalBytesSent)
                    // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
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
    colse() {

        this.setData({
            isShowPop: false
        })
    },
    // 上传文件
    uploadFile() {
        // 微信估计不支持文件上传，待考察，隐藏了按钮
    },

    // 提交表单
    formSubmit(e) {

        console.log('上传图片', this.data.files)
        let formData = e.detail.value;

        formData.imgs = [];

        // 暂时 上传图片
        if (formData.img1.length !== 0) {
            formData.imgs.push(formData.img1)
        }

        if (formData.img2.length !== 0) {
            formData.imgs.push(formData.img2)
        }

        console.log(formData);

        if (formData.imgs.length === 0) {
            util.errorTips('请上传图片');
            return false
        }
        // 内容不为空
        if (formData.content.trim().length === 0) {
            util.errorTips('请填写内容')
            return false
        }

        wx.showLoading({
            title: '处理中',
            mask: true,
        })

        // 上传数据
        api.rewardTaskFeedback({
            method: "PUT",
            data: formData,
            query: {
                id: this.data.id
            }
        }).then((res) => {
            util.successTips('提交成功');
            // 更新列表数据
            let rewardList = this.data.rewardList,
                index = this.data.index;
            rewardList[index].audit_status = 0;

            this.setData({
                isShowPop: false,
                files: [{}, {}],
                rewardList
            })
            console.log(res)
        }).catch((res) => {
            wx.hideLoading()
            util.errorTips(res.msg);
        }).finally(() => {
            
        })


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAcceptableTaskList();
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

        let type = this.data.type
        // 可接悬赏
        if (type === 'acceptable') {

            this.getAcceptableTaskListRefresh()

        } else if (type === 'accepted') {
            // 已接悬赏
            this.getAcceptedTaskListRefresh()
        }

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 可接悬赏任务列表
    getAcceptableTaskList() {
        this.data.page = 1;
        let page = this.data.page;

        this.setData({
            rewardList: [],
            type: 'acceptable',
            status: 0,
            isShow: false
        })

        wx.showLoading({
            title: '加载中',
        })

        api.acceptableTaskList({
            data: {
                page
            }
        }).then((res) => {
            console.log('可接悬赏列表数据', res);
            wx.hideLoading()
            let rewardList = res.data;

            let fullLoad = false;
            if (res.current_page * res.perPage >= res.total) {
                // 加载完毕
                fullLoad = true
            }

            // rewardList.forEach((ele, i) => {
            //     ele.examples = JSON.parse(ele.examples)
            //     ele.reward_amount = parseInt(ele.reward_amount)
            // })
            // 更新 悬赏状态
            this.dealTask(rewardList)

            this.setData({
                rewardList,
                type: 'acceptable',
                status: 0,
                isShow: true,
                fullLoad,
            })


        }).catch((res) => {
            wx.hideLoading()
            if (res.code !== 401) {
                util.errorTips(res.msg)
            }
        }).finally(() => {
           
        })
    },
    // 可接悬赏下拉刷新
    getAcceptableTaskListRefresh() {

        let page = ++this.data.page;

        wx.showLoading({
            title: '加载中',
        })

        api.acceptableTaskList({
            data: {
                page
            }
        }).then((res) => {
            console.log('下拉刷新可接悬赏列表数据', res);
            wx.hideLoading()
            let rewardList = res.data;

            // rewardList.forEach((ele, i) => {
            //     ele.examples = JSON.parse(ele.examples);
            //     ele.reward_amount = parseInt(ele.reward_amount)

            // })
            this.dealTask(rewardList)

            // 判定数据为空
            if (res.current_page * res.perPage > res.total) {
                console.log('加载完毕')
                this.setData({
                    fullLoad: true,
                    rewardList: this.data.rewardList.concat(rewardList),
                    type: 'acceptable',
                    status: 0
                })
            } else {
                this.setData({
                    fullLoad: false,
                    rewardList: this.data.rewardList.concat(rewardList),
                    type: 'acceptable',
                    status: 0
                })
            }



        }).catch((res) => {
            wx.hideLoading()
            if (res.code !== 401) {
                util.errorTips(res.msg)
            }

        }).finally(() => {
           
        })



    },

    //   已接受悬赏任务
    getAcceptedTaskList(e) {

        let status = e.currentTarget.dataset.status;

        this.data.page = 1;
        let page = this.data.page;

        // 设置样式
        this.setData({
            rewardList: [],
            type: 'accepted',
            status,
            isShow: false
        })

        wx.showLoading({
            title: '加载中',
        })

        api.acceptedTaskList({
            data: {
                status,
                page
            }
        }).then((res) => {
            console.log('已接悬赏列表数据', res);
            let rewardList = res.data;
            wx.hideLoading()
            
            rewardList.forEach((ele, i) => {
                ele.reward_amount = parseInt(ele.reward_amount)
              
            })

            // 判定数据为空
          
                let fullLoad = false;
                if (res.current_page * res.perPage >= res.total) {
                    // 加载完毕
                    fullLoad = true
                }

                

                this.setData({
                    isShow: true,
                    fullLoad,
                    rewardList
                })
        
      

        }).catch((res) => {
            wx.hideLoading()
            if (res.code !== 401) {
                util.errorTips(res.msg)
            }

        }).finally(() => {
           
        })

    },
    // 已接悬赏数据更新加载
    getAcceptedTaskListRefresh() {

        let page = ++this.data.page;
        let status = this.data.status;

        wx.showLoading({
            title: '加载中',
        })

        api.acceptedTaskList({
            data: {
                page,
                status
            }
        }).then((res) => {
            console.log('下拉刷新已接悬赏列表数据', res);
            wx.hideLoading()
            let rewardList = res.data;

            rewardList.forEach((ele, i) => {
              
                ele.reward_amount = parseInt(ele.reward_amount)
            })

            // 判定数据为空
            if (res.current_page * res.perPage > res.total) {
                console.log('加载完毕')
                this.setData({
                    fullLoad: true,
                    rewardList: this.data.rewardList.concat(rewardList),
                    type: 'accepted',
                })
            } else {
                this.setData({
                    fullLoad: false,
                    rewardList: this.data.rewardList.concat(rewardList),
                    type: 'accepted',
                })
            }



        }).catch((res) => {
            wx.hideLoading()
            if (res.code !== 401) {
               
                util.errorTips(res.msg)
            }
        }).finally(() => {
           
        })



    },
    // 处理 点击更新new状态
    dealTask (list) {
        // 已经点赞
        let arr1 = wx.getStorageSync('taskseen') || [];
        console.log(arr1)
        list.forEach( (ele, i) => {

                let id = ele.id;
                // 已经点赞
                if(arr1.includes(id)){
                    ele.is_new = false
                }else {
                    ele.is_new = true
                }
                // 已经接受要解json
                ele.examples = JSON.parse(ele.examples);
                ele.reward_amount = parseInt(ele.reward_amount)

        })

    }
})