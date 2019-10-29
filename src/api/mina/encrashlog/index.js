import request from '@/utils/request'


export function page(query) {
  return request({
    url: '/api/admin/encrash/page',
    method: 'get',
    params: query
  });
}

export function putObj(obj) {
  return request({
    url: '/api/admin/encrash',
    method: 'put',
    params: obj
  })
}


export function refuseObj(id,obj) {
  return request({
    url: '/api/admin/encrash/cancle/'+ id,
    method: 'put',
    params: obj
  })
}
export function confirmObj(id) {
  return request({
    url: '/api/admin/encrash/comfirm/'+ id,
    method: 'put'
  })
}
export function aliStatus(obj) {
  return request({
    url: '/api/admin/alipayTransfer/synOrderStatus',
    method: 'post',
    params: obj
  })
}
export function aliPay(obj) {
  return request({
    url: '/api/admin/alipayTransfer/transfer',
    method: 'post',
    params: obj
  })
}

