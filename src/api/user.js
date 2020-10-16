import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config/settings'

export async function login(data) {
  // if (loginRSA) {
  //   data = await encryptedData(data);
  // }
  return request({
    url: '/login/login',
    method: 'post',
    data,
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/login/GetUserInfo',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/login/register',
    method: 'post',
  })
}
