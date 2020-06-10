<template>
    <div class="othello">
        <template v-for="(item,index) in 64" >
            <br v-if="index % 8 == 0" :key="index+1">
            <span class="block" :key="index" :id="index"></span>
        </template>
    </div>
</template>
<script>
export default {
    name:'othello',
    data(){
        return {}
    }
}
</script>
<style lang="less" scoped>
.othello{
    .block{
        width: 50px;
        height: 50px;
        display: inline-block;
        background: green;
        border: 1px solid white;
        vertical-align: bottom;
    }
}
</style>