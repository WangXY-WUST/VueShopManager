<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showForm"
      >添加</el-button
    >
    <!--
       表格组件el-table
       data:表格组件需要展示的数据-----数组类型 这里table要展示的数据是list
       border:表格添加边框
       el-table-column的属性
       label:显示的标题
       width:对应列的宽度
       align:标题的对齐方式
       prop:对应列内容的字段名
       elementUI的table是一列一列展示数据
     -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌Logo" width="width">
        <!-- 这用到作用域插槽，但是没搞懂咋用的，这里的row是每一行的品牌信息，$index是索引值 -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <!-- {{row}} -->
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="min"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器
      current-page:当前第几页
      total：总共多少页
      page-size：每页展示的条数
      pager-count:页面显示的页码数（出去显示的第一个和最后一个，连续页码数就是这个值减去2）
      page-sizes:可以选择每页显示多少条数据
      layout中的->可以让sizes , total去屏幕最右边
      @size-change="handleSizeChange"页数的大小发生改变的时候触发
      @current-change="handleCurrentChange"当前的页数发生改变触发
      -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      :pager-count="7"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; text-align: center"
      layout="prev, pager, next, jumper, -> , sizes , total"
    >
    </el-pagination>
    <!-- 
      对话框 
      :visible.sync：控制对话框的显示与隐藏
      -->
    <el-dialog
      :title="this.tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 
        表单 
        :model属性作用是把表单数据收集到tmForm这个对象身上，将来表单验证需要用到
        :rules：表单验证 。Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
                并将 Form-Item 的 prop 属性设置为需校验的字段名即可
        -->
      <el-form
        style="width: 80%"
        :model="tmForm"
        :rules="rules"
        ref="rulerForm"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <!--
            upLoad上传组件
            这里收集数据不能使用v-model，因为不是表单元素
            action属性：设置你图片上传的地址
            :on-success：可以检测到图片上传成功，当图片上传成功执行一次
            :before-upload:可以在上传图片之前执行一次
               -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      // 当前页码数
      page: 1,
      // 每页展示的条数
      limit: 3,
      // 总共的数据
      total: 0,
      // 展示的数据
      list: [],
      // 对话框的显示与隐藏
      dialogFormVisible: false,
      // 上传图片的属性
      imageUrl: "",
      // 品牌属性
      tmForm: {
        // 这两个属性的名字需要看文档
        tmName: "",
        logoUrl: "",
      },
      // 表单验证功能
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList() {
      // 解构参数
      const { limit, page } = this;
      // 获取品牌列表的接口,向服务器发请求需要两个参数，在data中初始化两个参数
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      } else {
      }
    },
    // 页数发生改变
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    // 每页的展示的条数发生变化；
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 点击显示对话框
    showForm() {
      this.dialogFormVisible = true;
      // 清除对话框中的内容
      this.tmForm.logoUrl = "";
      this.tmForm.tmName = "";
    },
    // 图片上传成功执行的函数
    handleAvatarSuccess(res, file) {
      // res:上传成功之后返回的数据
      // 收集品牌图片数据
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前执行的函数
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加或更新品牌
    addOrUpdateTradeMark() {
      this.$refs.rulerForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 弹出信息
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 再次请求服务器
            this.getPageList();
            // 这里有个小问题，就是你修改结束后，tmForm会有id，下次添加就变成了修改
            // console.log(this.tmForm);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 更新品牌信息 row是当前用户选中的这个品牌的信息
    updateTradeMark(row) {
      // 显示对话框
      this.dialogFormVisible = true;
      /*这里是浅拷贝，因为当你点击修改，弹出对话框，此时如果直接this.tmForm = row,两者共用一个地址的数据
        而对话框中品牌logo和图片都是直接读的tmForm中的数据，所以你还没点确定，或者你点取消，页面已经被修改了，所以用浅拷贝
        原理：当你使用浅拷贝，在对话框中输入值时，tmForm中的tmName和logoUrl会被修改，页面中展示的值是list的数据， 使用浅拷贝两者不会共用一个数据，页面的数据不会被修改，
              而如果你使两者共用统一地址数据，对话框中的值被改，因为list和tmForm共用数据，所以页面的值无论如何都会被修改
       浅拷贝之后，tmForm中就会有个id属性，此时可以判别是更新还是添加
       */
      this.tmForm = { ...row };
    },
    // 删除品牌的操作
    deleteTradeMark(row) {
      this.$confirm(`你确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        // 点击确定按钮触发then
      })
        .then(async () => {
          // 发请求
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次获取品牌列表数据
            this.getPageList();
          }
        })
        // 点击取消按钮触发catch
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>