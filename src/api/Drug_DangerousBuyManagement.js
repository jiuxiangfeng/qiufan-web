import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/Drug_DangerousBuy/SearchPage',
    method: 'post',
    data,
  })
}

export function doAdd(data) {
  return request({
    url: '/Drug_DangerousBuy/Add',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/Drug_DangerousBuy/Update',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Drug_DangerousBuy/Del',
    method: 'post',
    data,
  })
}
