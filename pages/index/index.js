import {
  getDayBillList,
  getStatInMonth
} from "../../service/billApi"
import {
  getTagList
} from '../../service/tagApi.js'
const app = getApp()

Page({
  data: {
    dayincome: 0,
    dayoutcome: 0,
    monthincome: 0,
    monthoutcome: 0,
    bills: [],
    userId: 0,
    pageNum: 1,
    pageSize: 10,
    date: '',
    tabbar: {},
    tags: [],
    isBottom: false
  },
  onLoad() {
    console.log("index page load ...");
    app.editTabbar();
    var userId = wx.getStorageSync('userId');
    var d = new Date();
    var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    this.setData({
      date
    });
    getTagList(userId).then(res => {
      if (res.data.code == 200) {
        // console.log(res)
        this.setData({
          tags: res.data.data
        });
      }
    })
  },
  onShow() {
    // 若没有登录,返回false
    var userId = wx.getStorageSync('userId');
    if (userId == '' || userId == undefined) {
      this.setData({
        dayincome: 0,
        dayoutcome: 0,
        monthincome: 0,
        monthoutcome: 0,
      })
    }
    if (this.data.date == '') {
      var date = new Date();
      this.setData({
        date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      })
    }
    this.setData({
      pageNum: 1
    })
    getDayBillList(userId, this.data.pageNum, this.data.pageSize, this.data.date, 8).then(res => {
      if (res.data.code === 200) {
        var bills = res.data.data.records;
        var dayincome = 0,
          dayoutcome = 0;
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
          if (bills[idx1].type == 0) {
            dayincome += bills[idx1].money;
          } else {
            dayoutcome += bills[idx1].money;
          }
          for (let idx2 in this.data.tags) {
            if (bills[idx1].tagId === this.data.tags[idx2].id) {
              bills[idx1].iconClass = this.data.tags[idx2].iconClass;
              break;
            }
          }
          bills[idx1].showTime = bills[idx1].recordTime.substring(5, bills[idx1].recordTime.length - 3);
        }
        this.setData({
          bills: bills,
          dayincome: dayincome,
          dayoutcome: dayoutcome
        });
      } else {
        wx.showToast({
          title: res.data.msg || res.data.message,
          icon: 'error',
          duration: 1000
        });
      }
    }).catch(error => {
      wx.showToast({
        title: error.errMsg,
        icon: 'error',
        duration: 1000
      });
    });
    var date = new Date();
    getStatInMonth(date.getFullYear() + "-" + (date.getMonth() + 1), userId, 0).then(res => {
      if (res.data.code == 200) {
        var monthincome = 0;
        var bills = res.data.data;
        for (let i = 0; i < bills.length; i++) {
          monthincome += bills[i].total;
        }
        this.setData({
          monthincome: monthincome.toFixed(2)
        })
      }
    });
    getStatInMonth(date.getFullYear() + "-" + (date.getMonth() + 1), userId, 1).then(res => {
      if (res.data.code == 200) {
        var monthoutcome = 0;
        var bills = res.data.data;
        for (let i = 0; i < bills.length; i++) {
          monthoutcome += bills[i].total;
        }
        this.setData({
          monthoutcome: monthoutcome.toFixed(2)
        })
      }
    });
  },
  onReachBottom() {
    var userId = wx.getStorageSync('userId');
    getDayBillList(userId, this.data.pageNum + 1, this.data.pageSize, this.data.date, 8)
      .then(res => {
        if (res.data.code === 200) {
          this.setData({
            pageNum: this.data.pageNum + 1
          })
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
              }
            }
          }
          var total = [];
          total = this.data.bills.concat(bills);
          this.setData({
            bills: total,
            pageNum: this.data.pageNum + 1
          });
        }
        wx.hideNavigationBarLoading()
      })
      .catch(err => {
        console.log("获取bills失败", err)
        wx.hideNavigationBarLoading()
        wx.showToast({
          title: '获取数据失败',
          icon: 'error',
          duration: 2000
        })
      })
  },
  onPullDownRefresh() {
    this.onShow();
    wx.stopPullDownRefresh();
  }
})