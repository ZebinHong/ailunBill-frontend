import {
  userLogin
} from '../../service/userApi.js'
var log = require('../../log')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  onTapJump: function (event) {
    // 公共登录动作
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
      success: function (infoRes) {
        log.info("get user profile success: " + JSON.stringify(infoRes))
        userLogin(jscode, infoRes).then(res => {
          log.info("userLogin res:" + res)
          if (res.data.code === 200) {
            wx.setStorageSync('userInfo', res.data.data.user)
            wx.setStorageSync('userId', res.data.data.user.id)
            wx.setStorageSync('Authorization', res.data.data.user.openId)
            wx.setStorageSync('isindentify', true)
            that.setData({
              userinfo: res.data.data.user,
              showLogin: false
            })
            wx.switchTab({
              url: "../index/index",
              success: function () {
                console.log("jump success")
              }
            });
          }
        }).catch(err => {
          log.error("get user profile success: " + JSON.stringify(err))
        })
      },
      fail: function (err) {
        log.error("get user profile success: " + JSON.stringify(err))
        wx.switchTab({
          url: "../index/index",
          success: function () {
            console.log("jump success")
          }
        });
      }
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log("hide ... ")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("upload ... ")
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