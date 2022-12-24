import {
  BASEURL
}from '../service/config.js'
export default function(options){
  return new Promise((resolve,reject)=>{
    wx.request({
      url: BASEURL + options.url,
      method:options.method || 'get',
      data:options.data || {},
      header:{
        'UserId':wx.getStorageSync('UserId') || "",
        'Authorization':wx.getStorageSync('Authorization') || ""
      },
      success:resolve,
      fail:reject
    })
  })
}