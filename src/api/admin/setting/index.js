import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/setting/page',
    method: 'get',
    params: query
  });
}


export function addObj(obj) {
  return request({
    url: '/api/admin/setting',
    method: 'post',
    params: obj
  });
}

export function getObj(id) {
  return request({
    url: '/api/admin/setting/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/setting/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/admin/setting',
    method: 'put',
    params: obj
  })
}
