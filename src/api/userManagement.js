import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/sysuser/SearchPage',
    method: 'post',
    data,
  })
}

export function doAdd(data) {
  return request({
    url: '/sysuser/Add',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/sysuser/Update',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/sysuser/Del',
    method: 'post',
    data,
  })
}
