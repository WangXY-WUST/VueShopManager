import request from '@/utils/request'

// 获取sku列表的接口：GET /admin/product/list/{page}/{limit}
export const reqSkuList = (page , limit) => { 
    return request({
        url: `/admin/product/list/${page}/${limit}`,
        method: 'get'
    })
 }

// 上架商品的接口：GET /admin/product/onSale/{skuId}
export const reqSale = skuId => request({url:`/admin/product/onSale/${skuId}` , method: 'get'})
// 下架商品的接口：GET /admin/product/cancelSale/{skuId}
export const reqCancel = skuId => request({url:`/admin/product/cancelSale/${skuId}` , method: 'get'})


// 获取sku详情的接口：/admin/product/getSkuById/{skuId} get
export const reqSkuInfo = skuId => request({url:`/admin/product/getSkuById/${skuId}` , method:'get'})