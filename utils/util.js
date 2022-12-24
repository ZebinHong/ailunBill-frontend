const formatTime = date => {
  const year = date.getFullYear()
  const month = (10 > (date.getMonth() + 1)) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 //格式化为两位数
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
const formatDate = date => {
  const year = date.getFullYear()
  const month = (10 > (date.getMonth() + 1)) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1//格式化为两位数
  const day = date.getDate()
  return `${[year, month, day].map(formatNumber).join('-')}`
}

const formatToMonth = date => {
  const year = date.getFullYear()
  const month = (10 > (date.getMonth() + 1)) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;//格式化为两位数
  return `${year}年${month}月`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  formatDate,
  formatToMonth
}
