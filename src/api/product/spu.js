import request from '@/utils/request'

// 获取spu数据接口：/admin/product/{page}/{limit} get 有参(参数使用params参数传递)
export const reqSpuList = (page , limit , category3Id) => { 
    return request({
        url: `/admin/product/${page}/${limit}`,
        method: 'get',
        params: {category3Id}
    })
 }

//  获取某个spu信息接口：/admin/product/getSpuById/{spuId} get 有参
export const reqSpuInfo = (spuId) => { 
    return request({
        url: `/admin/product/getSpuById/${spuId}`,
        method: 'get',
    })
 }

//  获取品牌信息进行展示接口：/admin/product/baseTrademark/getTrademarkList get 无参
export const reqTradeMarkList = () => { 
    return request({
        url: '/admin/product/baseTrademark/getTrademarkList',
        method: 'get',
    })
 }

//  获取spu图片的接口：/admin/product/spuImageList/{spuId} get 有参
export const reqImageList = (spuId) => { 
    return request({
        url: `/admin/product/spuImageList/${spuId}`,
        method: 'get',
    })
 }

//  获取平台全部销售属性接口：/admin/product/baseSaleAttrList get 无参 整个平台销售属性最多三个
export const reqBaseSaleAttrList = () => { 
    return request({
        url: '/admin/product/baseSaleAttrList',
        method: 'get',
    })
 }


// 添加或更新销售属性的接口：POST /admin/product/updateSpuInfo   /admin/product/saveSpuInfo post 有参
export const reqAddOrUpdateSpu = (spuInfo) => { 
    //有id就是更新
    if (spuInfo.id) {
        return request({
            url: '/admin/product/updateSpuInfo',
            method: 'post',
            data: spuInfo
        })
    }else {
        return request({
            url: '/admin/product/saveSpuInfo',
            method: 'post',
            data: spuInfo
        })
    }
 }

 
//  删除spu的接口：/admin/product/deleteSpu/{spuId} delete 有参
export const reqDeleteSpu = (spuId) => { 
    return request({
        url: `/admin/product/deleteSpu/${spuId}`,
        method:'delete'
    })
 }

 // 获取spu图片的接口：/admin/product/spuImageList/{spuId} get
export const reqSpuImageList = (spuId) => { 
    return request({
        url: `/admin/product/spuImageList/${spuId}`,
        method: 'get'
    })
 }

// 获取销售属性的接口：/admin/product/spuSaleAttrList/{spuId} get
export const reqSpuSaleAttrList = (spuId) => { 
    return request({
        url: `/admin/product/spuSaleAttrList/${spuId}`,
        method: 'get'
    })
 }

// 获取平台属性的接口：/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export const reqAttrInfoList = (category1Id , category2Id , category3Id) => { 
    return request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'get'
    })
 }

//  保存sku接口：/admin/product/saveSkuInfo post 有参
export const reqSaveSkuInfo = (skuInfo) => { 
    return request({
        url: '/admin/product/saveSkuInfo',
        method: 'post',
        data: skuInfo
    })
 }

//  获取sku数据的接口：GET /admin/product/findBySpuId/{spuId} get
export const reqSkuList = (spuId) => { 
    return request({
        url: `/admin/product/findBySpuId/${spuId}`,
        method: 'get'
    })
 }
