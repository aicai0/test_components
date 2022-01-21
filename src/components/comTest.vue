<template>
    <div class="com-test">
        测试组件{{msg}}
    </div>
</template>
<script>
export default {
    name: "comTest",
    props:{
        msg:{
            type: String,
            default: ""
        }
    },
    data(){
        return {}
    }
}
</script>
<style lang="less" scoped>
.com-test{
    color: red;
    font-size: 16px;
}
</style>