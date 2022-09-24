<template>
  <div>
    <el-card style="margin: 20px 0">
      <CateGorySelect
        @getCateGoryId="getCateGoryId"
        :show="show != 'spuList'"
      />
    </el-card>
    <el-card>
      <!-- 底部这里由三部分构成 -->
      <!-- 展示spu列表 -->
      <div v-show="show == 'spuList'">
        <!-- 展示spu结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!cateGory3Id"
          style="margin: 20px 0"
          @click="addSpu"
          >添加SPU</el-button
        >
        <!-- table的:data相当于遍历。row相当于遍历的每一个item，这不过需要插槽来展示 -->
        <el-table :data="records" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="skuMessage(row)"
              ></hint-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <hint-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          :current-page="page"
          :total="total"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          style="margin-top: 20px; text-align: center"
          layout="prev, pager, next, jumper, -> , sizes , total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <!-- 添加和修改spu -->
      <SpuForm
        v-show="show == 'spuForm'"
        @changeShow="changeShow"
        ref="spuForm"
      ></SpuForm>
      <!-- 添加sku -->
      <SkuForm
        v-show="show == 'skuForm'"
        ref="sku"
        @changeShow="changeShow"
      ></SkuForm>
    </el-card>
    <!-- 弹出sku列表的对话框 -->
    <el-dialog :title="spu.spuName" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width: 100%" border v-loading = 'loading'>
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <template slot-scope="{row , $index}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
export default {
  name: "Spu",
  components: {
    SkuForm,
    SpuForm,
  },
  data() {
    return {
      cateGory1Id: "",
      cateGory2Id: "",
      cateGory3Id: "",
      // spu列表的数组
      records: [],
      page: 1,
      limit: 3,
      total: 0,
      // 用来判断显示哪部分区域
      show: "spuList",
      // 是否展示对话框
      dialogTableVisible: false,
      // 每一行的spu数据
      spu: {},
      // 服务器获取的sku数据
      skuList: [],
      loading: true
    };
  },
  methods: {
    // 和attr里面一样，获取三级id
    getCateGoryId({ cateGoryId, level }) {
      if (level == 1) {
        this.cateGory1Id = cateGoryId;
        this.cateGory2Id = "";
        this.cateGory3Id = "";
      } else if (level == 2) {
        this.cateGory2Id = cateGoryId;
        this.cateGory3Id = "";
      } else {
        this.cateGory3Id = cateGoryId;
        this.getSpuList();
      }
    },
    // 请求服务器数据进行展示，都是和attr中一样的
    async getSpuList() {
      const { page, limit, cateGory3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, cateGory3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //点击页数，页数发生改变的回调
    handleCurrentChange(pager) {
      this.page = pager;
      this.getSpuList();
    },
    // 每一页展示的数据条数发生变化
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加spu按钮的回调
    addSpu() {
      this.show = "spuForm";
      // 通知子组件向服务请求品牌名称和销售属性
      this.$refs.spuForm.addSpuData(this.cateGory3Id);
    },
    // 修改spu按钮的回调
    updateSpu(row) {
      this.show = "spuForm";
      // 点击这个按钮，让子组件向服务器发请求，获取要修改的数据。两种方法：ref或者$children可以调用子组件的方法
      this.$refs.spuForm.initSpuData(row);
    },
    // 添加sku按钮的回调
    addSku(row) {
      this.show = "skuForm";
      this.$refs.sku.getData(this.cateGory1Id, this.cateGory2Id, row);
    },
    // 子组件点击确定||取消，接收子组件传递过来的show
    changeShow({ show, flag }) {
      if (flag == "add") {
        this.page = 1;
      }
      this.show = show;
      // 点击确定需要重新请求服务器过去最新的spuList
      this.getSpuList();
    },
    // 点击删除spu按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      // console.log(result);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getSpuList();
      }
    },
    // 点击查看sku信息按钮的回调
    async skuMessage(row) {
      this.spu = row;
      this.dialogTableVisible = true;
      let result = await this.$API.spu.reqSkuList(this.spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false
      }
    },
    // 关闭对话框之前执行的回调
    close(done) {
      this.loading = true
      // 清除数据
      this.spuList = []
      // 关闭对话框
      done()
    }
  },
};
</script>

<style>
</style>