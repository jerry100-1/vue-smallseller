import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/categoryFilter/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: '/api/admin/categoryFilter',
    method: 'post',
    params: obj
  });
}

export function getObj(id) {
  return request({
    url: '/api/admin/categoryFilter/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/categoryFilter/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/admin/categoryFilter',
    method: 'put',
    params: obj
  })
}

export function closeObj(obj){
  return request({
    url:"/api/admin/categoryFilter/collect/" + obj.id + "?status=" + obj.status,
    method: 'put'
  })
}