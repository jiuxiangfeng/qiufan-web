import request from '@/utils/request'

export function getAll(data) {
  return request({
    url: '/DrugType/SearchAll',
    method: 'post',
    data,
  })
}

export function getList(data) {
  return request({
    url: '/DrugType/SearchPage',
    method: 'post',
    data,
  })
}

export function doAdd(data) {
  return request({
    url: '/DrugType/Add',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/DrugType/Update',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/DrugType/Del',
    method: 'post',
    data,
  })
}
