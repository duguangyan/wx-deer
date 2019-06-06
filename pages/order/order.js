const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
let onfire = require('../../utils/onfire.js');
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    //   订单类型1找料订单2取料订单
    //   0全部1找料中2配送中3已完成
    data: {
        params: {
            task_type: 1,
            type: -1,
            
        },
      page: 1,
      status: 1,
      nav:1,
      multiIndex: [7, 0, 8],
      orderList:[],
      isFullLoad:false,
      address:'',
      name:''
    },
    // 大类选择
    getOrderData(e) {
        let nav = e.currentTarget.dataset.nav;
        wx.setStorageSync('nav',nav);
        wx.setStorageSync('status', 1);
        this.setData({
            isFullLoad:false,
            nav,
            page:1,
            status:1,
            orderList:[]
        })
        
        this.getMyOrders()
    },
    // 获取下栏目数据
    getOrderTypeData(e) {
        let type = e.currentTarget.dataset.type;
        wx.setStorageSync('status', type);
        this.setData({
          page:1,
          status:type,
          isFullLoad: false,
          orderList:[]
        })
        this.getMyOrders()
    },
    // 查看详情
    seeDetail(e) {

      let index = e.currentTarget.dataset.index;
      let id = e.currentTarget.dataset.id;
      
      wx.navigateTo({
        url: `../orderDetail/orderDetail?index=${this.data.nav}&id=${id}&status=${this.data.status}`,
      })
        
    },

    // 预览图片

    preview(e) {

        let index = e.currentTarget.dataset.index;
        let idx = e.currentTarget.dataset.idx;

      let imgs = this.data.orderList[index].desc_img;

        wx.previewImage({
            current: imgs[idx], // 当前显示图片的http链接
            urls: imgs // 需要预览的图片http链接列表
        })

    },

    // 弹窗

    showForm(e) { 

      let formtype = e.currentTarget.dataset.type;
      let id = e.currentTarget.dataset.id;
      let nav = this.data.nav;
      this.setData({
        id
      })
      let content = this.data.nav == 1 ? '确认提交找料信息' : '确认提交取料信息';
      wx.showModal({
        title: '提示',
        content: content,
        success:  (res) => {
          if (res.confirm) {
            console.log('用户点击确定')

            if(nav == 1){
              // formtype 1:找到物料  2：找不到物料
              if (formtype == 2){
                  this.setData({
                    formtype:2,
                    formshow:true
                  })
              } else if (formtype == 1){
                  this.setData({
                    formtype: 1,
                    formshow: true
                  })
              }
            }else if(nav == 2){
              if (formtype == 2) {
                this.setData({
                  formtype: 2,
                  formshow: true
                })
              } else if (formtype == 1) {
                  api.orderBeenFound({
                    data: {id},
                    method: "POST"
                  }).then((res) => {
                    // 提交成功，关闭窗口，清空
                    this.setData({
                      formshow: false,
                      orderList: []
                    })
                    // 更新数据
                    this.getMyOrders()
                  })
              }
            }

            
            } 
          
        }
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

                    if (res.progress == 100) {
                        files[i].pct = 'finish';
                    }

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

    saveformid(e) {
        // 增加formid
        let formId = e.detail.formId;
        // app.saveformid(formId);
    },
  changeModalCancel() {
    this.setData({
      showCon: false
    })
  },
    getMapAddress(){
      let _this = this;
      wx.chooseLocation({
        success:function(res){
          _this.setData({
            address: res.address,
            name:res.name,
            latitude: res.latitude,
            longitude: res.longitude
          })
        },
        fail:function(res){
          wx.getSetting({
            success: (res) => {
              if (!res.authSetting['scope.userLocation']) {
                //打开提示框，提示前往设置页面
                _this.setData({
                  showCon: true
                })
              }
            }
          })
          // util.errorTips("地图使用失败");
        }
      })
    },
    // 提交表单
    formSubmit1(e) {
        let formData = e.detail.value;
        formData.id = this.data.id;
        // 增加formid
        //let formId = e.detail.formId;
        // app.saveformid(formId);

        //  限制填写
        // if (formData.name.trim().length === 0) {
        //     util.errorTips('请填写地址信息');
        //     return false
        // }
        // if (formData.contacts.trim().length === 0) {
        //     util.errorTips('请填写联系人');
        //     return false
        // }

        // if (formData.phone.trim().length === 0) {
        //     util.errorTips('请填联系电话');
        //     return false
        // }

        // if (formData.address.trim().length === 0) {
        //     util.errorTips('请填写详细地址');
        //     return false
        // }

        

        wx.showLoading({
            title: '正在提交...',
            mask: true
        })

        api.orderBeenFound({
            data: formData,
            method: "POST"
        }).then((res) => {
            console.log(res);
            
            // 提交成功，关闭窗口，清空
            this.setData({
                multiIndex: [6, 0, 8],
                formshow: false,
                orderList:[]
            })
            // 更新数据
            let params = this.data.params;
            this.getMyOrders()
        }).catch((res) => {
            if (res.code !== 401) {
                util.errorTips(res.msg)
            }

        }).finally(() => {
          wx.hideLoading()
        })




    },

    formSubmit2(e) {
        let formData = e.detail.value,
            formId = e.detail.formId;
        let id = this.data.id;
        
        // 增加formid
        // app.saveformid(formId);

        if (formData.remark.trim().length === 0) {
            util.errorTips('请填写回执内容');
            return false
        }

        formData.id = id;

        console.log(formData)

        wx.showLoading({
            title: '提交中..',
            maskt: true
        })
        if(this.data.nav==1){
          api.orderNotFound({
            data: formData,
            method: "POST"
          }).then((res) => {
            //console.log('找不到物料回执', res.data)
            wx.hideLoading()
            this.setData({
              formshow: false,
            })
            // 更新数据
            let params = this.data.params;
            this.setData({
              orderList: []
            })
            this.getMyOrders()

          }).catch((res) => {
            wx.hideLoading()
            if (res.code !== 401) {
              util.errorTips(res.msg)
            }

          }).finally(() => {

          })
        }else{
          api.orderFetchNotFound({
            data: formData,
            method: "POST"
          }).then((res) => {
            //console.log('找不到物料回执', res.data)
            wx.hideLoading()
            this.setData({
              formshow: false,
            })
            // 更新数据
            let params = this.data.params;
            this.setData({
              orderList: []
            })
            this.getMyOrders()

          }).catch((res) => {
            wx.hideLoading()
            if (res.code !== 401) {
              util.errorTips(res.msg)
            }

          }).finally(() => {
            
          })
        }
        
    },
    // 提交表单
    formSubmit3(e) {

        let formData = e.detail.value;

        let id = this.data.id;
        console.log('ididiididididi', id)
        formData.id = id;
        // 增加formid
        let formId = e.detail.formId;
        // app.saveformid(formId);

        formData.imgs = [];

        let uploadC = this.selectComponent('#upload');

        // 判定是否在已是完成状态
        let isUploading = uploadC.data.files.every((ele, i) => {
            return (ele.pct && (ele.pct === 'finish' || ele.pct === 'fail'))
        })
        console.log('isUploading', isUploading)
        if (!isUploading) {
            util.errorTips('图片正在上传')
            return false
        }
        // 添加数据
        uploadC.data.files.forEach((ele, i) => {
            if (ele.full_url) {
                formData.imgs.push(ele.full_url)
            }
        })
        
        // 必须上传
        if (formData.imgs.length === 0) {
            util.errorTips('请上传图片');
            return false
        }
        // 内容不为空
        if (formData.back_info.trim().length === 0) {
            util.errorTips('请填写回执信息')
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
                formshow: false
            })

            // 清除数据
            uploadC.setData({
                files: []
            })

            let params = this.data.params;

            this.getMyOrders();

            console.log(res)

        }).catch((res) => {
            wx.hideLoading()
            if (res.code !== 401) {
                util.errorTips(res.msg)
            }
        }).finally(() => {

        })


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        // 缓存地址信息
        // let addressList = wx.getStorageSync('addressList');

        // if (!!addressList) {

        //     this.setData({
        //         multiArray: addressList,
        //         province: this.data.multiIndex[0],
        //         city: this.data.multiIndex[1]
        //     })

        // } else {

        //     api.getAddress(

        //     ).then((res) => {
        //         console.log('地址信息', res);
        //         let addressList = res.data;

        //         wx.setStorage({
        //             key: 'addressList',
        //             data: addressList,
        //         })
        //         this.setData({
        //             multiArray: addressList,
        //             province: this.data.multiIndex[0],
        //             city: this.data.multiIndex[1]
        //         })

        //     })

        // }

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
      let nav = wx.getStorageSync('nav') || 1;
      let status = wx.getStorageSync('status') || 1;
      
      this.setData({
        nav,
        status,
        orderList:[]
      })

      // let navIndex = app.globalData.orderIndex;
      // this.setData({
      //   nav: navIndex,
      //   status: 1
      // })

      app.globalData.orderIndex = 1;

      // 获取数据
      this.getMyOrders();
      console.log('onSHow 进入');
      onfire.fire('getInfo', '参数');
      onfire.fire('updataOrder', 'neworder');
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

        onfire.un('getInfo')
        onfire.un('updataOrder')

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
        this.data.page++;
        this.getMyOrders();
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      if (!this.data.isFullLoad){
        this.data.page++;
        this.getMyOrders();
      }
      

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    // 获取数据
  getMyOrders(){
   if(this.data.nav == 1){
     api.myOrderFindList({
       data: {
         page: this.data.page,
         status: this.data.status
       }
     }).then((res) => {
       if(res.data.length <=0){
         this.setData({
           isFullLoad:true
         })
       }
       this.setData({
         orderList: this.data.orderList.concat(res.data)
       })
     })
   } else if (this.data.nav == 2){
     api.myOrderFetchList({
       data: {
         page: this.data.page,
         status: this.data.status
       }
     }).then((res) => {
       if (res.data.length <= 0) {
         this.setData({
           isFullLoad: true
         })
       }
       this.setData({
         orderList: this.data.orderList.concat(res.data)
       })
     })
   } else if (this.data.nav == 3){
     api.myOrderShipList({
       data: {
         page: this.data.page,
         status: this.data.status
       }
     }).then((res) => {
       if (res.data.length <= 0) {
         this.setData({
           isFullLoad: true
         })
       }
       this.setData({
         orderList: this.data.orderList.concat(res.data)
       })
     })
   }
    
  },
  getMyOrderList(params = {}) {

        // 处理下拉
        if(params.onPull){

            this.setData({
                
                isFullLoad: false,
                isShow: false
            })

        }else{
            
            wx.showLoading({
                title: '加载中',
                mask: false
            })

            this.setData({
                orderList: [],
                isFullLoad: false,
                isShow: false
            })

        }

        this.data.page = 1;

        api.myOrderList({ 
            query: params,
            data: {
                page: 1
            }
        }).then((res) => {
            wx.hideLoading()
            console.log('订单列表', res.data);

            let orderList = res.data; 
            if (params.task_type == '2') {
              for (let i = 0; i < orderList.length; i++) {
                orderList[i].front_img = orderList[i].desc_img;
                orderList[i].type      = 1;
              }
            }
            console.log(orderList);
            // 判断是否完毕
            let isFullLoad = this.isFullLoad(res);
            console.log('是否加载完毕', isFullLoad)
            this.setData({
                orderList,
                isFullLoad,
                isShow: true
            })
          // 合并图片
          this.mergeImg(orderList)
        }).catch((res) => {
            wx.hideLoading()
            // if (res.code !== 401) {
            //     util.errorTips(res.msg)
            // }

        }).finally((res) => {
          wx.hideLoading()
        })

        // 更新数量数据

        api.orderNum({
            query: {
                id: params.task_type
            }
        }).then((res) => {
            console.log(res);
            let id = params.task_type;
            if (id == 1) {

                this.setData({
                    findNum: res.data
                })

            } else if (id == 2) {
                this.setData({
                    sendNum: res.data
                })
            }



        }).catch((err) => {
            console.log(err)
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
            wx.hideLoading()
            let orderList = res.data;

            // 合并图片
            this.mergeImg(orderList)

            // 判断是否完毕
            let isFullLoad = this.isFullLoad(res);
            console.log('是否加载完毕', isFullLoad)

            this.setData({
                orderList: this.data.orderList.concat(orderList),
                isFullLoad
            })

        }).catch((res) => {
            wx.hideLoading()
            if (res.code !== 401) {
                util.errorTips(res.msg)
            }

        }).finally((res) => {

        })

    },

    // 判断是否加载完毕函数
    isFullLoad(res) {

        if (res.current_page * res.perPage >= res.total) {
            return true
        } else {
            return false
        }
    },

    // 处理预览图片
    mergeImg(list) {

        list.forEach((ele, i) => {

            let imgs = [];

            if (ele.front_img.length !== 0) {
                imgs.push(ele.front_img)
            }
            if (ele.side_img.length !== 0) {
                imgs.push(ele.side_img)
            }
            if (ele.back_img.length !== 0) {
                imgs.push(ele.back_img)
            }
            ele.imgs = imgs;
        })

    },

    orderNum(id) {
        api.orderNum({
            query: {
                id
            }
        }).then((res) => {
            console.log(res)
        })
    }

})