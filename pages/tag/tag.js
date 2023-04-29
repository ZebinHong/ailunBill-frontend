import {
  getTagList,
  addTagByUserId,
  editTag,
  deleteTagByTagId
} from '../../service/tagApi.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tags: [],
    addShow: false,
    editShow: false,
    tagString: '',
    editTagStr: '',
    iconClass: 'icon-tags',
    myTagNum: 0,
    tagId: 0,
    buttons: [{
      type: 'primary',
      className: '',
      text: '添加',
      value: 0,
    }],
    editButtons: [{
      type: 'warn',
      className: '',
      text: '删除',
      value: 0,
    }, {
      type: 'primary',
      className: '',
      text: '修改',
      value: 1,
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.fetchTagList();
  },

  addTap: function () {
    if (this.data.myTagNum > 3) {
      wx.showToast({
        title: '自定义标签已满',
        icon: 'error',
        duration: 1000
      });
      return;
    }
    this.setData({
      addShow: true
    })
  },
  fetchTagList() {
    wx.showNavigationBarLoading();
    var userId = wx.getStorageSync('userId');
    if (userId == '' || userId == undefined || userId == null) {
      userId = 1;
    }
    getTagList(userId).then(res => {
      if (res.data.code == 200) {
        var tags = res.data.data,
          myTagNum = 0;
        for (var i = 0; i < tags.length; i++) {
          if (tags[i].userId != 1) {
            myTagNum++;
          }
        }
        this.setData({
          myTagNum,
          tags: res.data.data
        })
      }else {
        wx.showToast({
          title: res.data.msg || res.data.message,
          icon: 'error',
          duration: 1500
        })
      }
      wx.hideNavigationBarLoading();
    }).catch(err => {
      wx.hideNavigationBarLoading();
      wx.showToast({
        title: err.errMsg,
        icon: 'error',
        duration: 1500
      });
    })
  },
  buttontap: function (e) {
    if (this.data.tagString == '') {
      wx.showToast({
        title: '标签名为空',
        icon: 'error',
        duration: 1000
      })
      return;
    }
    var userId = wx.getStorageSync('userId');
    addTagByUserId(userId, this.data.tagString, this.data.iconClass).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 1000
        });
        this.fetchTagList();
        this.setData({
          addShow: false,
          tagString: ''
        });
      } else {
        wx.showToast({
          title: res.data.msg || res.data.message,
          icon: 'error',
          duration: 1500
        });
      }
    })
  },
  toEdit: function (e) {
    console.log(e);
    if (e.currentTarget.dataset.userId == 1){
      return;
    }
    this.setData({
      editShow: true,
      editTagStr: e.currentTarget.dataset.name,
      tagId: e.currentTarget.dataset.tagId
    });
  },
  editButtontap: function (e) {
    console.log(e);
    if (e.detail.index == 0){ //删除按钮
      deleteTagByTagId(this.data.tagId).then(res => {
        console.log(res);
        if (res.data.code == 200){
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          })
        }else {
          wx.showToast({
            title: res.data.message || res.data.message,
            icon: 'error',
            duration: 1500
          })
        }
        this.setData({
          editShow: false,
          tagString: '' //将字段置空，因为此字段用在两处
        })
        this.fetchTagList();
      })
    }else {
      if (this.data.editTagStr == ''){
        wx.showToast({
          title: "标签名为空",
          icon: 'error',
          duration: 1000
        })
        return;
      }
      editTag(this.data.tagId, this.data.editTagStr).then(res => {
        console.log(res);
        if (res.data.code == 200){
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000
          })
        }else {
          wx.showToast({
            title: res.data.message || res.data.message,
            icon: 'error',
            duration: 1500
          })
        }
        this.setData({
          editShow: false,
          tagString: '' //将字段置空，因为此字段用在两处
        })
        this.fetchTagList();
      });
    }
  },
  getInputName: function (e) {
    this.setData({
      tagString: e.detail.value
    });
  },
  getEditInputName:function(e){
    this.setData({
      editTagStr: e.detail.value
    })
  }
})