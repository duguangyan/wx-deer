const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let onfire = require('../../utils/onfire.js');
let app = getApp();

let index = undefined ;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        upLoadMaxNum: 6,
        addUpload: true,
        files: []
    },

    formSubmit (e) {
        console.log(e)
    },

    // 删除上传
    deleteItem(e) {

        const i = e.currentTarget.dataset.id;
        let files = this.data.files;

        // if (files[i].pct !== 'finish') {
        //     wx.showToast({
        //         title: '正在上传',
        //     })
        //     return false
        // }

        let isFiniish = files.every( (ele,i) => {
            return ele.pct === 'finish'
        })

        if (!isFiniish) {
            wx.showToast({
                title: '正在上传',
            })
            return false
        }

        files.splice(i, 1);
 
        index -= 1;
       
        if (files.length === this.data.upLoadMaxNum) {
            this.setData({
                addUpload: false,
                files
            })
        } else {
            this.setData({
                addUpload: true,
                files
            })
        }

        //   this.setData({
        //       files
        //   });
    },

    uploadAll() {

        wx.chooseImage({
            count: this.data.upLoadMaxNum - this.data.files.length,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: (res) => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let files = this.data.files;
                console.log('上传数据数组', res.tempFilePaths);

                res.tempFilePaths.forEach((ele, i) => {
                    console.log(i);

                    let item = {
                        url: ele,
                        pct: 'wait...',
                        full_url: ''
                    }

                    files.push(item);

                    if (i === res.tempFilePaths.length - 1) {

                        if (files.length === this.data.upLoadMaxNum) {
                            this.setData({
                                addUpload: false,
                                files
                            })
                        } else {
                            this.setData({
                                addUpload: true,
                                files
                            })
                        }

                        // this.setData({
                        //     files: files
                        // })
                    }

                })

                // wx.showLoading({
                //     title: '处理中',
                //     mask: true
                // })

               
                let  that = this;

                // i 应该是对应的
                console.log(']]]]]]]]]]]]]]]]]]',index)
                uploadimg(files, index);

                function uploadimg(files, i = 0) {
                    console.log('=============',i)
                    const access_token = wx.getStorageSync('access_token') || '';
                    // 上传图片，返回链接地址跟id,返回进度对象
                    let uploadTask = wx.uploadFile({
                        url: `${api.apiUrl}/api/upload/simpleUpload`,
                        filePath: files[i].url,
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
                                // files[i].path = res.data.path;

                                that.setData({
                                    files,
                                })

                            } else {
                                util.errorTips('上传错误');

                                files[i].pct = 'fail';

                                that.setData({
                                    files,
                                })

                            }

                        },
                        fail(err) {
                            console.log(err)
                        },
                        complete: () => {

                            i++; //这个图片执行完上传后，开始上传下一张
                            index = i;
                            if (i == files.length) { //当图片传完时，停止调用          
                                console.log('执行完毕');
                               // wx.hideLoading()
                              
                            } else { //若图片还没有传完，则继续调用函数
                                console.log(i);
                              
                                uploadimg(files, i);
                            }

                        }
                    })

                
                    uploadTask.onProgressUpdate((res) => {
                        console.log('上传进度', res.progress);
                        files[i].pct = res.progress + '%';

                        if (res.progress == 100) {
                            files[i].pct = 'finish';
                        }

                        that.setData({
                            files
                        })

                    })

                }


            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})