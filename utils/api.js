 const apiUrl = 'https://devv2.yidap.com';     // 测试
//const apiUrl = 'https://apiv2.yidap.com';        // 正式
const versionNumber = 'v3.0.7';  // 版本号
import md5 from "./md5.min.js";
if (apiUrl == 'https://apiv2.yidap.com') {
  wx.setStorageSync('v', versionNumber + ' 正式');
} else {

  wx.setStorageSync('v', versionNumber + ' 测试');
}

Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
    );
};


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
  let newUrl = '';
  if (url.indexOf('https://devv2.yidap.com') > -1) {
    newUrl = url.split('https://devv2.yidap.com')[1];
  } else {
    newUrl = url.split('https://apiv2.yidap.com')[1];
  }
  let newStr = newUrl + '?' + str.substring(0, str.length - 1) + 'zhong_pi_lian'
  newStr = newStr.replace('sign=&', '')
  console.log('newStr:->' + newStr)
  return md5(newStr)
}

/*
 * 
 * @param {*} params 
 * @param {*} url String
 * @param {*} data Object
 * @param {*} success Function
 * @param {*} fail Function
 * @param {*} complete Function
 */

const myRequest = function (params = {}, url) {

    return new Promise((resolve, reject) => {

        let timestamp = Date.parse(new Date());
        let data = params.data || {};
        data.timestamp = timestamp;
        data.sign = MakeSign(url, data)
        data.deviceId = "wx";
        data.platformType = "2";
        data.versionCode = '4.0';
        const access_token = wx.getStorageSync('access_token') || '';

        let header = { 'content-type': 'application/json',
                        'Accept':'application/json',
                        'Authorization': `Bearer ${access_token}`
                     };

        wx.request({
            url,
            method: params.method || 'GET',
            data,
            header,
            success(res) {
                var res = res.data;

                console.log(res);

                if (200 === res.code || 0 === res.code) {
                    resolve(res);
                } else {

                    if (401 === res.code) {
                        console.log('401统一处理');

                        wx.showModal({
                            title: '提示',
                            content: '您还没有使用权限，如果您是我们公司的找(送）料员，请前往登录页登录使用系统',
                            confirmText: '前往',
                            confirmColor: '#c81a29',
                            success: (res) => {

                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '../login/login',
                                    })
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })

                    } else if (1 === res.code || -1 === res.code){
                      wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 3000
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
                        image: '../../images/error.png',
                        duration: 3000
                    })
                }

                console.log(err)

                //reject(err);

            },
            complete(res) {
              wx.hideLoading()
            }
        })


    })

};
// 获取对应openid
const getOpenid = (params) => myRequest(params, `${apiUrl}/api/member/openId`);

// 手机登录
const login = (params) => myRequest(params, `${apiUrl}/api/login`);

// 判定会员是否存在
const memberExit = (params) => myRequest(params, `${apiUrl}/api/member/exist`);

// 用户注册短信发送
const regSMS = (params) => myRequest(params, `${apiUrl}/api/sms/registerSms`);

// 注册接口
const register = (params) => myRequest(params, `${apiUrl}/api/register`);

// 用户信息
const getUserInfo = (params) => myRequest(params, `${apiUrl}/api/staff/show`);

// 首页统计
const homeData = (params) => myRequest(params, `${apiUrl}/api/staff/home`);

// 找料订单列表
const myOrderFindList = (params) => myRequest(params, `${apiUrl}/api/staff/find`);
// 取料订单列表
const myOrderFetchList = (params) => myRequest(params, `${apiUrl}/api/staff/fetch`);
// 配送订单列表
const myOrderShipList = (params) => myRequest(params, `${apiUrl}/api/staff/ship`);

// 接单去new
const receiveOrder = (params) => myRequest(params, `${apiUrl}/find/api/order_records/receive`);

// 订单已经找到
const orderBeenFound = (params) => myRequest(params, `${apiUrl}/api/staff/find/found`);

//{id} 找不到物料
const orderNotFound = (params) => myRequest(params, `${apiUrl}/api/staff/find/unfound`);

//{id} 取不到物料
const orderFetchNotFound = (params) => myRequest(params, `${apiUrl}/api/staff/fetch/unfound`);

// 订单确认送达
const orderFeedback = (params) => myRequest(params, `${apiUrl}/api/staff/ship/confirm`);

// 可接悬赏任务
const acceptableTaskList = (params) => myRequest(params, `${apiUrl}/find/api/task_rewards`);

// 领取悬赏任务
const acceptTask = (params) => myRequest(params, `${apiUrl}/find/api/task_records`);

// 已接悬赏任务
const acceptedTaskList = (params) => myRequest(params, `${apiUrl}/find/api/task_records`);

// 提交悬赏任务回执
const rewardTaskFeedback = (params) => myRequest(params, `${apiUrl}/find/api/task_records/${params.query.id}`);

// 已交悬赏详情
const rewardTaskDetail = (params) => myRequest(params, `${apiUrl}/find/api/task_records/${params.query.id}`);

// 未接悬赏任务详情
const rewardTaskDetailUnanswered = (params) => myRequest(params, `${apiUrl}/find/api/task_rewards/${params.query.id}`);

// 佣金悬赏记录
const commissionRecord = (params) => myRequest(params, `${apiUrl}/find/api/commissions`);

// 订单数量 
const orderNum = (params) => myRequest(params, `${apiUrl}/find/api/order_records/num/${params.query.id}`);

// 悬赏数量统计展示
const rewardTaskNum = (params) => myRequest(params, `${apiUrl}/find/api/task_records/num`);

// 获取formid
const saveformid = (params) => myRequest(params, `${apiUrl}/api/member/form_id`);

// 收货地址地区
const getAddress = (params) => myRequest(params, `${apiUrl}/api/region/listTree`);

// 快送佣金明细
const staffCommissions = (params) => myRequest(params, `${apiUrl}/api/staff/commissions`);

// 找料详情+接单
const findShowDetail = (params) => myRequest(params, `${apiUrl}/api/staff/find/show`);

// 找料详情+接单
const fetchShowDetail = (params) => myRequest(params, `${apiUrl}/api/staff/fetch/show`);


// 配送详情+接单
const shipShowDetail = (params) => myRequest(params, `${apiUrl}/api/staff/ship/show`);

// 确认送达
const shipShowConfirm = (params) => myRequest(params, `${apiUrl}/api/staff/ship/confirm`);





module.exports = {
  orderFetchNotFound,
  fetchShowDetail,
  shipShowConfirm,
  shipShowDetail,
  findShowDetail,
  myOrderShipList,
  myOrderFetchList,
  myOrderFindList,
    staffCommissions,
    apiUrl,
    getOpenid,
    login,
    memberExit,
    regSMS,
    register,
    getUserInfo,
    homeData,
    receiveOrder,
    orderBeenFound,
    orderNotFound,
    orderFeedback,

    acceptableTaskList,
    acceptTask,
    acceptedTaskList,
    rewardTaskFeedback,
    rewardTaskDetail,
    rewardTaskDetailUnanswered,

    commissionRecord,

    orderNum,
    rewardTaskNum,
    saveformid,

    getAddress
}