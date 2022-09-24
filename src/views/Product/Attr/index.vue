<template>
  <div>
    <el-card style="margin: 20px 0">
      <CateGorySelect @getCateGoryId="getCateGoryId" :show = '!isShow'/>
    </el-card>
    <el-card>
      <!-- 数据展示模块 -->
      <div v-show="isShow">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!cateGory3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- data:表格组件需要展示的数据-----数组类型 这里table要展示的数据是attrList -->
        <el-table style="width: 100%" :data="attrList" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <!-- 作用域插槽 row是这一行的数据-->
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 20px"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改模块 -->
      <div v-show="!isShow">
        <!-- 表单中 写:model就是收集数据用的 -->
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <!-- input，select写v-model -->
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShow = true">取消</el-button>
        <!-- table写 :data  :data就相当于遍历了 ， row相当于遍历的每一个元素-->
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row, $index)"
                :ref="$index"
              ></el-input>
              <!-- 需要span与input来回切换 -->
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 使用lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      cateGory1Id: "",
      cateGory2Id: "",
      cateGory3Id: "",
      attrList: [],
      isShow: true,
      // 收集新增属性||修改属性，是之后要传给服务器的数据
      attrInfo: {
        // 属性名
        attrName: "",
        // 属性名对应的属性值
        attrValueList: [],
        // 对应的三级属性id
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 通过自定义事件获取一级、二级、三级ID
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
        this.getAttrList();
      }
    },
    // 向服务器请求数据
    async getAttrList() {
      const { cateGory1Id, cateGory2Id, cateGory3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        cateGory1Id,
        cateGory2Id,
        cateGory3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值按钮回调
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        //这里id不用传，数据库添加id,但是当你修改属性时想添加一个，此时就需要传属性的id，
        // 因为点击修改按钮时，已经深拷贝，attrInfo里面已经有了id的属性
        // 新增的attrid就是undefined
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true, //flag属性用于给每一个属性添加一个标记，用于切换查看模式与编辑模式
      });
      this.$nextTick(() => {
        // 添加时，给最后一个输入框元素聚焦
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 点击添加属性按钮的回调
    addAttr() {
      this.isShow = false;
      // 清除数据;
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.cateGory3Id,
        categoryLevel: 3,
      };
    },
    //点击修改按钮的回调
    updateAttr(row) {
      this.isShow = false;
      // 由于数据的结构中存在对象套数组，数组套对象，因此需要使用深拷贝
      this.attrInfo = cloneDeep(row);
      // 给更新的属性值也加上flag这个属性，
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    //失去焦点，切换为查看模式
    toLook(row) {
      // 判断输入是否为空
      if (row.valueName.trim() == "") {
        this.$message({
          type: "warning",
          message: "输入不能为空",
        });
        return;
      }
      // 判断是否有重复的输入
      let isReapt = this.attrInfo.attrValueList.some((item) => {
        // 先把自己排除在外(row是当前的属性值，item是遍历的属性值)
        if (item != row) {
          return item.valueName == row.valueName;
        }
      });
      if (isReapt) {
        this.$message({
          type: "warning",
          message: "属性不能重复",
        });
        return;
      }
      row.flag = false;
    },
    // 点击span标签，改为输入模式，但是要让input聚焦
    toEdit(row, index) {
      row.flag = true;
      // 本来是想通过ref获取焦点，但是不知道为啥获取不到refs
      // 点击span页面渲染还没完毕，所以获取不到ref
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 气泡确认框确认按钮的回调,模板中的elementui版本低，触发确认事件是onConfirm
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index , 1)
    },
    //添加或修改属性的操作 
    async addOrUpdateAttr() {
      // 整理参数：空的属性值不应该提交给服务器，且flag字段不能提交给服务器
     this.attrInfo.attrValueList =  this.attrInfo.attrValueList.filter((item) => { 
        if (item.valueName != '') {
          // 删除flag属性
          delete item.flag
          return item
        } 
       })
       try {
         await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
         this.isShow = true
         this.$message({
          type: 'success',
          message: '添加成功'
        // 保存成功再次获取平台属性进行展示
       })
        this.getAttrList()
       } catch (error) {
         this.$message('保存失败')
       }
       

    }
  },
};
</script>

<style>
</style>