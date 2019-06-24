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
Page({
  data: {
    baseUrl:'https://webapi.yidap.com',
    sms:0,
    message_list: [
    ],
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
    userId:'',
    toUserId:'',
    to_avatar_path:'https://static.yidap.com/miniapp/o2o/imgs/collection@2x.png',
    currentPage: 2,
    pageSize: 10,
    isPull: false,
  },
  bindscrolltoupper() {
    this.data.isPull = true;
    let currentPage = this.data.currentPage++;
    let pageSize = this.data.pageSize;
    console.log('currentPage:' + currentPage);
    let _this = this;
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
    this.bindscrolltoupper();
  },
  onLoad(options){
    if (options.id) {
      this.data.toId = options.id
    } else {
      this.data.toId = options.toUserId
    }
    this.setData({
      toId: this.data.toId
    })
  },
  onUnload() {
    console.log('onUnload');
    wx.closeSocket();
  },
  onShow(){
    wx.closeSocket();
    let _this = this;
    this.data.userId = wx.getStorageSync("userId");
    this.setData({
      userId: this.data.userId 
    })
    // this.getUserInfoformSocket();
    // this.getMessageBySocket();
    console.log('连接地址：->' + 'ws://192.168.11.113:9099/notice/socket?userId=' + this.data.userId + '&toUserId=' + this.data.toId)
    let url = 'wss://im.yidap.com/notice/socket?userId=' + this.data.userId + '&toUserId=' + this.data.toId +  '&openType=1&sms=' + this.data.sms;
    wx.connectSocket({
      url,
      success(){
        console.log("connectSocket-success:连接上了");
      },
      fail(){
        console.log("connectSocket-fail:连接上了");
      }
    });
    wx.onSocketClose((res) => {
      console.log("onSocketClose:断开了");
      this.data.sms = 1;
      this.onShow();
    })
    wx.onSocketError((res) => {
      console.log('socket错误：' + res)
    })
    wx.onSocketOpen(function(res){
      console.log("onSocketOpen:连接上了");
      console.log(res);
      // if (_this.data.sms != 0) {
      //   _this.reply();
      // }
      wx.onSocketMessage(function(res){
        
        console.log("接收消息");
        if (_this.data.isPull){
          wx.showLoading({
            title: '加载中',
          })
        }
        
        let isTrue = true;
        // wx.closeSocket();
        let message_list = _this.data.message_list;
        if (_this.data.isPull) {
          _this.data.listFirstId = message_list.length;
        }

        let avatar_path  = wx.getStorageSync('avatar_path');
        if (JSON.parse(res.data).currentPage){
          let dataTjson = JSON.parse(res.data).list;
          console.log(dataTjson);
          if (dataTjson && dataTjson.length > 0) {
            dataTjson.forEach((o, i) => {
              let obj = {
                content: o.content,
                createTime: util.formatDate(o.create_time),
                fromUserId: o.from_user_id,
                toUserId: o.to_user_id,
                userInfoId: o.user_info_id,
                fromUserPhoto: o.form_user_photo,
                userInfoId: o.user_info_id,
                smsType: o.sms_type,
                smsStatus: o.sms_status,
                fromUserPhoto: 'https://ossyidap.oss-cn-shenzhen.aliyuncs.com/image/png/9EAFE4BFEFDDF762718332C8F1BE9F2C.png',
                toUserPhoto: avatar_path
              }
              if (_this.data.isPull) {
                message_list.unshift(obj);
              } else {
                message_list.push(obj);
              }
            })
            isTrue = true;
          }else{
            //util.errorTips('暂无数据');
            isTrue = false;
          }
        }else{
          let o = JSON.parse(res.data);
          
          if (o.userInfoId == _this.data.message_list[0].userInfoId) {
            o.fromUserPhoto = 'https://ossyidap.oss-cn-shenzhen.aliyuncs.com/image/png/9EAFE4BFEFDDF762718332C8F1BE9F2C.png';
            o.createTime = util.formatDate(o.createTime)
            message_list.push(o);
          }
        }
        _this.setData({
          message_list: message_list
        })
        if (_this.data.isPull) {
          if (isTrue) {
            _this.setData({
              scrollTop: 5
            })
          }
        } else {
          _this.scrollToBottom();
        }
        if (_this.data.isPull) {
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
      })
    })

  },
  getMessageBySocket(){
    let data = {}
    data.userId = wx.getStorageSync("userId");
    IMapi.getMessageBySocket({
      data
    }).then((res)=>{

    })
  },
  getUserInfoformSocket(){
    let _this = this;
    let data = {};
    data.userId = wx.getStorageSync("userId");
    IMapi.getUserInfoformSocket({
      data
    }).then((res)=>{
      this.dataset({
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
    this.data.isPull = false;
    let _this = this;
    var content = e ? e.detail.value : this.data.content;
    this.data.content = content;
    if (content == '') {
      wx.showToast({
        title: '总要写点什么吧'
      });
      return;
    }
    var message_list = this.data.message_list;
    // 发送消息
    let createTime = util.getNowFormatDate(new Date());
    let avatar_path = wx.getStorageSync("avatar_path");
    let fromUserId = wx.getStorageSync('userId');
    let toUserId = this.data.toId;
    let userInfoId = fromUserId < toUserId ? (fromUserId.toString() + toUserId.toString()) : (toUserId.toString() + fromUserId.toString());

    let message = { fromUserId, toUserId, userInfoId, content, createTime, smsType: 'TEXT', sysType: 1, smsStatus: 0, toUserPhoto: avatar_path, fromUserPhoto: 'https://ossyidap.oss-cn-shenzhen.aliyuncs.com/image/png/9EAFE4BFEFDDF762718332C8F1BE9F2C.png', smsList: false, currentPage: '', pageSize: '' }
    console.log("发送消息");
    console.log(message);
    wx.sendSocketMessage({ 
      data: JSON.stringify(message) ,
      success(){
        console.log('sendSocketMessage:成功了');
        message_list.push(message);
        message.fromUserPhoto = avatar_path;
        _this.setData({
          message_list: message_list,
          content: '' // 清空输入框文本
        })
      },
      fail(){
        console.log('sendSocketMessage:失败了')
        _this.data.sms = 1;
        _this.onShow();
      }
    })
    console.log('message_list-->');
    console.log(this.data.message_list);
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
      success:  res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths);
        // 遍历多图
        tempFilePaths.forEach( (tempFilePath) => {
          this.upload(tempFilePath, 'image');
        });
      }
    })
  },
  preview: function (e) {
    // 当前点击图片的地址
    var src = e.currentTarget.dataset.src;
    // 遍历出使用images
    var images = [];
    this.data.message_list.forEach(function (messasge) {
      if (messasge != null && messasge.msg_type == 'image') {
        images.push(messasge.content);
      }
    });
    // 预览图片
    wx.previewImage({
      urls: images,
      current: src
    });
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
      data.platformType = "2";
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
            let message = { fromUserId, toUserId, userInfoId, content, createTime, smsType: 'IMAGE', sysType: 1, smsStatus: 0, toUserPhoto: avatar_path, fromUserPhoto: 'https://ossyidap.oss-cn-shenzhen.aliyuncs.com/image/png/9EAFE4BFEFDDF762718332C8F1BE9F2C.png', smsList: false, currentPage: '', pageSize: '' }

            var message_list = _this.data.message_list;

            wx.sendSocketMessage({ 
              data: JSON.stringify(message),
              success(){
                console.log('sendSocketMessage:成功了');
                _this.data.isPull = false;
                message_list.push(message);
                _this.setData({
                  message_list: message_list
                })
              },
              fail(){
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
    }, 500)
  },
  scrollToBottom: function () {
    this.setData({
      toView: 'row_' + (this.data.message_list.length - 1)
    });
  }
})