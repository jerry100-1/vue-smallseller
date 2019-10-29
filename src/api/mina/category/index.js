import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/category/page',
    method: 'get',
    params: query
  });
}

export function search(query) {
  return request({
    url: '/api/admin/category/search',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: '/api/admin/category',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return request({
    url: '/api/admin/category/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/category/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/admin/category',
    method: 'put',
    data: obj
  })
}

