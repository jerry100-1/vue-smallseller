import request from '@/utils/request'


export function page(query) {
  return request({
    url: '/api/admin/copyWriter/list',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: '/api/admin/copyWriterMap',
    method: 'post',
    params: obj
  });
}

export function getObj(id) {
  return request({
    url: '/api/admin/copyWriterMap/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/copyWriterMap/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/admin/copyWriterMap',
    method: 'put',
    params: obj
  })
}


