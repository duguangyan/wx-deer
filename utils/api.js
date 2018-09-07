// const apiUrl = 'https://devv2.yidap.com';     // 测试
const apiUrl = 'https://apiv2.yidap.com';        // 正式
const versionNumber = 'v2.4.5';  // 版本号

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

        let data = params.data || {};

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
                            content: '您还没有使用权限，如果您是我们公司的找料员，请前往登录页登录使用系统',
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
const getUserInfo = (params) => myRequest(params, `${apiUrl}/api/show`);

// 首页统计
const homeData = (params) => myRequest(params, `${apiUrl}/find/api/home`);

// 订单列表
const myOrderList = (params) => myRequest(params, `${apiUrl}/find/api/order_records/index/${params.query.task_type}/${params.query.type}`);

// 接单去new
const receiveOrder = (params) => myRequest(params, `${apiUrl}/find/api/order_records/receive`);

// 订单已经找到
const orderBeenFound = (params) => myRequest(params, `${apiUrl}/find/api/order_records/found/${params.query.id}`);

//{id} 找不到物料
const orderNotFound = (params) => myRequest(params, `${apiUrl}/find/api/order_records/unfound/${params.query.id}`);

// 订单确认送达
const orderFeedback = (params) => myRequest(params, `${apiUrl}/find/api/order_records/shipped/${params.query.id}`);

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

module.exports = {
    apiUrl,
    getOpenid,
    login,
    memberExit,
    regSMS,
    register,
    getUserInfo,
    homeData,

    myOrderList,
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