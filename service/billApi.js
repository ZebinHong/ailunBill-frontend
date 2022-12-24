import request from './network.js'

export function addBill(billInfo) {
  return request({
    url: '/money/bill/add',
    method: 'POST',
    data: {
      userId: billInfo.userId,
      money: billInfo.money,
      type: billInfo.type,
      tagId: billInfo.tagId,
      details: billInfo.details,
      recordTime: billInfo.recordTime
    }
  })
}
export function updateBill(billInfo) {
  return request({
    url: '/money/bill/update',
    method: 'PUT',
    data: {
      id: billInfo.billId,
      userId: billInfo.userId,
      money: billInfo.money,
      type: billInfo.type,
      tagId: billInfo.tagId,
      details: billInfo.details,
      recordTime: billInfo.recordTime
    }
  })
}
export function getBillList(userId, pageNum, pageSize, date, tagId) {
  return request({
    url: `/money/bill/list/${userId}/${pageNum}/${pageSize}`,
    method: 'POST',
    data: {
      date,
      tagId
    }
  })
}
export function getDayBillList(userId, pageNum, pageSize, date, tagId) {
  return request({
    url: `/money/bill/list-day/${userId}/${pageNum}/${pageSize}`,
    method: 'POST',
    data: {
      date,
      tagId
    }
  })
}
export function getBillDetail(billId) {
  return request({
    url: `/money/bill/get/${billId}`,
    method: 'GET'
  })
}
export function deleteBill(billId) {
  return request({
    url: `/money/bill/delete/${billId}`,
    method: 'DELETE'
  })
}

export function getStatInHalfYear(monthYear,userId,type) {
  return request({
    url: `/money/bill/getStatInHalfYear/${monthYear}/${userId}/${type}`,
    method: 'GET'
  })
}
export function getStatInMonth(monthYear,userId,type) {
  return request({
    url: `/money/bill/getStatInMonth/${monthYear}/${userId}/${type}`,
    method: 'GET'
  })
}

export function removeBillBatch(ids) {
  return request({
    url: '/money/bill/remove-batch',
    method: 'DELETE',
    data: {
      ids: ids.toString()
    }
  })
}