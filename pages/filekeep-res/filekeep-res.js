import {getTagList} from '../../service/tagApi.js'
import {removeBillBatch} from '../../service/billApi.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    excelBills: [],
    tags:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var excelBills = wx.getStorageSync('excelBills')
    this.setData({excelBills})

    var userId = wx.getStorageSync('userId');
    getTagList(userId).then(res => {
      if (res.data.code == 200) {
        console.log(res)
        this.setData({
          tags: res.data.data
        });
      }
    })
  },
  cancelTap(){
    //批量删除识别结果
    var excel = wx.getStorageSync('excelBills');
    var ids = '';
    for (let i = 0; i < excel.length; i ++ ){
      ids += excel[i].id + " ";
    }
    removeBillBatch(ids).then(res => {
      console.log(res);
      if (res.data.code == 200){
        wx.navigateBack({
          complete() {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1500
            })
          }
        });
      }else {
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
  keepTap(){
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
    var excelBills = wx.getStorageSync('excelBills')
    this.setData({excelBills})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if (this.data.excelBills.length != 0){
      wx.removeStorageSync('excelBills')
    }
  },
})