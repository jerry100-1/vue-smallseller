import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/navigation/queryByCode',
    method: 'get',
    params: query
  });
}

export function addType(obj) {
  return request({
    url: '/api/admin/navigationType/add',
    method: 'post',
    params: obj
  });
}

export function getTypeList() {
  return request({
    url: '/api/admin/navigationType/queryAll',
    method: 'get',
  });
}

export function addObj(obj) {
  return request({
    url: '/api/admin/navigation/add',
    method: 'post',
    params: obj
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/navigation/' + id,
    method: 'delete'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/admin/navigation/update',
    method: 'post',
    params : obj
  })
}
export function putType(obj) {
  return request({
    url: '/api/admin/navigationType/update',
    method: 'post',
    params : obj
  })
}
export function delType(id) {
  return request({
    url: '/api/admin/navigationType/'+id,
    method: 'delete',
  })
}





