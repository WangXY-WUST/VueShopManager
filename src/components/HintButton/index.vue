<template>
  <a :title="title" style="margin: 10px">
    <!-- $attrs可以吧接受到的所有属性都绑定到元素上
         $listeners可以触发所有父给子的自定义事件 -->
      <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
    name: 'HintButton',
    props: ['title']
}
</script>

<style>

</style>