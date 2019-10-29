import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/taobaoCategory/page',
    method: 'get',
    params: query
  });
}

export function search(query) {
  return request({
    url: '/api/admin/taobaoCategory/search',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: '/api/admin/taobaoCategory',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return request({
    url: '/api/admin/taobaoCategory/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/taobaoCategory/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/admin/taobaoCategory',
    method: 'put',
    data: obj
  })
}

export function all(query) {
  return request({
    url: '/api/admin/taobaoCategory/all',
    method: 'get',
    params: query
  });
}
export function filter(query) {
  return request({
    url: '/api/admin/taobaoCategory/filter',
    method: 'get',
    params: query
  });
}