import request from '@/utils/request'


export function page(query) {
  return request({
    url: '/api/admin/order/page',
    method: 'get',
    params: query
  });
}

export function getObj(id) {
  return request({
    url: '/api/admin/order/' + id,
    method: 'get'
  })
}
