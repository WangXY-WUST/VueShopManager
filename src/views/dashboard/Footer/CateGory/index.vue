<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="category-header">
          <span>销售额类别占比</span>
          <el-radio-group v-model="radio1">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div>
          <BarChart/>
      </div>
    </el-card>
  </div>
</template>

<script>
import BarChart from './BarChart'
export default {
  name: "CateGory",
  data() {
      return {
          radio1:'全部渠道'
      }
  },
  components:{
      BarChart
  }
};
</script>

<style>
.category-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>