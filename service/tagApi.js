import request from './network.js'

export function getTagList(userId) {
  return request({
    url: `/money/tag/list/${userId}`,
    method: 'GET'
  })
}
export function getTagById(id) {
  return request({
    url: `/money/tag/get/${id}`,
    method: 'GET'
  })
}
export function addTagByUserId(userId, name, iconClass){
  return request({
    url: '/money/tag/add',
    method: 'POST',
    data: {
      userId: userId,
      name: name,
      iconClass: iconClass
    }
  })
}
// 
export function editTag(tagId, name, userId){
  return request({
    url: '/money/tag/edit',
    method: 'PUT',
    data: {
      id: tagId,
      name: name
    }
  })
}
export function deleteTagByTagId(id) {
  return request({
    url: `/money/tag/delete/${id}`,
    method: 'DELETE'
  })
}