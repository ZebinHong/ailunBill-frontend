import request from './network.js'

export function getSendSumInYear(id) {
  return request({
    url: '/bill/getSendSumInYear/'+id,
    method: 'GET',
  })
}
export function getSendSumInMonth(id) {
  return request({
    url: '/bill/getSendSumInMonth/'+id,
    method: 'GET',
  })
}
export function getReceiveSumInYear(id) {
  return request({
    url: '/bill/getReceiveSumInYear/'+id,
    method: 'GET',
  })
}
export function getReceiveSumInMonth(id) {
  return request({
    url: '/bill/getReceiveSumInMonth/'+id,
    method: 'GET',
  })
}
