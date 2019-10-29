import request from '@/utils/request'


export function page(query) {
  return request({
    url: '/api/admin/goods/page',
    method: 'get',
    params: query
  });
}
export function addObj(obj) {
  return request({
    url: '/api/admin/goods',
    method: 'post',
    params: obj
  });
}
export function getObj(id) {
  return request({
    url: '/api/admin/goods/'+id,
    method: 'get',
  });
}
export function deleteObj(id) {
  return request({
    url: '/api/admin/goods/'+id,
    method: 'delete',
  });
}
export function topObj(id,isTop) {
  return request({
    url: '/api/admin/goods/'+id+'/top',
    method: 'post',
    params:{isTop:isTop}
  });
}
export function putObj(obj) {
  return request({
    url: '/api/admin/goods',
    method: 'put',
    params: obj
  })
}