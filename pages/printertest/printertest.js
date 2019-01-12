import event from '../../utils/event';
import Toast from '../../dist/toast/toast';
const app = getApp()
let globalData = getApp().globalData;
Page({
  data: {
    testing: false,
    testnum: 1,
    j: 1,
    deviceId: '02:12:19:3D:2B:3C',
    successnum: 0,
    failnum: 0,
    progress: 0,
  },
  onChange(event) {
    // event.detail 为当前输入的值
    if (event.detail != null) {
      this.data.deviceId = event.detail;
    }
    console.log(event.detail);
  },
  onChange1(event) {
    // event.detail 为当前输入的值
    this.setData({
      testnum: event.detail
    })
    console.log(event.detail);
  },
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
    this.data.shouldChangeTitle = true;
  },
  StartTest: function() {
    if (this.data.testnum != "" && this.data.deviceId != "") {
      var that = this
      console.log("that.data.successnum=" + that.data.successnum)
      console.log("that.data.failnum=" + that.data.failnum)
      wx.closeBluetoothAdapter({
        complete: function(res) {
          that.setData({
            testing: true
          })
          setTimeout(function() {
            wx.openBluetoothAdapter({
              success: function(res) {
                setTimeout(function() {
                  console.log(res)
                  wx.getBluetoothAdapterState({
                    success: function(res) {
                      console.log(res)

                    }
                  })
                  // wx.startBluetoothDevicesDiscovery({
                  //   allowDuplicatesKey: false,
                  //   success: function (res) {
                  //     console.log(res)
                  //     that.setData({
                  //       searching: true,
                  //       devicesList: [],
                  //     })
                  //   }
                  // })
                  // for (var j = 1; j <= that.data.testnum; j++) {

                  // wx.closeBLEConnection({
                  // deviceId: that.data.deviceId,
                  // complete: function (res) {
                  // setTimeout(function(){
                  console.log("**************第" + that.data.j + "次测试开始******************");
                  wx.createBLEConnection({
                    deviceId: that.data.deviceId,
                    timeout: 10000,
                    success: function(res) {
                      setTimeout(function() {
                        console.log(res)

                        wx.getBLEDeviceServices({
                          deviceId: that.data.deviceId,
                          success: function(res) {
                            setTimeout(function() {
                              console.log(res.services)
                              that.setData({
                                services: res.services,
                              })

                              wx.getBLEDeviceCharacteristics({
                                deviceId: that.data.deviceId,
                                serviceId: "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2",
                                success: function(res) {
                                  setTimeout(function() {
                                    console.log(res.characteristics)
                                    that.setData({
                                      characteristics: res.characteristics,
                                    })
                                    wx.notifyBLECharacteristicValueChange({
                                      state: true,
                                      deviceId: that.data.deviceId,
                                      serviceId: "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2",
                                      characteristicId: that.data.characteristics[0].uuid,
                                      success: function(res) {
                                        setTimeout(function() {
                                          console.log('*************************测试成功！第' + that.data.j + '次******************')
                                          console.log('启用notify成功')
                                          that.data.j++
                                            wx.closeBLEConnection({
                                              deviceId: that.data.deviceId,
                                              complete: function(res) {
                                                wx.closeBluetoothAdapter({
                                                  complete: function(res) {
                                                    that.data.successnum++
                                                      that.data.progress = (that.data.successnum + that.data.failnum) / that.data.testnum * 100
                                                    that.setData({
                                                      successnum: that.data.successnum,
                                                      progress: that.data.progress,
                                                    })
                                                    if (that.data.j <= that.data.testnum) {

                                                      that.setData({
                                                        testing: true
                                                      })
                                                      that.StartTest()
                                                    } else {
                                                      that.setData({
                                                        testing: false
                                                      })
                                                      that.data.j = 1
                                                    }
                                                  },
                                                })

                                              },
                                            })

                                          // wx.hideLoading()
                                          // wx.showToast({
                                          //   title: '连接成功',
                                          //   icon: 'success',
                                          //   duration: 1000
                                          // })
                                        }, 1000)


                                      },
                                      fail: function(res) {
                                        wx.closeBLEConnection({
                                          deviceId: that.data.deviceId,
                                          success: function(res) {
                                            that.data.failnum++
                                              that.setData({
                                                testing: false,
                                                failnum: that.data.failnum
                                              })

                                            setTimeout(function() {
                                              console.log(res);
                                              console.log('****************************************************************************************************************************************************************第' + that.data.j + '次失败了！**************************************************************************************************************************************************************************************************************************************************')
                                              wx.hideLoading()
                                              wx.showModal({
                                                title: wx.T.getLanguage().tip,
                                                content: wx.T.getLanguage().connNotifyFail,
                                                showCancel: false
                                              })
                                            }, 1000)

                                          },
                                        })
                                        console.log('启用notify失败')
                                      }
                                    })
                                  }, 1000)

                                },
                                fail: function(res) {
                                  console.log(res)
                                  wx.closeBLEConnection({
                                    deviceId: that.data.deviceId,
                                    success: function(res) {
                                      that.data.failnum++
                                        that.setData({
                                          testing: false,
                                          failnum: that.data.failnum
                                        })
                                      setTimeout(function() {
                                        console.log(res);
                                        console.log('*****************************************************************************************************************************************************************************************第' + that.data.j + '次失败了！**********************************************************************************************************************************************************************************************************************************************************')
                                        wx.hideLoading()
                                        wx.showModal({
                                          title: wx.T.getLanguage().tip,
                                          content: wx.T.getLanguage().connCharacteristicFail,
                                          showCancel: false
                                        })
                                      }, 1000)

                                    },
                                  })
                                }
                              })
                            }, 1000)



                          },
                          fail: function(res) {
                            console.log(res)
                            wx.closeBLEConnection({
                              deviceId: that.data.deviceId,
                              success: function(res) {
                                that.data.failnum++
                                  that.setData({
                                    testing: false,
                                    failnum: that.data.failnum
                                  })
                                setTimeout(function() {
                                  console.log(res);
                                  console.log('*********************************************************************************************************************************************************************************************************************************************************第' + that.data.j + '次失败了！********************************************************************************************************************************************************************************************************************************************')
                                  wx.hideLoading()
                                  wx.showModal({
                                    title: wx.T.getLanguage().tip,
                                    content: wx.T.getLanguage().connServiceFail,
                                    showCancel: false
                                  })
                                }, 1000)

                              },
                            })
                          }
                        })
                      }, 1000)


                    },
                    fail: function(res) {
                      that.data.failnum++
                        that.setData({
                          testing: false,
                          failnum: that.data.failnum
                        })
                      console.log(res)
                      console.log('************************************************************************************************************************************************************************************第' + that.data.j + '次失败了！*******************************************************************************************************************************************************************************************************************************************************************')
                      wx.hideLoading()
                      wx.showModal({
                        title: wx.T.getLanguage().tip,
                        content: wx.T.getLanguage().connUnknownFail,
                        showCancel: false
                      })

                    },
                  })
                  // },1500)

                  // },
                  // })

                  // }

                }, 1000)

              },
              fail: function(res) {
                console.log(res)
                wx.showModal({
                  title: wx.T.getLanguage().tip,
                  content: wx.T.getLanguage().openBT,
                  showCancel: false,
                  success: function(res) {
                    that.data.failnum++
                      that.setData({
                        testing: false,
                        failnum: that.data.failnum
                      })
                  }
                })
              }
            })
          }, 1000)

        },
      })
    } else {
      Toast.fail("有必填项为空！")
    }

  },
  StopTest: function() {
    var that = this
    wx.closeBluetoothAdapter({
      complete: function(res) {
        console.log(res)
        that.setData({
          testing: false
        })
      },
    })
  },

  onLoad: function(options) {
    this.setLanguage();
    event.on('languageChanged', this, this.setLanguage);
    wx.onBluetoothAdapterStateChange(function(res) {
      console.log(res)
      that.setData({
        testing: res.discovering
      })
      if (!res.available) {
        that.setData({
          testing: false,
        })
      }
    })
  },
  onReady: function() {

  },
  onShow: function() {
    if (this.data.shouldChangeTitle) {
      wx.T.setNavigationBarTitle();
      this.data.shouldChangeTitle = false;
    }
  },
  onHide: function() {
    var that = this
    that.setData({
      devicesList: []
    })
    if (this.data.testing) {
      wx.stopBluetoothDevicesDiscovery({
        success: function(res) {
          console.log(res)
          that.setData({
            testing: false,
          })
        }
      })
    }
  },
  onUnload: function() {
    var that = this
    that.setData({
      devicesList: []
    })
    if (this.data.testing) {
      wx.stopBluetoothDevicesDiscovery({
        success: function(res) {
          console.log(res)
          that.setData({
            testing: false,
          })
        }
      })
    }
  }
})