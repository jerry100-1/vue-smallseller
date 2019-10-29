import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/user/page',
    method: 'get',
    params: query
  });
}

export function search(query) {
  return request({
    url: '/api/admin/user/key',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: '/api/admin/user',
    method: 'post',
    params: obj
  });
}

export function getObj(id) {
  return request({
    url: '/api/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/admin/user',
    method: 'put',
    params: obj
  })
}
