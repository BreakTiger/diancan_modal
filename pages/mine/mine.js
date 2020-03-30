const request = require('../../utils/http.js')
import modals from '../../utils/modal.js'
let template = require('../../templates/tabline/tabline.js')
const app = getApp()

Page({

  data: {
    id:null,
    users: {}
  },

  onLoad: function(options) {
    console.log(options)
    let id = options.id || ''
    this.setData({
      id:id
    })
    // 底部导航
    template.tabbar("tabBar", 2, this)
    this.getUser()
  },

  // 用户信息
  getUser: function() {
    let that = this
    let url = app.globalData.api + '?s=wxapi/Person/info'
    let data = {
      token: wx.getStorageSync('token')
    }
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          that.setData({
            users: res.data.data
          })
        } else if (res.data.code == 10000) {
          modals.showToast(res.data.msg, 'none')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 绑定手机
  setPhone: function(e) {
    console.log(e)
    console.log(e.detail)
    let that = this
    let data = {
      token: wx.getStorageSync('token'),
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }
    let url = app.globalData.api + '?s=wxapi/Person/bind_phone'
    request.sendRequest(url, 'post', data, {
      'content-type': 'application/json'
    }).then(function(res) {
      if (res.statusCode == 200) {
        if (res.data.code == 200) {
          modals.showToast(res.data.msg, 'none')
          that.getUser()
        } else if (res.data.code == 10000) {
          modals.showToast(res.data.msg, 'none')
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else {
          modals.showToast(res.data.msg, 'none')
        }
      } else {
        modals.showToast('系统繁忙，请稍后重试', 'none')
      }
    })
  },

  // 我的订单
  toOrder: function() {
    wx.navigateTo({
      url: '/pages/order/order',
    })
  },

  //我的预定
  toReserve: function() {
    // wx.navigateTo({
    //   url: '/pages/reserve/reserve',
    // })
  }
})