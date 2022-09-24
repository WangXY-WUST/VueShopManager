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
      title:{
        text:'Search Engine',
        subtext:1048,
        left:'center',
        top:'center'
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    lineCharts.on('mouseover' , (params) => { 
      const {name , value} = params.data
      lineCharts.setOption({
        title:{
          text:name,
          subtext:value
        }
      })
     })
  },
};
</script>

<style scoped>
.echarts {
  width: 100%;
  height: 300px;
}
</style>