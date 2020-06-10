<template>
  <div class="box">
    <span class="header">{{ title }}</span>
  </div>
</template>

<style lang="scss" scoped>
.header{
  font-size: 14px;
  display: inline-block;
  margin:10px;
}
</style>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '小标题'
    }
  },
  data() {
    return {}
  }
}
</script>
