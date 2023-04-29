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
    var userId = wx.getStorageSync('userId');
    this.setData({
      userId,
      billId: options.id
    });
  },
  onShow() {
    getTagList(this.data.userId).then(res => {
      if (res.data.code == 200) {
        this.setData({
          tags: res.data.data
        });
      }
    });
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
    billInfo.billId = this.data.billId;
    updateBill(billInfo).then(res => {
      if (res.data.code === 200) {
        //修改存储实体
        var excel = wx.getStorageSync('excelBills');
        for (let i = 0; i < excel.length; i++) {
          if (excel[i].id == this.data.billId) {
            excel[i].money = billInfo.money;
            excel[i].recordTime = billInfo.recordTime;
            excel[i].tagId = billInfo.tagId;
            excel[i].type = billInfo.type;
            excel[i].details = billInfo.details
            var tags = this.data.tags;
            for (let j = 0; j < tags.length; j++) {
              if (tags[j].id == billInfo.tagId) {
                excel[i].tagDetail = tags[j].name;
                excel[i].tagIconClass = tags[j].iconClass;
                break;
              }
            }
            wx.setStorageSync('excelBills', excel)
            break;
          }
        }
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
        //修改存储实体
        var excel = wx.getStorageSync('excelBills');
        for (let i = 0; i < excel.length; i++) {
          if (excel[i].id == this.data.billId) {
            excel.splice(i, 1);
            wx.setStorageSync('excelBills', excel)
            break;
          }
        }
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