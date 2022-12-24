import {
  userLogin
} from '../../service/userApi.js'
const app = getApp()
var log = require('../../log')
Page({
  data: {
    tabbar: {},
    userInfo: {},
    showLogin: false
  },
  // 公共登录动作
  getUserProfile(e) {
    var jscode = "";
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          jscode = res.code;
          log.info("jscode:" + jscode)
        } else {
          log.error('登录失败！' + res.errMsg)
        }
      }
    })

    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '加载用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (infoRes) => {
        log.info("get user profile success: " + JSON.stringify(infoRes))
        userLogin(jscode, infoRes).then(res => {
          log.info("userLogin res:" + JSON.stringify(res))
          if (res.data.code === 200) {
            wx.setStorageSync('userInfo', res.data.data.user)
            wx.setStorageSync('userId', res.data.data.user.id)
            wx.setStorageSync('Authorization', res.data.data.user.openId)
            wx.setStorageSync('isindentify',res.data.data.user.isindentify)
            that.setData({
              userInfo:res.data.data.user,
              showLogin:false
            })
          }
        }).catch(err => {
          log.error("get user profile success: " + JSON.stringify(err))
        })
      }
    })

  },
  onShow: function (options) {
    var that = this;
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    } else {    
      that.setData({
        showLogin: true
      })
    }
  },
  onLoad: function () {
    app.editTabbar();
  },
  logoutTap(){
    wx.clearStorageSync()
    wx.showToast({
      title: '退出成功',
      icon: 'success',
      duration: 1500,
      
    })
    this.onShow()
  },
  noDevTap(){
    wx.showToast({
      title: '该功能待开发',
      icon: 'error',
      duration: 1500
    })
  }
})