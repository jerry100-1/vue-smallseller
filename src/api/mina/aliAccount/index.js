import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/aliAccount/page',
    method: 'get',
    params: query
  });
}

export function all() {
  return request({
    url: '/api/admin/aliAccount/all',
    method: 'get',
  });
}

export function addObj(obj) {
  return request({
    url: '/api/admin/aliAccount',
    method: 'post',
    params: obj
  });
}

export function getObj(id) {
  return request({
    url: '/api/admin/aliAccount/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/aliAccount/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/admin/aliAccount',
    method: 'put',
    params: obj
  })
}

