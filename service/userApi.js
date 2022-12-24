import request from '../service/network.js'

/**
 * 用户登录的接口
 * @param {*} jscode 
 * @param {*} infoRes 
 */
export function userLogin(jscode,infoRes) {
  return request({
    url: '/money/wechat/user/login',
    method:'POST',
    data: {
      code: jscode, // 临时登录凭证
      rawData: infoRes.rawData, // 用户非敏感信息
      signature: infoRes.signature, // 签名
      encryptedData: infoRes.encryptedData, // 用户敏感信息
      iv: infoRes.iv, // 解密算法的向量
    }
  })
}

export function updateUser(user){
  return request({
    url:'/money/user/update',
    method:'PUT',
    data: {
      id: user.id,
      name: user.name,
      gender: user.gender,
      email: user.email,
      avatarUrl: user.avatarUrl
    }
  })
}
export function getUser(userId){
  return request({
    url:'/money/user/get/'+userId,
    method:'GET'
  })
}