import {
  getBillDetail,
  updateBill,
  deleteBill
} from "../../../service/billApi"
import {
  getTagList
} from '../../../service/tagApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: 0,
    billId: '',
    activeTagId: 1,
    date: '',
    money: '',
    type: 1,
    details: '',
    tags: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      billId: options.id
    });
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
    var userId = wx.getStorageSync('userId');
    this.setData({
      userId
    });
    getTagList(userId).then(res => {
      if (res.data.code == 200) {
        this.setData({
          tags: res.data.data
        });
      }
    })
    getBillDetail(this.data.billId).then(res => {
      if (res.data.code === 200) {
        var bill = res.data.data;
        let idx = bill.recordTime.indexOf(" ");
        bill.recordTime = bill.recordTime.substring(0, idx);
        this.setData({
          money: bill.money,
          activeTagId: bill.tagId,
          type: bill.type,
          date: bill.recordTime,
          details: bill.details
        })
        console.log(res)
      } else {
        wx.showToast({
          title: '获取数据失败',
          icon: 'error',
          duration: 2000
        })
      }
    })
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
  onTagTap: function (event) {
    var targetId = event.currentTarget.dataset.id;
    var tags = this.data.tags;
    console.log(targetId)
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
    var billInfo = event.detail.value
    //校验
    if (billInfo.money == '' || billInfo.money == undefined) {
      wx.showToast({
        title: '金额不能为空',
        icon: 'error',
        duration: 1500
      })
      return false;
    } else if (!(/^(-?\d+)(\.\d+)?$/.test(billInfo.money))) {
      wx.showToast({
        title: '金额格式错误',
        icon: 'error',
        duration: 1500
      })
      return false;
    }
    billInfo.tagId = this.data.activeTagId + ''
    billInfo.userId = wx.getStorageSync('userId');

    var util = require('../../../utils/util.js')
    var recordTime = this.data.date;
    if (recordTime === '') { //当显示为今天时
      recordTime = util.formatDate(new Date());
    }

    let date = new Date();
    let s = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    billInfo.recordTime = recordTime + " " + s;
    console.log(billInfo)
    billInfo.billId = this.data.billId;
    updateBill(billInfo).then(res => {
      if (res.data.code === 200) {
        wx.navigateBack({
          complete: function () {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      } else {
        wx.showToast({
          title: '修改失败',
          icon: 'error',
          duration: 2000
        })
      }
    }).catch(err => {
      wx.showToast({
        title: 修改失败,
        icon: 'error',
        duration: 2000
      })
    })
  },
  deleteTap: function () {
    deleteBill(this.data.billId).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        wx.navigateBack({
          complete: function () {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1500
            })
          }
        })
      } else {
        wx.navigateBack({
          complete: function () {
            wx.showToast({
              title: '删除失败',
              icon: 'error',
              duration: 1500
            })
          }
        })
      }
    })
  }
})