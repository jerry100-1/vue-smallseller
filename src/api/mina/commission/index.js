import request from '@/utils/request'


export function page(query) {
  return request({
    url: '/api/admin/commission/page',
    method: 'get',
    params: query
  });
}

