<template>
  <div class="box">
    <span class="header">{{ title }}</span>
  </div>
</template>

<style lang="scss" scoped>
.box{
  background:rgba(246,246,246,1);
  box-shadow:1px 5px 7px 0px rgba(0, 0, 0, 0.06);
  padding: 8px 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  .header{
    font-size: 14px;
    display: inline-block;
    margin:10px;
  }
}
</style>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '主标题'
    }
  },
  data() {
    return {}
  }
}
</script>
