<template>
  <div class="echarts" ref="echarts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "LineChart1",
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
          type: "line",
          data: [10, 7, 33, 12, 30, 9 , 29 , 18 , 44],
          //   拐点样式设置
          itemStyle: {
            opacity: 0,
          },
          // 线条样式
          lineStyle: {
            color: "purple",
          },
          // 填充颜色
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          smooth:true
        },
      ],
      //   布局调试
      grid:{
          left:0,
          top:50,
          right:5,
          buttom:0
      }
    });
  },
};
</script>

<style scoped>
.echarts {
  width: 100%;
  height: 50px;
}
</style>