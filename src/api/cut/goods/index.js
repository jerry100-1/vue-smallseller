import request from '@/utils/request'

export function page(query) {
  return request({
    url: '/api/admin/actRedpacketGoods/pages',
    method: 'get',
    params: query
  });
}
//删除
export function delObj(id) {
  return request({
    url: '/api/admin/actRedpacketGoods/delete/'+id,
    method: 'delete',
  });
}
//上下架
export function upDownObj(obj) {
  return request({
    url: '/api/admin/actRedpacketGoods/updState',
    method: 'put',
    params:obj
  });
}
//编辑 修改
export function upDateObj(obj) {
  return request({
    url: '/api/admin/actRedpacketGoods/update',
    method: 'put',
    params:obj
  });
}
//添加商品到砍价
export function insertObj(obj) {
  return request({
    url: '/api/admin/actRedpacketGoods/insert',
    method: 'post',
    params:obj
  });
}
