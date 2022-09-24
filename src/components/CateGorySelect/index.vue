<template>
  <div>
    <!-- 
        表单
        :inline：代表行内表单，一行可以放置多个表单元素
       -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
          <!--
               v-model的值为当前被选中的el-option的 value 属性值，
               el-select将el-option的value值存进cForm.cateGory1Id中，展示的就是当前所选择的option的label
           -->
        <el-select
          placeholder="请选择"
          v-model="cForm.cateGory1Id"
          @change="getCateGory2List"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.cateGory2Id"
          @change="getCateGory3List"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.cateGory3Id" @change="sendCategoryId" :disabled="show">
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CateGorySelect",
  props: ['show'],
  data() {
    return {
      // 一级目录数据
      list1: [],
      // 二级目录数据
      list2: [],
      //   三级目录数据
      list3: [],
      //   表单数据，收集id
      cForm: {
        cateGory1Id: "",
        cateGory2Id: "",
        cateGory3Id: "",
      },
    };
  },
  mounted() {
    //   请求服务器获取一级目录
    this.getCateGory1List();
  },
  methods: {
    //   获取一级目录
    async getCateGory1List() {
      let result = await this.$API.attr.reqCateGory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    //   获取二级目录
    async getCateGory2List() {
      this.cForm.cateGory2Id = "";
      this.cForm.cateGory3Id = "";
      this.list2 = '';
      this.list3 = ''
      // 向父组件传送一级id
      this.$emit('getCateGoryId' , {cateGoryId:this.cForm.cateGory1Id , level : 1})
      let result = await this.$API.attr.reqCateGory2List(
        this.cForm.cateGory1Id
      );
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    // 获取三级目录
    async getCateGory3List() {
      this.cForm.cateGory3Id = "";
      this.list3 = ''
      // 向父组件传送二级id
      this.$emit('getCateGoryId' , {cateGoryId:this.cForm.cateGory2Id , level : 2})
      let result = await this.$API.attr.reqCateGory3List(
        this.cForm.cateGory2Id
      );
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    // 向父组件传送三级id
    sendCategoryId() {
        this.$emit('getCateGoryId' , {cateGoryId:this.cForm.cateGory3Id , level : 3})
    }
  },
};
</script>

<style>
</style>