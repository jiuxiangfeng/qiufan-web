import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/Drug_DangerousUse/SearchPage',
    method: 'post',
    data,
  })
}

export function doAdd(data) {
  return request({
    url: '/Drug_DangerousUse/Add',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/Drug_DangerousUse/Update',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Drug_DangerousUse/Del',
    method: 'post',
    data,
  })
}
