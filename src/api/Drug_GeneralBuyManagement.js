import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/Drug_GeneralBuy/SearchPage',
    method: 'post',
    data,
  })
}

export function doAdd(data) {
  return request({
    url: '/Drug_GeneralBuy/Add',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/Drug_GeneralBuy/Update',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/Drug_GeneralBuy/Del',
    method: 'post',
    data,
  })
}
