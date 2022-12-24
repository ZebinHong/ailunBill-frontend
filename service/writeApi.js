import request from './network.js'


export function addReceiveBill(data) {
  return request({
    url: '/bill/addReceiveBill',
    method: 'POST',
    data: {
      details: data.details,
      money: data.money,
      receiveOrSpend: data.type2,
      time: data.date,
      type: data.type1,
    }
  })
}

export function addSendBill(data) {
  return request({
    url: '/bill/addSendBill',
    method: 'POST',
    data: {
      details: data.details,
      money: data.money,
      receiveOrSpend: data.type2,
      time: data.date,
      type: data.type1,
    }
  })
}