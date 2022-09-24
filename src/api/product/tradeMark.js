// 获取品牌管理的数据的模块 

import request from '@/utils/request'

// 获取品牌列表接口API：/admin/product/baseTrademark/{page}/{limit}  get 有参
export const reqTradeMarkList = (page , limit) => { 
   return request({
        url: `/admin/product/baseTrademark/${page}/${limit}`,
        method: 'get'
    })
 }

//  添加品牌接口API：/admin/product/baseTrademark/save post 有参 不用传id，id是服务器生成

// 修改品牌接口API：/admin/product/baseTrademark/update put 有参 需要带id

export const reqAddOrUpdateTradeMark = (tradeMark) => { 
   if(tradeMark.id) {
      return request({
         url: '/admin/product/baseTrademark/update',
         method: 'put',
         data: tradeMark
      })
   }else {
      return request({
         url: '/admin/product/baseTrademark/save',
         method: 'post',
         data: tradeMark
      })
   }
 }


//  删除品牌接口：/admin/product/baseTrademark/remove/{id} delete 有参
export const reqDeleteTradeMark = (id) => { 
   return request({
      url: `/admin/product/baseTrademark/remove/${id}`,
      method: 'delete'
   })
 }
