import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/Drug_StandardUse/SearchPage',
    method: 'post',
    data,
  })
}

export function doAdd(data) {
  return request({
    url: '/Drug_StandardUse/Add',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/Drug_StandardUse/Update',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Drug_StandardUse/Del',
    method: 'post',
    data,
  })
}
