import {addBill} from '../../service/billApi.js'
import {getTagList} from '../../service/tagApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: [
    ],
    activeTagId: 1,
    date: '',
    money: '',
    type: 1,
    details: '',
    userId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = wx.getStorageSync('userId');
    this.setData({userId})
    getTagList(userId).then(res => {
      if (res.data.code == 200){
        this.setData({tags: res.data.data});
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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

  },
  onTagTap: function (event) {
    var targetId = event.currentTarget.dataset.id;
    var tags = this.data.tags;
    for (let idx in tags) {
      if (tags[idx].id === targetId) {
        this.setData({
          activeTagId: targetId
        })
      }
    }
  },
  bindDataChange: function (event) {
    this.setData({
      date: event.detail.value
    })
  },
  formSubmit: function (event) {
    var that = this;
    var billInfo = event.detail.value

    //校验
    if (billInfo.money == '' || billInfo.money == undefined) {
      wx.showToast({
        title: '金额不能为空',
        icon: 'error',
        duration: 1500
      })
      return false;
    }else if (!(/^(-?\d+)(\.\d+)?$/.test(billInfo.money))) {

      wx.showToast({
        title: '金额格式错误',
        icon: 'error',
        duration: 1500
      })
      return false;
    }

    billInfo.tagId = this.data.activeTagId + ''
    billInfo.userId = this.data.userId;

    var util = require('../../utils/util.js')
    var recordTime = this.data.date;
    if (recordTime === '') { //当显示为今天时
      recordTime = util.formatDate(new Date());
    }

    let date = new Date();
    let s = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    billInfo.recordTime = recordTime + " " + s;
    addBill(billInfo).then(res => {
      if (res.data.code === 200) {
        wx.showModal({
          title: '录入成功',
          content: '是否继续录入账单？',
          success: function (res) {
            if (res.confirm) { //这里是点击了确定以后
              console.log('用户点击确定')
              that.setData({
                activeTagId: 1,
                date: '',
                money: '',
                type: 1,
                details:''
              })
            } else { //这里是点击了取消以后
              console.log('用户点击取消')
              wx.switchTab({
                url: '/pages/bill/bill',
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'error',
          duration: 1500
        })
      }
    }).catch(err => {
      wx.showToast({
        title: err.errMsg,
        icon: 'error',
        duration: 1500
      })
    })
  },
})