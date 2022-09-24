<template>
  <div class="dashboard-container">
    <Card/>
    <Sale/>
    <Footer/>
  </div>
</template>

<script>
import Card from './Card'
import Sale from './Sale'
import Footer from './Footer'
export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale,
    Footer
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
