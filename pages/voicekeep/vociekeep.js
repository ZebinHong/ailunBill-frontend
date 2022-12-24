import {
  BASEURL
} from "../../service/config";
import {
  getTagList
} from '../../service/tagApi.js'
import {
  addBill
} from '../../service/billApi.js'
const app = getApp();
//获取全局唯一的语音识别管理器recordRecoManager
const manager = wx.getRecorderManager()
var log = require('../../log')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: 0,
    //语音
    recordState: false, //录音状态
    show: false,
    activeTagId: 10,
    tags: [],
    obj: {
      type: 1,
      details: '',
      money: 0,
      date: '',
      tagId: 10 //默认为语音
    },
    buttons: [{
        type: 'default',
        className: '',
        text: '重新录入',
        value: 0
      },
      {
        type: 'primary',
        className: '',
        text: '记录',
        value: 1
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //识别语音
    this.initRecord();
    var userId = wx.getStorageSync('userId');
    getTagList(userId).then(res => {
      if (res.data.code == 200) {
        this.setData({
          tags: res.data.data,
          userId
        });
      }
    })
  },
  //识别语音 -- 初始化
  initRecord: function () {
    //识别结束事件
    manager.onStop(res => {
      console.log(res);
      log.info("语音 res：" + JSON.stringify(res));
      var that = this;
      wx.uploadFile({
        url: BASEURL + "/money/voice/translate",
        filePath: res.tempFilePath,
        name: 'file',
        success: function (res) {
          var obj = JSON.parse(res.data);
          console.log(obj);
          log.info("识别结果：res" + JSON.stringify(obj));
          if (obj.code === 200) {
            var type = 0;
            obj = obj.data;
            if (obj.money < 0) {
              type = 1;
              obj.money = obj.money * (-1);
            }
            obj.type = type;
            obj.date = '';
            console.log(type);
            that.setData({
              obj: obj,
              show: true
            })
          } else {
            wx.showToast({
              title: '识别失败',
              icon: 'error',
              duration: 1500
            })
          }
        },
        fail: function () {
          console.log("语音识别失败");
        }
      })
    })
  },
  //语音  --按住说话
  touchStart: function (e) {
    log.info("录制开始");
    this.setData({
      recordState: true //录音状态
    })
    // 语音开始识别
    manager.start({
      duration: 15000, //最长录制时间
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 64000,
      format: 'PCM',
      frameSize: 50
    })
  },
  //语音  --松开结束
  touchEnd: function (e) {
    log.info("录制结束");
    this.setData({
      recordState: false
    })
    // 语音结束识别
    manager.stop();
  },
  buttontap(e) {
    console.log(e.detail)
    if (e.detail.index === 0) {
      this.setData({
        money: 0,
        details: '',
        type: 1,
        date: '',
        show: false
      })
    } else {
      var util = require('../../utils/util.js')
      var userId = wx.getStorageSync('userId');
      var recordTime = this.data.obj.date;
      if (recordTime === '') { //当显示为今天时
        recordTime = util.formatDate(new Date());
      }
      //添加时分秒
      let date = new Date();
      let s = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      recordTime = recordTime + " " + s;
      var billInfo = {
        userId: userId,
        money: this.data.obj.money,
        type: this.data.obj.type,
        tagId: this.data.activeTagId,
        details: this.data.obj.details,
        recordTime: recordTime
      }
      addBill(billInfo).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          this.setData({
            show: false
          })
          wx.showModal({
            title: '录入成功',
            content: '是否继续录入账单？',
            success: function (res) {
              if (res.confirm) { //这里是点击了确定以后
                console.log('用户点击确定')
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
            title: '添加失败',
            icon: 'error',
            duration: 1500
          })
        }
      })
    }
  },
  bindDataChange: function (event) {
    var obj = this.data.obj;
    obj.date = event.detail.value;
    this.setData({
      obj: obj
    })
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
})