<template>
  <div class="echarts" ref="echarts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "BarChart",
  props:['propName'],
  data() {
    return {
      lineCharts:null
    }
  },
  mounted() {
    this.lineCharts = echarts.init(this.$refs.echarts);
    this.lineCharts.setOption({
      title:{
        text:'销售额趋势'
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220 , 79 , 49 , 81 , 66 , 88],
          color:'yellowgreen'
        },
      ],
    });
  },
  watch: {
    propName() {
      this.lineCharts.setOption({
        title:{
          text:this.propName == 'sale'? "销售额趋势":'访问量趋势'
        }
      })
    }
  }
};
</script>

<style scoped>
.echarts {
  width: 100%;
  height: 300px;
}
</style>