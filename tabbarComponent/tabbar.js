// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#979795",
        "selectedColor": "#1c1c1b",
        "list": [{
          "pagePath": "/pages/index/index",
          "iconPath": "icon/footer-i1.png",
          "selectedIconPath": "icon/footer-i1h.png",
          "text": "首页"
        },
        {
          "pagePath": "/pages/bill/bill",
          "iconPath": "icon/footer-i2.png",
          "selectedIconPath": "icon/footer-i2h.png",
          "text": "账单"
        },
        {
          "pagePath": "/pages/wordkeep/wordkeep",
          "iconPath": "icon/icon_release.png",
          "isSpecial": true,
          "text": "记一笔"
        },
        {
          "pagePath": "/pages/census/census",
          "iconPath": "icon/footer-i4.png",
          "selectedIconPath": "icon/footer-i4h.png",
          "text": "统计"
        },
        {
          "pagePath": "/pages/my/my",
          "iconPath": "icon/footer-i5.png",
          "selectedIconPath": "icon/footer-i5h.png",
          "text": "我的"
        }]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.model.search('iPhone X') != -1 ? true : false,
    show: false,
    buttons: [{
      type: 'default',
      className: '',
      text: '取消',
      value: 0
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onWordTap: function () {
      this.setData({
        show: false
      })
      wx.navigateTo({
        url: "../wordkeep/wordkeep",
        success: function () {
          console.log("jump success")
        },
        fail: function () {
          console.log("jump failed")
          this.setData({
            show: true
          })
        },
        complete: function () {
          console.log("jump complete")
        }
      })
    },
    onVoiceTap: function () {
      this.setData({
        show: false
      })
      wx.navigateTo({
        url: '../voicekeep/vociekeep',
        fail: function () {
          console.log("jump failed")
          this.setData({
            show: true
          })
        }
      })
    },
    onExcelTap: function () {
      this.setData({
        show: false
      })
      wx.navigateTo({
        url: '../filekeep/filekeep',
        fail: function () {
          console.log("jump failed")
          this.setData({
            show: true
          })
        }
      })
    },
    buttontap(e) {
      if (e.detail.index === 0) {
        this.setData({
          show: false
        })
      }
    },
    specialTap() {
      this.setData({
        show: true
      })
    }
  }
})