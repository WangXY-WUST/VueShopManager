<template>
  <el-card style="margin: 10px 0">
    <!-- 头部区域 -->
    <div class="clearfix">
      <el-tabs class="tab" v-model="tabName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visited"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <!-- 内容区域 -->
    <el-row :gutter="10">
      <el-col :span="18">
        <BarChart :propName="tabName" />
      </el-col>
      <el-col :span="6">
        <h3>门店{{ showName }}排名</h3>
        <ul class = 'ull'>
          <li>
            <span class="rindex">1</span>
            <span>肯德基</span>
            <span class="rvalue">12345</span>
          </li>
          <li>
            <span class="rindex">2</span>
            <span>肯德基</span>
            <span class="rvalue">12345</span>
          </li>
          <li>
            <span class="rindex">3</span>
            <span>肯德基</span>
            <span class="rvalue">12345</span>
          </li>
          <li>
            <span class="index">4</span>
            <span>肯德基</span>
            <span class="rvalue">12345</span>
          </li>
          <li>
            <span class="index">5</span>
            <span>肯德基</span>
            <span class="rvalue">12345</span>
          </li>
          <li>
            <span class="index">6</span>
            <span>肯德基</span>
            <span class="rvalue">12345</span>
          </li>
          <li>
            <span class="index">7</span>
            <span>肯德基</span>
            <span class="rvalue">12345</span>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import BarChart from "./BarChart";
import dayjs from 'dayjs'
export default {
  name: "Sale",
  data() {
    return {
      tabName: "sale",
      date: [],
    };
  },
  components: {
    BarChart,
  },
  computed: {
    showName() {
      return this.tabName == "sale" ? "销售" : "访问";
    },
  },
  methods:{
    setDay() {
      let day = dayjs().format('YYYY-MM-DD')
      this.date = [day , day]
    },
    setWeek() {
      let day1 = dayjs().day(0).format('YYYY-MM-DD')
      let day2 = dayjs().day(6).format('YYYY-MM-DD')
      this.date = [day1 , day2]
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start , end]
      
    }
  }
};
</script>

<style>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 200px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
.ull {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
ul li {
  height: 8%;
  margin-top: 10px;
}
.rindex {
  float: left;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
.index {
  padding: 0;
  width: 15px;
  float: left;
  left: 10px;
}
ul li span {
  margin: 0 10px;

}
</style>