/* 聊天窗口
 * 其中54px为回复框高度，css同
 * mode true为文本，false为语音
 * cancel true为取消录音，false为正常录音完毕并发送
 * 上拉超过50px为取消发送语音
 * status 0为normal，1为pressed，2为cancel
 * hud的尺寸是150*150
 */
const api = require('../../utils/api.js');
const IMapi = require('../../utils/IMapi.js');
const util = require('../../utils/util.js');
const md5 = require('../../utils/md5.js');
var app = getApp();
Page({
  data: {
    isFalse: false,
    inputShowed: false,
    isConfirmHold: true,
    isScrollY: true,
    toId: '',
    sms: 0,
    baseUrl: 'https://webapi.yidap.com',
    message_list: [],
    scroll_height: wx.getSystemInfoSync().windowHeight,
    page_index: 0,
    mode: true,
    cancel: false,
    status: 0,
    tips: ['按住 说话', '松开 结束', '取消 发送'],
    state: {
      'normal': 0,
      'pressed': 1,
      'cancel': 2
    },
    toView: '',
    userId: '',
    to_avatar_path: 'https://static.yidap.com/miniapp/o2o/imgs/collection@2x.png',
    currentPage: 2,
    pageSize: 10,
    scrollLoading: 0,
    HideData: [],
    EventData: [],
    NoMoreEvent: 0,
    noData: true
  },

  bindscrolltoupper1() {
    let _this = this;

    if (_this.data.scrollLoading == 1) { //防止多次触发
      return false
    }

    _this.data.scrollLoading = 1;
    let currentPage = this.data.currentPage++;
    let pageSize = this.data.pageSize;
    console.log('currentPage:' + currentPage);

    wx.showNavigationBarLoading();
    let createTime = util.getNowFormatDate(new Date());
    let avatar_path = wx.getStorageSync("avatar_path");
    let fromUserId = wx.getStorageSync('userId');
    let toUserId = this.data.toId;
    let userInfoId = fromUserId < toUserId ? (fromUserId.toString() + toUserId.toString()) : (toUserId.toString() + fromUserId.toString());
    let message = { fromUserId, toUserId, userInfoId, content: '1', createTime, smsType: 'TEXT', sysType: 1, smsStatus: 0, toUserPhoto: avatar_path, fromUserPhoto: 'https://ossyidap.oss-cn-shenzhen.aliyuncs.com/image/png/9EAFE4BFEFDDF762718332C8F1BE9F2C.png', smsList: false, currentPage, pageSize }
    console.log('下拉message：', message);
    wx.sendSocketMessage({
      data: JSON.stringify(message),
      success() {
        console.log('sendSocketMessage:成功了');
      },
      fail() {
        console.log('sendSocketMessage:失败了');
      },
      complete() {
        wx.hideNavigationBarLoading();    //在当前页面隐藏导航条加载动画
        wx.stopPullDownRefresh();
      }
    })
  },
  onPullDownRefresh: function () {
    //this.bindscrolltoupper1();
  },
  bindscroll(e) {
    console.log('bindscroll', this.data.scrollLoading);
    var that = this;
    if (that.data.scrollLoading == 1) { //防止多次触发
      return false
    }
    if (!that.data.noData) {
      return false;
    }
    if (e.detail.scrollTop <= 10) { //触发触顶事件

      console.log('触发顶部事件', e.detail.scrollTop)

      //获取隐藏的view 高度
      var query = wx.createSelectorQuery();
      query.select('#hideview').boundingClientRect()

      query.exec(function (res) {
        var EventData = that.data.EventData //此数据为展示的数据
        var HideData = that.data.HideData　　//此数据为隐藏数据
        EventData = HideData.concat(that.data.EventData)  //拼接数据
        if (HideData == '' || !HideData) {  //判断是否隐藏数据为空
          that.setData({
            NoMoreEvent: 1,
            scrollTop: 0,
          })
          return false
        }
        let n = that.data.totalSize - that.data.EventData.length - that.data.HideData.length;
        if (n < 10) {
          setTimeout(() => {  //自行选择是否定时进行加载
            that.setData({
              EventData: EventData,
            })
            that.bindscrolltoupper1()　　//请求新的数据
          }, 1000)
        } else {
          setTimeout(() => {  //自行选择是否定时进行加载
            that.setData({
              EventData: EventData,
              scrollTop: res[0].height,
            })
            that.bindscrolltoupper1()　　//请求新的数据

          }, 1000)
        }

      })

    }
  },
  onLoad(options) {
    if (options.id) {
      this.data.toId = options.id
    } else {
      this.data.toId = options.toUserId
    }
    wx.setNavigationBarTitle({
      title: options.fmUserName,
    })
    // IMapi.getPhotoByIM({
    //   method:'POST',
    //   data:{
    //     userId: parseInt(this.data.toId) 
    //   }
    // }).then((res)=>{
    //   
    // })
    this.setData({
      toId: this.data.toId,
      fromUserPhoto: options.fromUserPhoto ? options.fromUserPhoto : 'https://ossyidap.oss-cn-shenzhen.aliyuncs.com/image/png/9EAFE4BFEFDDF762718332C8F1BE9F2C.png'
    })

  },
  onPageScroll: function (res) {
    console.log(res);
  },
  onHide() {
    console.log('onHide');
  },
  onUnload() {
    console.log('onUnload');
    wx.closeSocket();
  },
  // 连接socket
  getSocket() {
    let _this = this;
    // this.getUserInfoformSocket();
    // this.getMessageBySocket();
    let userId = wx.getStorageSync("userId");

    this.setData({
      userId
    })
    let userInfoId = userId > this.data.toId ? (this.data.toId + "") + (userId + "") : (userId + "") + (this.data.toId + "");
    userInfoId = md5.md5(userInfoId);

    // im.yidap.com webapi.yidapi.com.cn
    let url = 'wss://webapi.yidapi.com.cn/notice/socket?userId=' + userId + '&toUserId=' + this.data.toId + '&openType=1&sms=' + this.data.sms;
    console.log('连接用户ID：' + this.data.toId);
    console.log(url);
    app.globalData.socket = wx.connectSocket({
      url,
      success() {
        console.log("connectSocket-success:连接上了");
      },
      fail() {
        console.log("connectSocket-fail:连接失败");
      }
    });
    wx.onSocketClose((res) => {
      console.log("onSocketClose:断开了");
      this.data.sms = 1;
      this.getSocket();
    })
    wx.onSocketError((res) => {
      console.log('socket错误：' + res)
    })
    wx.onSocketOpen(function (res) {
      console.log("onSocketOpen:连接上了");
      _this.setData({
        noData: false
      })
      wx.onSocketMessage(function (res) {

        console.log("接收消息");
        console.log('-->', JSON.parse(res.data));
        let HideData = _this.data.HideData;
        let EventData = _this.data.EventData;
        let arr = [];

        if (JSON.parse(res.data).currentPage != undefined) {
          _this.data.totalSize = JSON.parse(res.data).totalSize;
          let dataTjson = JSON.parse(res.data).list;
          if (dataTjson && dataTjson.length > 0) {
            let avatar_path = wx.getStorageSync('avatar_path');
            dataTjson.forEach((o, i) => {
              let obj = {
                content: o.content,
                createTime: util.formatDate(o.create_time),
                fromUserId: o.from_user_id,
                toUserId: o.to_user_id,
                userInfoId: o.user_info_id,
                fromUserPhoto: o.form_user_photo,
                smsType: o.sms_type,
                smsStatus: o.sms_status,
                fromUserPhoto: _this.data.fromUserPhoto,
                toUserPhoto: avatar_path,
                timeInterval: o.time_interval
              }
              arr.push(obj);

            })
            console.log(_this.data.currentPage);
            if (_this.data.currentPage > 2) {
              _this.setData({
                HideData: arr,
                noData: true
              })
            }

            HideData = arr.concat(HideData);
          } else {
            _this.setData({
              noData: false
            })
            return false;
          }


          if (_this.data.currentPage <= 2) {
            _this.setData({
              EventData: HideData
            })
            _this.scrollToBottom();
          } else {
            _this.setData({
              HideData: arr
            })
          }


          let n = _this.data.totalSize - _this.data.EventData.length - _this.data.HideData.length;

          if (n == 0) {
            _this.setData({
              noData: false
            })
            var query = wx.createSelectorQuery();
            query.select('#hideview').boundingClientRect();
            query.exec(function (res) {
              _this.setData({
                scrollTop: res[0].height,
              })
            })
          }


        } else { // 单条数据

          let o = JSON.parse(res.data);
          if (o.userInfoId == userInfoId) {
            o.fromUserPhoto = _this.data.fromUserPhoto;
            o.createTime = util.formatDate(o.createTime)
            _this.data.EventData.push(o);
          }

          _this.setData({
            EventData: _this.data.EventData
          })
          _this.scrollToBottom();
        }

        if (_this.data.currentPage <= 2) {
          setTimeout(() => {
            _this.bindscrolltoupper1();
          }, 1000)
        }
        // 放开滚动置顶
        _this.data.scrollLoading = 0;

      })


    })
  },
  onShow() {
    if (app.globalData.socket) {
      wx.closeSocket();
    }
    this.getSocket();
    // setTimeout(()=>{
    //   this.bindscrolltoupper1();
    // },1000)

  },
  getMessageBySocket() {
    let data = {}
    data.userId = wx.getStorageSync("userId");
    IMapi.getMessageBySocket({
      method: 'POST',
      data
    }).then((res) => {

    })
  },
  getUserInfoformSocket() {
    let _this = this;
    let data = {};
    data.userId = wx.getStorageSync("userId");
    IMapi.getUserInfoformSocket({
      method: 'POST',
      data
    }).then((res) => {
      this.setData({
        to_avatar_path: res.avatar_path
      })
    })
  },
  audioPlay(e) {
    let id = e.currentTarget.dataset.id;
    this.audioCtx = wx.createAudioContext(id);
    this.audioCtx.play()
  },

  reply: function (e) {
    let _this = this;

    var content = e ? e.detail.value : this.data.content;
    this.data.content = content;
    if (content == '') {
      wx.showToast({
        title: '总要写点什么吧'
      });
      return;
    }
    var EventData = this.data.EventData;
    // 发送消息
    let createTime = util.getNowFormatDate(new Date());
    let avatar_path = wx.getStorageSync("avatar_path");
    let fromUserId = wx.getStorageSync('userId');
    let toUserId = this.data.toId;

    let userInfoId = fromUserId < toUserId ? (fromUserId.toString() + toUserId.toString()) : (toUserId.toString() + fromUserId.toString());

    let message = { fromUserId, toUserId, userInfoId, content, createTime, smsType: 'TEXT', sysType: 1, smsStatus: 1, toUserPhoto: avatar_path, fromUserPhoto: _this.data.fromUserPhoto, smsList: false, currentPage: '', pageSize: '' }
    wx.sendSocketMessage({
      data: JSON.stringify(message),
      success() {
        console.log('sendSocketMessage:成功了');
        EventData.push(message);
        console.log(EventData);

        message.fromUserPhoto = avatar_path;
        _this.setData({
          inputShowed: true,
          EventData: EventData,
          content: '' // 清空输入框文本
        })
      },
      fail() {
        console.log('sendSocketMessage:失败了')
        _this.data.sms = 1;
        _this.onShow();
      }
    })
    console.log('EventData -->');
    console.log(this.data.EventData);
    setTimeout(() => {
      this.scrollToBottom();
    }, 100)

  },
  chooseImage: function () {
    // 选择图片供上传
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths);
        // 遍历多图
        tempFilePaths.forEach((tempFilePath) => {
          this.upload(tempFilePath, 'image');
        });
      }
    })
  },
  preview: function (e) {
    // 当前点击图片的地址
    var src = e.currentTarget.dataset.src;//获取data-src
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  switchMode: function () {
    // 切换语音与文本模式
    // this.setData({
    //   mode: !this.data.mode
    // });
  },
  record: function () {
    // 录音事件
    console.log("------------------");
    console.log(this.data.cancel);
    let _this = this;
    wx.startRecord({
      success: function (res) {
        console.log("------------------");
        console.log(_this.data.cancel)
        if (!_this.data.cancel) {
          _this.upload(res.tempFilePath, 'voice');
        }
      },
      fail: function (res) {
        console.log(res);
        //录音失败
      },
      complete: function (res) {
        console.log(res);

      }
    })

  },
  stop: function () {
    wx.stopRecord();
  },
  touchStart: function (e) {
    // 触摸开始
    var startY = e.touches[0].clientY;
    // 记录初始Y值
    this.setData({
      startY: startY,
      status: this.data.state.pressed
    });
  },
  touchMove: function (e) {
    // 触摸移动
    var movedY = e.touches[0].clientY;
    var distance = this.data.startY - movedY;
    // console.log(distance);
    // 距离超过50，取消发送
    this.setData({
      status: distance > 50 ? this.data.state.cancel : this.data.state.pressed
    });
  },
  touchEnd: function (e) {
    // 触摸结束
    var endY = e.changedTouches[0].clientY;
    var distance = this.data.startY - endY;
    // console.log(distance);
    // 距离超过50，取消发送
    this.setData({
      cancel: distance > 50 ? true : false,
      status: this.data.state.normal
    });
    // 不论如何，都结束录音
    this.stop();
  },
  upload: function (tempFilePath, type) {
    
    let _this = this;
    // 开始上传
    wx.showLoading({
      title: '发送中'
    });
    // 语音与图片通用上传方法
    // var formData = {
    //   third_session: wx.getStorageSync('third_session'),
    //   mpid: this.data.mpid,
    //   fans_id: this.data.to_uid,
    //   msg_type: type,
    // };
    // // console.log(tempFilePath);
    // var message_list = this.data.message_list;
    // var message = {
    //   myself: 1,
    //   head_img_url: 'http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqSucF9v6bKPfUPSTuQjpqmr8jAZEOgsFjFCHc73UIlUAgnI2nz6aFdnkRWAxxy1uZGfC82Yp7fMg/0',
    //   'msg_type': type,
    //   'content': tempFilePath,
    //   create_time: '2018-07-31 17:20:39'
    // };

    // 上传图片，返回链接地址跟id,返回进度对象
    let message = '';
    if (type == 'image') {
      const access_token = wx.getStorageSync('access_token') || '';
      let data = {};
      data.file = '[object Object]';
      data.type = 'big';
      let timestamp = Date.parse(new Date());
      data.timestamp = timestamp;
      data.sign = util.MakeSign(api.apiUrl + '/api/upload', data);
      data.deviceId = "wx";
      data.platformType = "1";
      data.versionCode = '4.0';
      let uploadTask = wx.uploadFile({
        url: `${api.apiUrl}/api/upload`,
        filePath: tempFilePath,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        formData: data,
        success: (res) => {
          console.log(res);
          var res = JSON.parse(res.data);
          if (200 === res.code || 0 === res.code) {
            // 发送消息
            let createTime = util.getNowFormatDate(new Date());
            let avatar_path = wx.getStorageSync("avatar_path");
            let fromUserId = wx.getStorageSync('userId');
            let toUserId = this.data.toId;
            let userInfoId = fromUserId < toUserId ? (fromUserId.toString() + toUserId.toString()) : (toUserId.toString() + fromUserId.toString());
            let content = res.data;
            let message = { fromUserId, toUserId, userInfoId, content, createTime, smsType: 'IMAGE', sysType: 1, smsStatus: 1, toUserPhoto: avatar_path, fromUserPhoto: _this.data.fromUserPhoto, smsList: false, currentPage: '', pageSize: '' }

            var EventData = _this.data.EventData;

            wx.sendSocketMessage({
              data: JSON.stringify(message),
              success() {

                EventData.push(message);

                _this.setData({
                  EventData: EventData
                })
              },
              fail() {
                console.log('sendSocketMessage:失败了')
                _this.data.sms = 1;
                _this.onShow();
              }
            })
          } else {
            util.errorTips('上传错误');
          }
        },
        fail(err) {
          console.log(err)
        },
        complete: () => {
          wx.hideLoading();
          this.scrollToBottom();
        }
      })
    }
    setTimeout(() => {
      this.scrollToBottom();
      wx.hideLoading();
    }, 300)
  },
  scrollToBottom: function () {
    this.setData({
      toView: 'row_' + (this.data.EventData.length - 1)
    });
  }
})