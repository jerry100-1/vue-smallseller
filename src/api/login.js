import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/api/auth/jwt/admin/token',
    method: 'post',
    params: { username, password}
  })
}
export function logout(token) {
  return fetch({
    url: '/api/auth/jwt/admin/invalid',
    method: 'post',
    params: { token }
  });
}
export function getInfo(token) {
  return request({
    url: '/api/admin/user/info',
    method: 'get',
    params: { token }
  }); 
}
