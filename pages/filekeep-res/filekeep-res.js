import {
  getTagList
} from '../../service/tagApi.js'
import {
  removeBillBatch
} from '../../service/billApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    excelBills: [],
    tags: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
  },
  cancelTap() {
    //批量删除识别结果
    var excel = wx.getStorageSync('excelBills');
    var ids = '';
    for (let i = 0; i < excel.length; i++) {
      ids += excel[i].id + " ";
    }
    removeBillBatch(ids).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        wx.navigateBack({
          complete() {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1500
            })
          }
        });
      } else {
        wx.navigateBack({
          complete() {
            wx.showToast({
              title: '删除出错',
              icon: 'error',
              duration: 1500
            })
          }
        });
      }
    })
  },
  keepTap() {
    wx.navigateBack({
      complete() {
        wx.showToast({
          title: '导入成功',
          icon: 'success',
          duration: 1500
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var userId = wx.getStorageSync('userId');
    var excelBills = wx.getStorageSync('excelBills');
    getTagList(userId).then(res => {
      if (res.data.code == 200) {
        this.setData({
          tags: res.data.data
        });
        var bills = excelBills, tags = res.data.data;
        for (var i = 0; i < bills.length; i++) {
          for (var j = 0; j < tags.length; j++) {
            if (bills[i].tagId == tags[j].id) {
              bills[i].iconClass = tags[j].iconClass;
              break;
            }
          }
        }
        this.setData({
          excelBills: bills
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if (this.data.excelBills.length != 0) {
      wx.removeStorageSync('excelBills')
    }
  },
})