//const apiUrl = 'https://webapi.yidap.com';   // 测试
const apiUrl = 'https://apiv2.yidap.com';     // 正式
import md5 from "./md5.min.js";
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};
/*
 *  
 * @param {*} params 
 * @param {*} url String
 * @param {*} data Object
 * @param {*} success Function
 * @param {*} fail Function
 * @param {*} complete Function
 */
// id 类型或id   st 状态

// sign签名拼接方法
function MakeSign(url, Obj) {
  let newKey = Object.keys(Obj).sort()
  let newObj = {}
  for (let i = 0; i < newKey.length; i++) {
    newObj[newKey[i]] = Obj[newKey[i]]
  }
  let str = ''
  for (let key in newObj) {
    str += key + '=' + newObj[key] + '&'
  }
  let newUrl='';
  if (url.indexOf('https://webapi.yidap.com')>-1){
    newUrl = url.split('https://webapi.yidap.com')[1];
  }else{
    newUrl = url.split('https://apiv2.yidap.com')[1];
  } 
  let newStr = newUrl + '?' + str.substring(0, str.length - 1) + 'zhong_pi_lian'
  newStr = newStr.replace('sign=&', '')
  return md5(newStr)
}

const myRequest = function (params = {}, url , id, st, page) {

    return new Promise((resolve, reject) => {
        let timestamp = Date.parse(new Date());
        let data = params.data || {};
            data.timestamp    = timestamp;
            data.sign         = MakeSign(url, data);
            data.deviceId     = "wx";
            data.platformType =  "1";
            data.versionCode  = '4.0';
            
        const token = wx.getStorageSync('token') || '';
        const token_type = wx.getStorageSync('token_type') || 'Bearer';
        // data.member_token = token;
        let header = {'Accept':'application/json', 'Authorization': token_type+ ' ' +token };
        let apiUrl = url;
        if (id!=undefined){
          apiUrl = url +'/'+id
        }
        if (st != undefined) {
          apiUrl = apiUrl + '/' + st
        }
        if (page != undefined) {
          apiUrl = apiUrl + '?page=' + page
        }
        wx.request({
            url: apiUrl,
            method: params.method || 'GET',
            data,
            header,
          success(res) {
                var res = res.data;
                if (200 === res.code || 0 === res.code) {
                    resolve(res);
                } else {
                    
                    if (401 === res.code) {  
                      wx.hideLoading();
                      console.log('401统一处理');
                      let fromCenter =  wx.getStorageSync('fromCenter');
                      wx.setStorageSync('fromCenter', '0');
                      if (fromCenter!=1){
                        wx.showModal({
                          title: '您尚未登录',
                          content: '是否前往登录页面',
                          confirmText: '前往',
                          confirmColor: '#c81a29',
                          success: (res) => {
                            if (res.confirm) {
                              wx.navigateTo({
                                url: '../login/login',
                              })
                              return false;
                            } else if (res.cancel) {
                              console.log('用户点击取消')
                            }
                          }
                        })
                      }
                    }
                  if (201 === res.code){
                    wx.showToast({
                      title: res.msg,
                      icon:'none',
                      duration: 2000
                    })
                  }
                    reject(res);
                }
            },
            fail(err) {
                // 请求超时处理
                if (err.errMsg || err.errMsg === "request:fail timeout") {
                    wx.showToast({
                        title: '网络请求超时',
                        image: '../../public/images/icon/error.png',
                        duration: 3000
                    })
                    wx.hideLoading();
                }

                //reject(err);

            },
            complete(res) {
              
            }
        })
    })
};

// 根据用户ID获取用户信息
const getUserInfoformSocket = (params) => myRequest(params, `${apiUrl}/socket/getUserInfo`);

// 获取聊天记录
const getMessageBySocket = (params) => myRequest(params, `${apiUrl}/socket/getMessage`);


// 未读消息
const getCacheMessage = (params) => myRequest(params, `${apiUrl}/socket/getCacheMessage`);


module.exports = {
  apiUrl,
  getCacheMessage,
  getMessageBySocket,
  getUserInfoformSocket
}