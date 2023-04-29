import {
  getBillList
} from "../../service/billApi"
import {
  getTagList
} from '../../service/tagApi.js'

var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    userId: 0,
    pageNum: 1,
    pageSize: 10,
    year: '',
    month: '',
    tagId: 8,
    tagName: '全部',
    tagClass: 'iconfont icon-quanbu',
    tags: [],
    isBottom: true,
    bills: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
  },
  getBillPage: function (userId, pageNum, pageSize, date, tagId) {
    wx.showNavigationBarLoading();
    getBillList(userId, pageNum, pageSize, date, tagId).then(res => {
        if (res.data.code === 200) {
          var bills = res.data.data.records;
          if (bills.length < pageSize || (bills.length == pageSize && res.data.data.current == res.data.data.pages)) {
            this.setData({
              isBottom: true
            });
          } else {
            this.setData({
              isBottom: false
            });
          }
          for (let idx1 in bills) {
            for (let idx2 in this.data.tags) {
              if (bills[idx1].tagId === this.data.tags[idx2].id) {
                bills[idx1].iconClass = this.data.tags[idx2].iconClass;
                break;
              }
            }
            bills[idx1].showTime = bills[idx1].recordTime.substring(5, bills[idx1].recordTime.length - 3);
          }
          var total = this.data.bills.concat(bills);
          this.setData({
            bills: total,
            pageNum: this.data.pageNum + 1
          })
        } else {
          this.setData({
            bills: null
          })
        }
        wx.hideNavigationBarLoading()
      })
      .catch(err => {
        wx.hideNavigationBarLoading()
        wx.showToast({
          title: '获取数据失败',
          icon: 'error',
          duration: 2000
        })
      })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var userId = wx.getStorageSync('userId');
    if (userId == '' || userId == undefined || userId == null) {
      userId = 1;
    }
    getTagList(userId).then(res => {
      if (res.data.code == 200) {
        this.setData({
          tags: res.data.data
        });
      }
    })
    if (this.data.year == '' || this.data.month == '') {
      var d = new Date();
      this.setData({
        year: d.getFullYear(),
        month: (d.getMonth() + 1)
      })
    }
    var inputDate = this.data.year + "-" + this.data.month;
    this.setData({
      pageNum: 1
    })
    wx.showNavigationBarLoading();
    getBillList(userId, this.data.pageNum, this.data.pageSize, inputDate, this.data.tagId).then(res => {
        if (res.data.code === 200) {
          var bills = res.data.data.records;
          if (bills.length < this.data.pageSize || (bills.length == this.data.pageSize && res.data.data.current == res.data.data.pages)) {
            this.setData({
              isBottom: true
            });
          } else {
            this.setData({
              isBottom: false
            });
          }
          for (let idx1 in bills) {
            for (let idx2 in this.data.tags) {
              if (bills[idx1].tagId === this.data.tags[idx2].id) {
                bills[idx1].iconClass = this.data.tags[idx2].iconClass;
                break;
              }
            }
            bills[idx1].showTime = bills[idx1].recordTime.substring(5, bills[idx1].recordTime.length - 3);
          }
          console.log(bills);
          this.setData({
            bills: bills,
            pageNum: this.data.pageNum + 1
          })
        } else {
          this.setData({
            bills: null
          })
        }
        wx.hideNavigationBarLoading()
      })
      .catch(err => {
        wx.hideNavigationBarLoading()
        wx.showToast({
          title: '获取数据失败',
          icon: 'error',
          duration: 2000
        })
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (options) {
    this.onShow();
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(this.data.isBottom);
    wx.showNavigationBarLoading();
    var inputDate = this.data.year + "-" + this.data.month;
    //mybatis-plus的页面计算：limit (currentPage - 1)*pageSize, pageSize, currentPage从1开始
    console.log(inputDate);
    var userId = wx.getStorageSync('userId');
    this.getBillPage(userId, this.data.pageNum, this.data.pageSize, inputDate, this.data.tagId);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  bindDateChange: function (e) {
    var date = e.detail.value
    var arr = date.split("-")
    this.setData({
      year: arr[0],
      month: arr[1]
    })
    var tagId = this.data.tagId == 8 ? null : this.data.tagId; //8是全部（标签）的id
    this.setData({
      pageNum: 1, //当前页面置1,
      bills: []
    })
    var userId = wx.getStorageSync('userId');
    this.getBillPage(userId, this.data.pageNum, this.data.pageSize, date, tagId);
  },
  closeChooseClass: function (e) {
    this.setData({
      dialog: false
    });
  },
  openChooseClass: function () {
    this.setData({
      dialog: true
    });
  },
  gotoWrite: function () {
    wx.navigateTo({
      url: '../wordkeep/wordkeep'
    })
  },
  //获取当前时间xxxx年xx月
  getYearMonth: function () {
    let now = new Date();
    let month = (10 > (now.getMonth() + 1)) ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    return now.getFullYear() + '-' + month;
  },
  chooseClass: function (e) {
    var tagId = e.currentTarget.dataset.tagId;
    var tags = this.data.tags;
    for (let idx in tags) {
      if (tags[idx].id === tagId) {
        this.setData({
          tagId: tags[idx].id,
          tagName: tags[idx].name,
          tagClass: tags[idx].iconClass
        })
        break;
      }
    }
    var inputDate = this.data.year + "-" + this.data.month;
    var inputTagId = tagId == 8 ? null : tagId; //8是全部（标签）的id
    this.setData({
      pageNum: 1, //当前页面置1
      bills: []
    })
    var userId = wx.getStorageSync('userId');
    this.getBillPage(userId, this.data.pageNum, this.data.pageSize, inputDate, inputTagId);
  },
})