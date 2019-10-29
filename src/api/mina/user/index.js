import request from '@/utils/request'


export function page(query) {
  return request({
    url: '/api/admin/minaUser/page',
    method: 'get',
    params: query
  });
}
export function getObj(id) {
  return request({
    url: '/api/admin/minaUser/' + id,
    method: 'get'
  })
}
export function getPlatformObj(startDate,endDate,plat) {
  return request({
    url: '/api/admin/minaUser/platformAccount?startDate='+startDate+'&endDate='+endDate +'&platformType='+plat  ,
    method: 'get',
  })
}