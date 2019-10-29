import request from '@/utils/request'

/**
 * 关闭采集 / 开启采集
 * type : 平台类型
 * isCollect : 0 开启 1 关闭
 */
export function platCollectCtrl(obj) {
  return request({
    url: '/api/admin/platform/' + obj.type + '/'+obj.isCollect,
    method: 'post'
  });
}

/**
 * 查平台的状态
 * type : 1淘宝 2拼多多
 */
export function checkStatus(type) {
  return request({
    url: `/api/admin/platform/${type}`,
    method: 'get'
  });
}
