// pages/write/write.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userID: "",
		array1: ['娱乐', '交通', '食品', '学习', '医疗', '运动', '服饰', '社交', '数码', '美容', '工资', '理财'],
		array2: ['支出', '收入'],
		type1: 0,
		type2: 0,
		details: "",
		money: 0
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			userID: app.globalData.userID
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},
	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},
	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},
	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {},
	
	submit: function () {
		var the_class = this.data.array1[this.data.type1]
		var the_details = this.data.details
		var the_money = 0
		var date = this.nowDate()
		var date_month = this.nowDate_month()
		if (this.data.array2[this.data.type2] == '支出') {
			
		} else {

		}
	},
	//获取当前时间
	nowDate: function () {
		let now = new Date();
		let _month = (10 > (now.getMonth() + 1)) ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
		let _day = (10 > now.getDate()) ? '0' + now.getDate() : now.getDate();
		return now.getFullYear() + '-' + _month + '-' + _day;
	},
	//获取当前时间年-月
	nowDate_month: function () {
		let now = new Date();
		let _month = (10 > (now.getMonth() + 1)) ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
		return now.getFullYear() + '-' + _month;
	},
})
