import request from './network.js'

export function getTagList(userId, date, tagId) {
  return request({
    url: `/money/tag/list/${userId}`,
    method: 'GET',
    data: {
      date,
      tagId
    }
  })
}
export function getTagById(id) {
  return request({
    url: `/money/tag/get/${id}`,
    method: 'GET'
  })
}