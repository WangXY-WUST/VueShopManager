<template>
  <div class="echarts" ref="echarts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "ProgressChart",
  mounted() {
    let lineCharts = echarts.init(this.$refs.echarts);
    lineCharts.setOption({
      xAxis: {
        //   隐藏x轴
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        //   隐藏y轴
        show: false,
        // 均分
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          color: "yellowgreen",
          // 柱状图宽度
          barWidth:12,
          // 开启背景颜色设置
          showBackground:true,
          backgroundStyle:{
            color:'#eee'
          },
          // 文本标签
          label:{
            show:true,
            formatter:'|',
            position:'right'
          }
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