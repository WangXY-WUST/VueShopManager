<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <!-- option的value用来收集属性 这里需要收集属性的id和属性值的id，交给select，select将数据存储在每个属性中-->
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column prop="prop" width="80" type="selection">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSku">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      //   图片存储
      spuImageList: [],
      //   销售属性存储
      spuSaleAttrList: [],
      //   平台属性存储
      attrInfoList: [],
      //   上传给服务器的数据
      skuInfo: {
        //   父组件传过来的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 需要双向绑定收集
        price: 0,
        skuDesc: "",
        weight: "",
        skuName: "",
        // 自己书写代码进行收集
        skuAttrValueList: [
          //   {
          //     attrId: 0,
          //     valueId: 0,
          //   },
        ],
        skuDefaultImg: "string",
        skuImageList: [
          //   {
          //     id: 0,
          //     imgName: "string",
          //     imgUrl: "string",
          //     isDefault: "string",
          //     skuId: 0,
          //     spuImgId: 0,
          //   },
        ],
        skuSaleAttrValueList: [
          //   {
          //     id: 0,
          //     saleAttrId: 0,
          //     saleAttrName: "",
          //     saleAttrValueId: 0,
          //     saleAttrValueName: "",
          //     skuId: 0,
          //     spuId: 0,
          //   },
        ],
      },
      spu: {},
      //   收集用户选中的图片信息
      imageList: [],
    };
  },
  methods: {
    //   获取服务器数据
    async getData(cateGory1Id, cateGory2Id, row) {
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spu = row;
      const urls = [
        this.$API.spu.reqSpuImageList(row.id),
        this.$API.spu.reqSpuSaleAttrList(row.id),
        this.$API.spu.reqAttrInfoList(
          cateGory1Id,
          cateGory2Id,
          row.category3Id
        ),
      ];
      let result = await Promise.all(
        urls.map((url) => url.then((response) => response.data))
      );
      let list = result[0];
      //   图片信息获取到的时候，给每一个图片信息加上isDefault参数
      list.forEach((item) => {
        item.isDefault = 0;
      });
      this.spuImageList = list;
      this.spuSaleAttrList = result[1];
      this.attrInfoList = result[2];
    },
    // 取消按钮的回调
    cancel() {
      this.$emit("changeShow", { show: "spuList", flag: "" });
      //   清空数据
      Object.assign(this._data, this.$options.data());
    },
    // 选项发生变化时触发
    handleSelectionChange(params) {
      // console.log(params);
      // 获取到用户选中的图片的信息，但是图片信息中没有isDefault字段，所以在上传给服务器的时候需要整理
      this.imageList = params;
    },
    //设置默认值按钮的回调(排他)
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      //  顺便收集默认图片的信息
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 保存按钮的回调
    async saveSku() {
      // 整理数据，将销售属性的值和平台属性的值整理到spuInfo下的销售属性和平台属性
      const { skuInfo, attrInfoList, spuSaleAttrList, imageList } = this;
      // reduce第一个参数是函数，函数的第一个参数是初始值或者返回值 ，第二个参数是当前元素
      // 第二个参数是传递的初始值
      // 平台属性
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        // 如果有这个属性，说明用户选过了
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({attrId, valueId});
        }
        return prev;
      }, []);
      //  销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        // 如果有这个属性，说明用户选过了
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(":");
          prev.push({saleAttrId, saleAttrValueId});
        }
        return prev;
      }, []);
      //   整理图片数据  map映射一个新的数组赋值给skuInfo.skuImageList
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      //    发送请求
      let result = await this.$API.spu.reqSaveSkuInfo(skuInfo);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        this.$emit("changeShow", { show: "spuList", flag: "" });
        // Object.assign(this._data, this.$options.data());
      }
    },
  },
};
</script>

<style>
</style>