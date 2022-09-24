<template>
  <div>
    <!-- :model收集数据到spu这个对象 -->
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择人品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 
          upload是上传图片的 
          list-type:文件列表的类型，这是照片墙类型
          :on-preview：图片预览时候会触发
          :on-remove：删除图片时会触发
          file-list:要上传的文件写在这里面，必须是数组类型且必须有name和url字段，
                    因为咱们这里名字不一样，所以在接收到服务器的图片时需要加工
          -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- dislog是对话框 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- 添加销售属性需要给服务器传送三个数据：销售属性id，和销售属性名字 和属性值列表-->
        <el-select
          :placeholder="`还有${unSelecteSaleAttr.length}未选择`"
          v-model="attrIdAndName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unSelecteSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 0 10px"
          :disabled="!attrIdAndName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
      </el-form-item>
      <el-form-item>
        <!-- 当前spu属于自己的销售属性 :data相当于遍历spu.spuSaleAttrList数组-->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column
            prop="spuSaleAttrValueList"
            label="属性值名称列表"
            width="width"
          >
            <template slot-scope="{ row, $index }">
              <!--
                 row是销售属性 row.spuSaleAttrValueList是销售属性值的那个数组
                 el-tag是展示已有的属性值列表
              -->
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 
                input和下面button的切换和之前input和span的点击查看，点击编辑一样 
                 控制button还是input显示的属性值应该放在每一行的销售属性中，每个销售属性都有控制自己
                 隐藏还是显示的变量，不能写在data中。之前的input和span的切换的变量在点击添加属性值的时候给每个属性
                 都添加了一个flag属性
                    -->
              <!-- @keyup.enter.native="handleInputConfirm"
                -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!-- @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="changeShow">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 点击修改后，存储某个spu的信息,这个对象是要交给服务器的
      spu: {
        // 三级分类的id
        category3Id: "",
        // spu名称
        spuName: "",
        // 品牌id
        tmId: "",
        // spu描述
        description: "",
        // spu图片信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        // 平台属性与属性值的收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      // 存储品牌信息
      tradeMarkList: [],
      // 存储spu图片信息
      spuImageList: [],
      // 存储平台全部销售属性
      saleAttrList: [],
      // 收集未选择的销售属性的id
      attrIdAndName: '',
    };
  },
  methods: {
    //删除一个图片时触发:file表示删除的图片，fileList表示剩余的图片数组
    handleRemove(file, fileList) {
      // 收集照片墙图片的数据
      // 照片墙上的图片有name和url字段，服务器不需要这个数据，所以不要直接存在spu（传给服务器的）中
      this.spuImageList = fileList;
    },
    // 预览图片的时候触发
    handlePictureCardPreview(file) {
      // 将预览的图片传给这个属性
      this.dialogImageUrl = file.url;
      // 让对话框可见并展示大图
      this.dialogVisible = true;
    },
    // 点击取消，修改父元素中的show为spuList，显示spuList数据
    changeShow() {
      // 还要清空本页的数据
      // $options可以获取vc的配置对象，$options.data就是vc的数据，data函数执行，返回的响应式数据就是上面的初始化的，空的，然后赋值给this._data
      this.$emit("changeShow", { show: "spuList", flag: "" });
      Object.assign(this._data, this.$options.data());
    },
    // 初始化SpuForm数据
    async initSpuData(spu) {
      // 获取某个spu信息
      let spuResult = await this.$API.spu.reqSpuInfo(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      // 获取品牌信息接口
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取spu图片信息
      let imageResult = await this.$API.spu.reqImageList(spu.id);
      if (imageResult.code == 200) {
        let imageArr = imageResult.data;
        imageArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = imageArr;
      }
      // 获取平台全部销售属性
      let attrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (attrResult.code == 200) {
        this.saleAttrList = attrResult.data;
      }
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      // file:上传成功的图片
      // fileList：全部图片信息
      this.spuImageList = fileList;
    },
    // 添加新销售属性的回调
    addSaleAttr() {
      // 已经收集到需要添加的销售属性的信息在attrIdAndName中
      // 把收集到的属性中id和name进行切割
      // baseSaleAttrId , saleAttrName这两个名字是服务器上这么写，要往服务器上传，所以保持一致
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      // 将数据传入到spu中，先整理数据，把数组变成对象
      let newArr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      this.spu.spuSaleAttrList.push(newArr);
      // 清空输入框的东西
      this.attrIdAndName = "";
    },
    // 点击添加销售属性值按钮的回调
    addSaleAttrValue(row) {
      // 点击添加属性值按钮
      // 第一步：给每个销售属性加一个inputVisible属性，判断是显示button还是显示input
      // 第二步：添加inputValue，获取用户的输入
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    // input失去焦点事件的回调
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      // 判断内容分不能为空和重复
      if (inputValue.trim() == "") {
        this.$message({
          type: "warning",
          message: "输入不能为空",
        });
        return;
      }
      let result = row.spuSaleAttrValueList.some((item) => {
        return inputValue == item.saleAttrValueName;
      });
      if (result) {
        this.$message({
          type: "warning",
          message: "输入不能重复",
        });
        return;
      }
      console.log(result);
      // 把row中的属性值放到spuSaleAttrList，因为只有放到spuSaleAttrList中才能展示出来，先整理，然后push进去
      let newArr = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(newArr);
      row.inputVisible = false;
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理数据，这只有照片数据需要整理，图片都放在spuImageList中，且新添加的图片只有name和url没有imgName和imgUrl
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.Url,
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        //  跳到spuList界面。show：是判断展示哪个页面，flag是判断是添加（跳转到第一页）还是更新（停留在本页）
        this.$emit("changeShow", {
          show: "spuList",
          flag: this.spu.id ? "update" : "add",
        });
        // 清除数据
        Object.assign(this._data, this.$options.data());
      }
    },
    // 点击添加SPU，父组件通知子组件获取数据
    async addSpuData(cateGory3Id) {
      this.spu.category3Id = cateGory3Id;
      // 获取品牌信息接口
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台全部销售属性
      let attrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (attrResult.code == 200) {
        this.saleAttrList = attrResult.data;
      }
    },
  },
  computed: {
    // 计算还未选择的销售属性
    // 整个平台的三个销售属性在saleAttrList中
    // spu自己的销售属性在spu.spuSaleAttrList中
    unSelecteSaleAttr() {
      // filter返回为真，说明需要这个，为假则过滤掉
      return this.saleAttrList.filter((item) => {
        // every返回为真说明spu属性值里没有这个
        return this.spu.spuSaleAttrList.every((value) => {
          return item.name != value.saleAttrName;
        });
      });
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>