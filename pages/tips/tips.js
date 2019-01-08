// pages/tips/tips.js
import event from '../../utils/event';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    // items: [
    //   { name: 'Sound', value: '声音',checked:'true'},
    //   { name: 'Vibration', value: '振动', checked: 'true' },
    // ]

  },
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage(),
      list: { "Sound": wx.T.getLanguage().Sound, "Vibration": wx.T.getLanguage().Vibration },
      result: ["Sound", "Vibration"]
    });
    this.data.shouldChangeTitle = true;
  },
  // checkboxChange: function (e) {
  //   console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  // },
  onChange(e) {
    this.setData({
      result: e.detail
    });
  },

  toggle(e) {
    const { name } = e.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${name}`);
    checkbox.toggle();
  },

  noop() { },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setLanguage();
    event.on('languageChanged', this, this.setLanguage);
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
    if (this.data.shouldChangeTitle) {
      wx.T.setNavigationBarTitle();
      this.data.shouldChangeTitle = false;
    }
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