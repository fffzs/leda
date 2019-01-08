import event from '../../utils/event';
const app = getApp()
let globalData = getApp().globalData;
Page({
  data: {
    searching: false,
    devicesList: [],

  },
  setLanguage() {
    this.setData({
      language: wx.T.getLanguage()
    });
    this.data.shouldChangeTitle = true;
  },
  Search: function() {
    var that = this;
    wx.hideLoading()
    if (!that.data.searching) {
      wx.closeBluetoothAdapter({
        complete: function(res) {
          setTimeout(function() {
            console.log(res)
            wx.openBluetoothAdapter({
              success: function(res) {
                setTimeout(function() {
                  console.log(res)
                  wx.getBluetoothAdapterState({
                    success: function(res) {
                      console.log(res)
                    }
                  })
                  wx.startBluetoothDevicesDiscovery({
                    allowDuplicatesKey: false,
                    success: function(res) {
                      console.log(res)
                      that.setData({
                        searching: true,
                        devicesList: [],
                        connected: false,
                        deviceId: '',
                        name: ''
                      })
                    }
                  })
                }, 500)

              },
              fail: function(res) {
                console.log(res)
                wx.showModal({
                  title: wx.T.getLanguage().tip,
                  content: wx.T.getLanguage().openBT,
                  showCancel: false,
                  success: function(res) {
                    that.setData({
                      searching: false,
                      connected: false,
                      deviceId: '',
                      name: ''
                    })
                  }
                })
              }
            })
          }, 500)

        }
      })
    } else {
      wx.stopBluetoothDevicesDiscovery({
        success: function(res) {
          console.log(res)
          that.setData({
            searching: false,
          })
        }
      })
    }
  },
  Connect: function(e) {
    var that = this;
    var advertisData, name;
    console.log(e.currentTarget.id)
    for (var i = 0; i < that.data.devicesList.length; i++) {
      if (e.currentTarget.id == that.data.devicesList[i].deviceId) {
        name = that.data.devicesList[i].name
        advertisData = that.data.devicesList[i].advertisData
      }
    }
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        console.log(res)
        that.setData({
          searching: false,
        })
      }
    })
    wx.getConnectedBluetoothDevices({
      success: function(res) {
        console.log(res);
        if (res.devices[0] != null) {
          wx.closeBLEConnection({
            deviceId: res.devices[0].deviceId,
            success: function(res) {
              setTimeout(function() {
                console.log(res);
                that.setData({
                  connected: false,
                  deviceId: '',
                  name: ''
                })
              }, 500)

            }
          })
        }
      }
    })

    wx.showLoading({
      title: wx.T.getLanguage().connectBT,
    })
    // if (advertisData == '4b43' + e.currentTarget.id.split(":").join("").toLowerCase() || 
    //   advertisData == '4b43' + e.currentTarget.id.split(":").reverse().join("").toLowerCase()){
    wx.createBLEConnection({
      deviceId: e.currentTarget.id,
      timeout: 5000,
      success: function(res) {
        setTimeout(function() {
          console.log(res)

          wx.getBLEDeviceServices({
            deviceId: e.currentTarget.id,
            success: function(res) {
              console.log('getBLEDeviceServices' + res.services)
              that.setData({
                services: res.services
              })

              wx.getBLEDeviceCharacteristics({
                deviceId: e.currentTarget.id,
                serviceId: "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2",
                success: function(res) {
                  console.log(res.characteristics)
                  that.setData({
                    characteristics: res.characteristics
                  })
                  wx.notifyBLECharacteristicValueChange({
                    state: true,
                    deviceId: e.currentTarget.id,
                    serviceId: "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2",
                    characteristicId: that.data.characteristics[0].uuid,
                    success: function(res) {
                      console.log('启用notify成功')
                      wx.hideLoading()
                      wx.showToast({
                        title: wx.T.getLanguage().connectSuccess,
                        icon: 'success',
                        duration: 1000
                      })
                      that.setData({
                        deviceId: e.currentTarget.id,
                        name: name,
                        connected: true,
                      })
                    },
                    fail: function(res) {
                      wx.closeBLEConnection({
                        deviceId: e.currentTarget.id,
                        success: function(res) {
                          setTimeout(function() {
                            console.log(res);
                            that.setData({
                              connected: false,
                              deviceId: '',
                              name: ''
                            })
                            wx.hideLoading()
                            wx.showModal({
                              title: wx.T.getLanguage().tip,
                              content: wx.T.getLanguage().connNotifyFail,
                              showCancel: false
                            })
                          }, 500)

                        },
                      })
                      console.log('启用notify失败')
                    }
                  })
                },
                fail: function(res) {
                  console.log(res)
                  wx.closeBLEConnection({
                    deviceId: e.currentTarget.id,
                    success: function(res) {
                      setTimeout(function() {
                        console.log(res);
                        that.setData({
                          connected: false,
                          deviceId: '',
                          name: ''
                        })
                        wx.hideLoading()
                        wx.showModal({
                          title: wx.T.getLanguage().tip,
                          content: wx.T.getLanguage().connCharacteristicFail,
                          showCancel: false
                        })
                      }, 500)

                    },
                  })
                }
              })


            },
            fail: function(res) {
              console.log(res)
              wx.closeBLEConnection({
                deviceId: e.currentTarget.id,
                success: function(res) {
                  setTimeout(function() {
                    console.log(res);
                    that.setData({
                      connected: false,
                      deviceId: '',
                      name: ''
                    })
                    wx.hideLoading()
                    wx.showModal({
                      title: wx.T.getLanguage().tip,
                      content: wx.T.getLanguage().connServiceFail,
                      showCancel: false
                    })
                  }, 500)

                },
              })
            }
          })
        }, 500)


      },
      fail: function(res) {
        console.log(res)
        wx.hideLoading()
        wx.showModal({
          title: wx.T.getLanguage().tip,
          content: wx.T.getLanguage().connUnknownFail,
          showCancel: false
        })
      },
    })
    // }else{
    //   wx.hideLoading()
    //   wx.showModal({
    //     title: wx.T.getLanguage().tip,
    //     content: '连接失败，非本司产品',
    //     showCancel: false
    //   })
    // }

  },
  Selftest: function(e) {
    var that = this
    if (that.data.connected) {
      var buffer = new Uint8Array([0x12, 0x54]);
      wx.writeBLECharacteristicValue({
        deviceId: that.data.deviceId,
        serviceId: 'E7810A71-73AE-499D-8C15-FAA9AEF0C3F2',
        characteristicId: 'BEF8D6C9-9C21-4C9E-B632-BD58C1009F9F',
        value: buffer.buffer,
        success: function(res) {
          console.log(res)
        }
      })
    } else {
      wx.showModal({
        title: wx.T.getLanguage().tip,
        content: wx.T.getLanguage.disconnBT,
        showCancel: false,
        success: function(res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  onLoad: function(options) {
    var that = this
    this.setLanguage();
    event.on('languageChanged', this, this.setLanguage);
    wx.getConnectedBluetoothDevices({
      success: function(res) {
        console.log(res);
        if (res.devices[0] != null) {
          that.setData({
            deviceId: res.devices[0].deviceId,
            name: res.devices[0].name,
            connected: true,
          })
        }
      }
    })
    wx.onBluetoothAdapterStateChange(function(res) {
      console.log(res)
      that.setData({
        searching: res.discovering
      })
      if (!res.available) {
        that.setData({
          searching: false,
        })
      }
    })
    wx.onBluetoothDeviceFound(function(devices) {
      //剔除重复设备，兼容不同设备API的不同返回值
      var isnotexist = true
      if (devices.deviceId) {
        if (devices.advertisData) {
          devices.advertisData = app.buf2hex(devices.advertisData)
        } else {
          devices.advertisData = ''
        }
        console.log(devices)
        for (var i = 0; i < that.data.devicesList.length; i++) {
          if (devices.deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist) {
          that.data.devicesList.push(devices)
        }
      } else if (devices.devices) {
        if (devices.devices[0].advertisData) {
          devices.devices[0].advertisData = app.buf2hex(devices.devices[0].advertisData)
        } else {
          devices.devices[0].advertisData = ''
        }
        console.log(devices.devices[0])
        for (var i = 0; i < that.data.devicesList.length; i++) {
          if (devices.devices[0].deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist) {
          that.data.devicesList.push(devices.devices[0])
        }
      } else if (devices[0]) {
        if (devices[0].advertisData) {
          devices[0].advertisData = app.buf2hex(devices[0].advertisData)
        } else {
          devices[0].advertisData = ''
        }
        console.log(devices[0])
        for (var i = 0; i < devices_list.length; i++) {
          if (devices[0].deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist) {
          that.data.devicesList.push(devices[0])
        }
      }
      that.setData({
        devicesList: that.data.devicesList
      })
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
    if (this.data.searching) {
      wx.stopBluetoothDevicesDiscovery({
        success: function(res) {
          console.log(res)
          that.setData({
            searching: false,
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
    if (this.data.searching) {
      wx.stopBluetoothDevicesDiscovery({
        success: function(res) {
          console.log(res)
          that.setData({
            searching: false,
          })
        }
      })
    }
  }
})