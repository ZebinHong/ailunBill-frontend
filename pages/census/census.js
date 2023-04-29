import * as echarts from '../../ec-canvas/echarts';
import {
  getStatInHalfYear,
  getStatInMonth
} from '../../service/billApi';
const app = getApp();

function setOption1(chart, x, y) {
  let option = {
    title: {
      text: '月度对比',
      left: 'left',
      textStyle: { //主标题文字样式
        fontWeight: 'normal', 
      },
    },
    grid: {
      left: 0,
      right: 0
    },
    xAxis: {
      type: 'category',
      data: x,
      axisLabel: {
        interval: 0,
        // rotate: -30
        formatter: function (params) {
          return params.substring(0, 4) + "\n" + params.substring(5);
        }
      },
      axisTick: {
        show: false //取消x轴刻度
      },
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [{
      data: y,
      type: 'bar',
      itemStyle: {
        normal: {
          //设置字体样式
          label: {
            formatter: (val) => {
              return '¥' + val.data;
            },
            color: '#000',
            show: true,
            position: 'top'
          }
        }
      }
    }],
    color: '#07c160'
  };
  chart.setOption(option);
  return chart;
}

function setOption2(chart, x, y, month) {
  let option = {
    title: {
      text: '每日对比' + '(' + month + '月)',
      left: 'left',
      textStyle: { //主标题文字样式
        fontWeight: 'normal', 
      },
    },
    grid: {
      left: 0,
      right: 0,
      bottom: 10,
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter(params) {
        return params[0].name + "日\n￥" + params[0].value + "";
      },
      axisPointer: {
        show: true
      }
    },
    xAxis: {
      type: 'category',
      data: x,
      axisLabel: {
        interval: 3,
      },
      axisTick: {
        show: false //取消x轴刻度
      },
    },
    yAxis: {
      type: 'value',
      show: true, //显示y轴
      axisLabel: {
        formatter: (value) => {
          if (value >= 10000) {
            value = (value / 10000) + 'w';
          }
          if (value >= 1000) {
            value = (value / 1000) + 'k';
          }
          return '¥' + value;
        }
      }
    },
    series: [{
      data: y,
      type: 'bar',
    }],
    color: '#07c160'
  };
  chart.setOption(option);
  chart.dispatchAction({ //默认显示坐标轴指示线
    type: 'showTip',
    seriesIndex: 0, // 显示第几个series
    dataIndex: option.series[0].data.length - 1 // 显示第几个数据
  });
  return chart;
}

Page({
  data: {
    sum: 0, //总金额
    type: 1, //默认显示支出
    year: 2022,
    month: 12,
    tabbar: {},
    imgSrc:'',//图片
    ec: {
      lazyLoad: true
    },
  },
  onLoad: function () {
    app.editTabbar();
    //初始化数据
    var d = new Date();
    this.setData({
      year: d.getFullYear(),
      month: (d.getMonth() + 1)
    })
  },
  async initMonthChart() {
    var userId = wx.getStorageSync('userId');
    // 同步获取数据
    var res = await getStatInHalfYear(this.data.year + "-" + this.data.month, userId, this.data.type)
    var x = [],
      y = [];
    if (res.data.code == 200) {
      var tmp = res.data.data;
      console.log(JSON.stringify(tmp));
      for (let i = 0; i < tmp.length; i++) {
        x.push((tmp[i].year + "年" + tmp[i].month + "月"))
        y.push(tmp[i].total)
      }
    }
    //初始化图表
    let ecComponent = this.selectComponent('#mychart-dom-line');
    ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);
      setOption1(chart, x, y);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    })
  },
  async initDayChart() {
    //同步获取数据
    var x = [],
      y = [];
    var userId = wx.getStorageSync('userId');
    var res = await getStatInMonth(this.data.year + "-" + this.data.month, userId, this.data.type);
    if (res.data.code == 200) {
      var tmp = res.data.data;
      var sum = 0;
      for (let i = 0; i < tmp.length; i++) {
        x.push(tmp[i].day)
        y.push(tmp[i].total)
        sum += tmp[i].total;
      }
      this.setData({
        sum: sum.toFixed(2)
      })
    }
    //初始化图表
    let ecComponent = this.selectComponent('#mychart-dom-line2');
    ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);

      setOption2(chart, x, y, this.data.month);
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    })
  },
  onShow() {
    this.initMonthChart();
    this.initDayChart();
  },
  bindDateChange(event) {
    var str = event.detail.value.split("-");
    this.setData({
      year: str[0],
      month: str[1]
    })
    this.onShow();
  },
  outcomeTap() {
    if (this.data.type === 0 || this.data.type === 2) {
      this.setData({
        type: 1
      })
      this.onShow();
    }
  },
  incomeTap() {
    if (this.data.type === 1 || this.data.type === 2) {
      this.setData({
        type: 0
      })
      this.onShow();
    }
  },
  subTap(){
    if (this.data.type === 0 || this.data.type === 1) {
      this.setData({
        type: 2
      })
      this.onShow();
    }
  }
});