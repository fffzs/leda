// pages/language/language.js


import event from '../../utils/event'

let globalData = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // radio:'1',
    language: '',
    languages: ['简体中文', 'English'],
    langIndex: 0
  },
  // onChange(event) {
  //   const { key } = event.currentTarget.dataset;
  //   this.setData({ [key]: event.detail });
  // },

  // onClick(event) {
  //   const { value } = event.currentTarget.dataset;
  //   this.setData({
  //     radio: value
  //   });
  // },
  

  changeLanguage(e) {
    let index = e.detail.value;
    this.setData({
      langIndex: index
    });
    wx.T.setLocaleByIndex(index);
    this.setLanguage();
    event.emit('languageChanged');

    globalData.langIndex = this.data.langIndex;
    // globalData.language = globalData.languages[wx.T.langCode[this.data.langIndex]];
  },

  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
    // wx.T.setTabBarLang(this.data.langIndex);
    wx.T.setNavigationBarTitle();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      langIndex: globalData.langIndex,
    });
    this.setLanguage();
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

  }
})