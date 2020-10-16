import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/Drug_Store/SearchAll',
    method: 'post',
    data,
  })
}

export function getList(data) {
  return request({
    url: '/Drug_Store/SearchPage',
    method: 'post',
    data,
  })
}

export function doAdd(data) {
  return request({
    url: '/Drug_Store/Add',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/Drug_Store/Update',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Drug_Store/Del',
    method: 'post',
    data,
  })
}
