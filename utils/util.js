function getCurrentTime() {
    var keep = '';
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var f = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    var rand = Math.round(Math.random() * 899 + 100);
    keep = y + '' + m + '' + d + '' + h + '' + f + '' + s;
    return keep; //20160614134947
}


function objLength(input) {
    var type = toString(input);
    var length = 0;
    if (type != "[object Object]") {
        //throw "输入必须为对象{}！"
    } else {
        for (var key in input) {
            if (key != "number") {
                length++;
            }

        }
    }
    return length;
}

//验证是否是手机号码
function vailPhone(number) {
    let flag = false;
    let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(19[0-9]{1})|(18[0-9]{1}|166|147))+\d{8})$/;
    if (number.length != 11) {
        flag = flag;
    } else if (!myreg.test(number)) {
        flag = flag;
    } else {
        flag = true;
    }
    return flag;
}

// 保留小数点后两位小数
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

//浮点型除法
function div(a, b) {
    var c, d, e = 0,
        f = 0;
    try {
        e = a.toString().split(".")[1].length;
    } catch (g) { }
    try {
        f = b.toString().split(".")[1].length;
    } catch (g) { }
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}

//浮点型加法函数   
function accAdd(arg1, arg2) {
    var r1, r2, m;
    try {
        r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return ((arg1 * m + arg2 * m) / m).toFixed(2);
}

//浮点型乘法
function mul(a, b) {
    var c = 0,
        d = a.toString(),
        e = b.toString();
    try {
        c += d.split(".")[1].length;
    } catch (f) { }
    try {
        c += e.split(".")[1].length;
    } catch (f) { }
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

// 遍历对象属性和值
function displayProp(obj) {
    var names = "";
    for (var name in obj) {
        names += name + obj[name];
    }
    return names;
}

// 去除字符串所有空格
function sTrim(text) {
    return text.replace(/\s/ig, '')
}

//去除所有:
function replaceMaohao(txt) {
    return txt.replace(/\:/ig, '')
}

//转换星星分数
function convertStarArray(score) {
    //1 全星,0 空星,2半星 
    var arr = []
    for (var i = 1; i <= 5; i++) {
        if (score >= i) {
            arr.push(1)
        } else if (score > i - 1 && score < i + 1) {
            arr.push(2)
        } else {
            arr.push(0)
        }
    }
    return arr
}

// 处理购物车数量输入
function dealCartNum(str) {

    let numStr = str.trim();

    numStr = numStr.replace(/\b(0+)/gi, "");

    if (numStr.length === 0) {
        return '1'
    } else if (numStr > 9999) {
        return '9999'
    } else {
        return numStr
    }

}

const successTips = (msg = '成功') => {

    wx.showToast({
        title: msg,
        // image: '../../images/icons/error.png',
        duration: 1500
    })

}

// 错误弹窗
const errorTips = (msg = '发生了错误') => {

    if(msg.length > 7){
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: 3000
        })
    }else{
        wx.showToast({
            title: msg,
            image: '../../images/error.png',
            duration: 1500
        })
    }

}
// 获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
function getNowFormatDate() {
  var date = new Date();
  var sign1 = "-";
  var sign2 = ":";
  var year = date.getFullYear() // 年
  var month = date.getMonth() + 1; // 月
  var day = date.getDate(); // 日
  var hour = date.getHours(); // 时
  var minutes = date.getMinutes(); // 分
  var seconds = date.getSeconds() //秒
  var weekArr = ['', '', '', '', '', '', ''];
  var week = weekArr[date.getDay()];
  // 给一位数数据前面加 “0”
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    day = "0" + day;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds;
  return currentdate;
}


function add0(m) { return m < 10 ? '0' + m : m }
function formatDate(shijianchuo) {
  //shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
import md5 from "./md5.min.js";
// sign签名拼接方法
function MakeSign(url, Obj) {
  let newKey = Object.keys(Obj).sort()
  let newObj = {}
  for (let i = 0; i < newKey.length; i++) {
    newObj[newKey[i]] = Obj[newKey[i]]
  }
  let str = ''
  for (let key in newObj) {
    if (newObj[key] == null) {
      str += key + '=&'
    } else if (typeof newObj[key] == 'object' && newObj[key] != null) {
      str += key + '=[object Object]&'
    } else {
      str += key + '=' + newObj[key] + '&'
    }
  }
  let newUrl = '';
  if (url.indexOf('https://devv2.yidap.com') > -1) {
    newUrl = url.split('https://devv2.yidap.com')[1];
  } else {
    newUrl = url.split('https://apiv2.yidap.com')[1];
  }
  let newStr = newUrl + '?' + str.substring(0, str.length - 1) + 'zhong_pi_lian'
  newStr = newStr.replace('sign=&', '')
  console.log('newStr:-->', newStr);
  return md5(newStr)
}

module.exports = {
    MakeSign,
    formatDate,
    getNowFormatDate,
    getCurrentTime: getCurrentTime,
    objLength: objLength,
    displayProp: displayProp,
    sTrim: sTrim,
    replaceMaohao: replaceMaohao,
    vailPhone: vailPhone,
    toDecimal2,
    div: div,
    mul: mul,
    accAdd: accAdd,
    convertStarArray: convertStarArray,

    dealCartNum,
    errorTips,
    successTips
}