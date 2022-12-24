import {
  getUser,
  updateUser
} from '../../service/userApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var localUserId = wx.getStorageSync('userId');
    console.log(localUserId)
    if (localUserId == undefined || localUserId == '' || options.userId == undefined || options.userId == '') {
      wx.showToast({
        title: '用户未登录',
        icon: 'error',
        duration: 2000
      })
      return false;
    }
    getUser(options.userId).then(res => {
      if (res.data.code == 200) {
        this.setData({
          userInfo: res.data.data,
          options: options
        })
      } else {
        wx.showToast({
          title: '用户未登录',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  formSubmit: function (even) {
    var user = even.detail.value;
    user.id = this.data.userInfo.id
    if (this.data.avatarUrl != undefined){
      user.avatarUrl = this.data.avatarUrl;
    }
    updateUser(user).then(res => {
      console.log("submit res: "+res)
      if (res.data.code == 200) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
        wx.setStorageSync('userInfo', res.data.data);
        wx.navigateBack({
          url: '/pages/my/my',
        })
      } else {
        wx.showToast({
          title: '保存失败',
          icon: 'error',
          duration: 2000
        })
      }
    }).catch((error) => {
      wx.showToast({
        title: '保存失败',
        icon: 'error',
        duration: 2000
      })
    });
  },
  onChooseAvatar(e) {
    var avatarUrl  = e.detail.avatarUrl
    var userInfo = this.data.userInfo;
    userInfo.avatarUrl = avatarUrl;
    console.log("avatarUrl：" + avatarUrl)
    this.setData({
      userInfo,
      avatarUrl
    })
  }
})