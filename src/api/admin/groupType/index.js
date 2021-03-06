import request from '@/utils/request';

export function page(query) {
  return request({
    url: '/api/admin/groupType/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: '/api/admin/groupType',
    method: 'post',
    params: obj
  });
}

export function getObj(id) {
  return request({
    url: '/api/admin/groupType/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/groupType/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/admin/groupType',
    method: 'put',
    params: obj
  })
}
