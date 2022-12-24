// pages/filekeep/filekeep.js
import {
  BASEURL
} from "../../service/config";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
  uploadAction: function (e) {
    var userId = wx.getStorageSync('userId');
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        const tempFilePaths = res.tempFiles
        console.log(tempFilePaths)
        wx.uploadFile({
          url: BASEURL + "/money/excel/import/" + userId,
          filePath: tempFilePaths[0].path,
          name: 'file',
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(data)
            if (data.code === 200) {
              wx.setStorageSync('excelBills', data.data)
              wx.navigateTo({
                url: '/pages/filekeep-res/filekeep-res'
              })
            } else {
              wx.showToast({
                title: '导入失败',
                icon: 'error',
                duration: 1500
              })
            }
          },
          fail: function (res) {
            wx.showToast({
              title: '导入失败',
              icon: 'error',
              duration: 1500
            })
          }
        })
      }
    })
  },
  toWanye: function () {
    console.log(111)
    wx.navigateTo({
      url: '/pages/outwebview/outwebview'
    })
  }
})