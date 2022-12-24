App({
  onLaunch: function () {
    //获取设备信息
    this.getSystemInfo();
  },
  onShow: function () {
  },  
  getSystemInfo: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.systemInfo = res;
      }
    });
  },
  globalData: {
    systemInfo: null, //客户端设备信息
    userInfo: null,
    tabBar: {
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
        }
      ]
    }
  },
  //全局点击事件
  editTabbar: function () {
    var tabbar = this.globalData.tabBar;
    var currentPages = getCurrentPages();
    var that = currentPages[currentPages.length - 1];
    var pagePath = that.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    that.setData({
      tabbar: tabbar
    });
  }
})