import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/banner/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: '/api/admin/banner',
    method: 'post',
    params: obj
  });
}

export function getObj(id) {
  return request({
    url: '/api/admin/banner/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/banner/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/admin/banner',
    method: 'put',
    params: obj
  })
}

export function bannerPage(query) {
  return request({
    url: '/api/admin/bannerType/page',
    method: 'get',
    params: query
  })
}

export function bannerAdd(query) {
  return request({
    url: '/api/admin/bannerType/add',
    method: 'post',
    params: query
  })
}
export function bannerPut(query) {
  return request({
    url: '/api/admin/bannerType/update',
    method: 'put',
    params: query
  })
}
export function bannerDel(id) {
  return request({
    url: '/api/admin/bannerType/' + id,
    method: 'delete',
  })
}

