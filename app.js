import locales from './utils/locales';
import T from './utils/i18n';

// T.registerLocale(locales);	// (1)
// T.setLocaleByIndex(wx.getStorageSync('langIndex') || 0);	// (2)
// wx.T = T;	// (3)
T.registerLocale(locales);
let savedGlobalData = wx.getStorageSync('globalData');
let langIndex = savedGlobalData.langIndex || 0;
T.setLocaleByIndex(langIndex);
wx.T = T;

App({

  globalData: {},
  buf2hex: function (buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
  },
  buf2string: function (buffer) {
    var arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
    var str = ''
    for (var i = 0; i < arr.length; i++) {
      str += String.fromCharCode(arr[i])
    }
    return str
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    this.globalData = savedGlobalData || {
      // Language settings
      langIndex: 0,
      languages: locales,
      language: locales['zh-Hans'],
    };
    this.globalData.SystemInfo = wx.getSystemInfoSync()
    

    // load all update in locales.js
    this.globalData.language = wx.T.getLanguage();
    //console.log(this.globalData.SystemInfo)
  },
  globalData: {
    SystemInfo: {}
  },
  getModel: function () { //获取手机型号
    return this.globalData.SystemInfo["model"]
  },
  getVersion: function () { //获取微信版本号
    return this.globalData.SystemInfo["version"]
  },
  getSystem: function () { //获取操作系统版本
    return this.globalData.SystemInfo["system"]
  },
  getPlatform: function () { //获取客户端平台
    return this.globalData.SystemInfo["platform"]
  },
  getSDKVersion: function () { //获取客户端基础库版本
    return this.globalData.SystemInfo["SDKVersion"]
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    wx.setStorage({
      key: 'globalData',
      data: this.globalData
    });
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
