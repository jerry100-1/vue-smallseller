import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/actRedpacket/pages',
    method: 'get',
    params: query
  });
}
export function delObj(obj,id) {
  return request({
    url: '/api/admin/actRedpacket/cancleRedpacket/'+ id,
    method: 'put',
    params: obj
  });
}