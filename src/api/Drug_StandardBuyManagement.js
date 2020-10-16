import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/Drug_StandardBuy/SearchPage',
    method: 'post',
    data,
  })
}

export function doAdd(data) {
  return request({
    url: '/Drug_StandardBuy/Add',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/Drug_StandardBuy/Update',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Drug_StandardBuy/Del',
    method: 'post',
    data,
  })
}
