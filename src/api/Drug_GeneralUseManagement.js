import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/Drug_GeneralUse/SearchPage',
    method: 'post',
    data,
  })
}

export function doAdd(data) {
  return request({
    url: '/Drug_GeneralUse/Add',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/Drug_GeneralUse/Update',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Drug_GeneralUse/Del',
    method: 'post',
    data,
  })
}
