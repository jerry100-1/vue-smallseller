import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/qingSouCate/pages',
    method: 'get',
    params: query
  });
}
export function addObj(obj) {
  return request({
    url: '/api/admin/qingSouCate/insert',
    method: 'POST',
    data: obj
  });
}
export function delObj(id) {
  return request({
    url: '/api/admin/qingSouCate/delete/'+ id,
    method: 'delete',
  });
}
export function updateObj(obj) {
  return request({
    url: '/api/admin/qingSouCate/update',
    method: 'put',
    data:obj
  });
}
export function updateStates(obj) {
  return request({
    url: '/api/admin/qingSouCate/updateState',
    method: 'put',
    data:obj
  });
}