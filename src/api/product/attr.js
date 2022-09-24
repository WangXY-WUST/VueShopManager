import request from '@/utils/request'

// 获取一级目录API：/admin/product/getCategory1 get 无参
export const reqCateGory1List = () => { 
    return request({
        url: '/admin/product/getCategory1',
        method: 'get'
    })
 }
// 获取二级目录API ：/admin/product/getCategory2/{category1Id} get 有参
export const reqCateGory2List = (category1Id) => { 
    return request({
        url: `/admin/product/getCategory2/${category1Id}`,
        method: 'get'
    })
 }
// 获取三级目录API：/admin/product/getCategory3/{category2Id} get 有参
export const reqCateGory3List = (category2Id) => { 
    return request({
        url: `/admin/product/getCategory3/${category2Id}`,
        method: 'get'
    })
 }

//  获取商品API：/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get 有参
export const reqAttrList = (category1Id, category2Id, category3Id) => { 
    return request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'get'
    })
 }


// 添加或更新商品属性的API：POST /admin/product/saveAttrInfo 有参
export const reqAddOrUpdateAttr = data => { 
    return request({
        url: '/admin/product/saveAttrInfo',
        method: 'post',
        data
    })
 }


