// pages/chatList/chatList.js
const IMapi = require('../../utils/IMapi.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 180,
    list: [
      {
        img:'https://static.yidap.com/miniapp/o2o_find/index/index_banner_2.png',
        title: "小鹿小鹿",
        text: "快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑",
        time: "2018-09-22",
        txtStyle: "",
      },
      {
        img: 'https://static.yidap.com/miniapp/o2o_find/index/index_banner_2.png',
        title: "小鹿小鹿",
        text: "快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑",
        time: "2018",
        txtStyle: "",
      }, {
        img: 'https://static.yidap.com/miniapp/o2o_find/index/index_banner_2.png',
        title: "小鹿小鹿",
        text: "快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑",
        time: "2018",
        txtStyle: "",
      }, {
        img: 'https://static.yidap.com/miniapp/o2o_find/index/index_banner_2.png',
        title: "小鹿小鹿",
        text: "快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑",
        time: "2018"
      }, {
        img: 'https://static.yidap.com/miniapp/o2o_find/index/index_banner_2.png',
        title: "小鹿小鹿",
        text: "快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑",
        time: "2018"
      }, {
        img: 'https://static.yidap.com/miniapp/o2o_find/index/index_banner_2.png',
        title: "小鹿小鹿",
        text: "快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑",
        time: "2018"
      }, {
        img: 'https://static.yidap.com/miniapp/o2o_find/index/index_banner_2.png',
        title: "小鹿小鹿",
        text: "快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑",
        time: "2018"
      }, {
        img: 'https://static.yidap.com/miniapp/o2o_find/index/index_banner_2.png',
        title: "小鹿小鹿",
        text: "快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑",
        time: "2018"
      }, {
        img: 'https://static.yidap.com/miniapp/o2o_find/index/index_banner_2.png',
        title: "小鹿小鹿",
        text: "快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑快跑",
        time: "2018"
      },
    ],
    lists:[],
    startX: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
     this.initEleWidth();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.closeSocket();
    // this.getCacheMessage();
    let userId = wx.getStorageSync('userId');
    console.log('userId:' + userId);
    wx.connectSocket({
      url: 'wss://im.yidap.com/notice/socket?userId=' + userId + '&openType=1'
    });
    let _this = this;
    wx.onSocketOpen(function (res) {
      console.log("连接上了");
      console.log(res);
      wx.onSocketMessage(function (res) {
        console.log("接收消息");
        console.log(res);
        //let lists = _this.data.lists;
        
        let resLists = JSON.parse(res.data);
        if (resLists.length>0){
          let chatListIds = wx.getStorageSync('chatListIds') || [];
          
          resLists.forEach((o,i)=>{
            chatListIds.forEach((oo,ii)=>{
              if (oo == o.to_user_id) {
                o.isRead = false
              }
            })
          })
          _this.setData({
            lists: resLists
          })
        }else{
          let ii = 0;
          _this.data.lists.forEach((o,i)=>{
            if (resLists.fromUserId == o.to_user_id){
              ii++;
              _this.data.lists[i].userMessage[0].content = resLists.content;
              _this.data.lists[i].userMessage[0].sms_type = resLists.smsType;
              _this.data.lists[i].isRead = true;
              let chatListIds = wx.getStorageSync('chatListIds') ||[];
             
              if (resLists.to_user_id == o){
                chatListIds.splice(i,1);
                wx.setStorageSync('chatListIds', chatListIds);
              }
                
            
            }
          })
          if(ii == 0){
            resLists.isRead = false;
            _this.data.lists.push(resLists);
          }
          _this.setData({
            lists: _this.data.lists
          })
        }
        // resLists.forEach((o,i)=>{
        //   lists.push(o)
        // })
        
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide');
    
    wx.closeSocket();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload');
    wx.closeSocket();
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
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，说明向右滑动，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
    
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件
  delItem: function (e) {
    //获取列表中要删除项的下标
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    //移除列表中下标为index的项
    list.splice(index, 1);
    //更新列表的状态
    this.setData({
      list: list
    });
  },
  getCacheMessage(){
    IMapi.getCacheMessage({
      data:{
        receiveUserId :1,
        sendUserId :2
      }
    }).then((res)=>{
        this.setData({
          list:res.data
        })
    })
  },
  goChat(e){
    let toUserId = e.currentTarget.dataset.id; 
    let chatListIndex    = e.currentTarget.dataset.index;
    let oldArr = wx.getStorageSync('chatListIds') || [];
    if (oldArr.length > 0) {
      oldArr.forEach((o, i) => {
        if (o != toUserId) {
          oldArr.push(toUserId);
        }
      })
    } else {
      oldArr.push(toUserId);
    }
    
    wx.setStorageSync('chatListIds', oldArr);
    wx.navigateTo({
      url: '../chat/chat?toUserId=' + toUserId + "&chatListIndex=" + chatListIndex,
    })
  }
})