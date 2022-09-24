<template>
<el-row :gutter="10">
    <el-col :span="12">
        <Search/>
    </el-col>
    <el-col :span="12">
        <CateGory/>
    </el-col>
</el-row>
</template>

<script>
import Search from './Search'
import CateGory from './CateGory'
export default {
    name:'Footer',
    components:{
        Search,
        CateGory
    }
}
</script>

<style>

</style>