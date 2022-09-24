<template>
  <div>
    <el-table style="width: 100%" :data="skuList">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-sort-down"
            size="mini"
            v-if="row.isSale == 0"
            @click="cancel(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-sort-up"
            size="mini"
            v-else
            @click="sale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showMsg"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="showSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页       -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper , -> , sizes , total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-left: 10px"
            >{{ attr.attrName }}-{{ attr.valueName }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="600x" type="card">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id"> 
              <img :src="item.imgUrl" alt="" style="width:300px;height:300px">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      // 存储展示的sku列表
      skuList: [],
      total: 1,
      // 存储展示详情的数据
      skuInfo: {},
      // 抽屉是否显示
      drawer: false,
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    // 从服务器获取数据
    async getSkuList() {
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.skuList = result.data.records;
      }
    },
    // 当前页面发生改变
    handleCurrentChange(page) {
      this.page = page;
      this.getSkuList();
    },
    // 当前页面大小发生改变
    handleSizeChange(pagesize) {
      this.limit = pagesize;
      this.getSkuList();
    },
    // 商品下架操作
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({
          type: "success",
          message: "下架成功",
        });
      }
    },
    // 上架商品
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({
          type: "success",
          message: "上架成功",
        });
      }
    },
    showMsg() {
      this.$message("正在开发中");
    },
    // 点击查看sku详情
    async showSkuInfo(row) {
      this.drawer = true;
      let result = await this.$API.sku.reqSkuInfo(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>

<style>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>