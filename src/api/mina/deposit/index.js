import request from '@/utils/request'


export function page(query) {
  return request({
    url: '/api/admin/deposit/page',
    method: 'get',
    params: query
  });
}
