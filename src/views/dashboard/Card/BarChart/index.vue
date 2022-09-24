<template>
  <div class="echarts" ref="echarts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "BarChart",
  mounted() {
    let lineCharts = echarts.init(this.$refs.echarts);
    lineCharts.setOption({
      xAxis: {
        //   隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        //   隐藏y轴
        show: false,
      },
      series: [
        {
          type: "bar",
          data: [10, 7, 33, 12, 30, 9, 29, 18, 44, 12, 23, 36, 49],
          color:'skyblue'
        },
      ],
      //   布局调试
      grid: {
        left: 10,
        top: 50,
        right: 0,
        buttom: 0,
      },
    });
  },
};
</script>

<style>
.echarts {
  width: 100%;
  height: 100%;
}
</style>