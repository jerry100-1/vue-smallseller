

import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/goodsFilter/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: '/api/admin/goodsFilter',
    method: 'post',
    params: obj
  });
}

export function getObj(id) {
  return request({
    url: '/api/admin/goodsFilter/' + id,
    method: 'get'
  })
}

export function getTypeObj(obj) {
  return request({
    url: '/api/admin/goodsFilter/getByType',
    method: 'get',
    params: obj
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/goodsFilter/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/admin/goodsFilter',
    method: 'put',
    params: obj
  })
}

