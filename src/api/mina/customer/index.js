import request from '@/utils/request'


//获取页面配置
export function page(query) {
  return request({
    url: '/api/admin/cusServMsg/page',
    method: 'get',
    params: query
  });
}
//增加消息配置
export function insertObj(obj) {
  return request({
    url: '/api/admin/cusServMsg/insert',
    method: 'post',
    data: obj
  });
}
//删除消息
export function delObj(id) {
  return request({
    url: '/api/admin/cusServMsg/delete/' + id,
    method: 'delete',
  });
}

//人工回复 OR 自动回复 ok
export function setAuto(obj) {
  return request({
    url: '/api/admin/cusServMsg/setReplyType',
    method: 'put',
    params: obj
  });
}
//设置时间触发规则 ok
export function setTime(obj) {
  return request({
    url: '/api/admin/cusServMsg/setClearTimePoint',
    method: 'put',
    params: obj
  });
}
//更新消息配置
export function changeObj(obj) {
  return request({
    url: '/api/admin/cusServMsg/update',
    method: 'put',
    data: obj
  });
}
//获取时间配置 ok
export function getTimeSet(obj) {
  return request({
    url: '/api/admin/cusServMsg/getClearTimePoint',
    method: 'get',
    params: obj
  });
}
//获取消息配置ok
export function getMsg(obj) {
  return request({
    url: '/api/admin/cusServMsg/getReplyType',
    method: 'get',
    params: obj
  });
}
//启动或关闭
export function openObj(obj) {
  return request({
    url: '/api/admin/cusServMsg/setStatus',
    method: 'put',
    params: obj
  });
}