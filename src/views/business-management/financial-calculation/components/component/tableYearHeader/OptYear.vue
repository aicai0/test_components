<template>
  <div style="width:30px;display: inline-block;">
    <el-tooltip class="item" effect="dark" :content="title" placement="top">
      <el-button :type="btnType" size="mini" circle :icon="icon" @click="clickEvent" />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '新增下一年'
    },
    icon: {
      type: String,
      default: 'el-icon-plus'
    },
    btnType: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {
    }
  },
  methods: {
    clickEvent: function() {
      this.$emit('clickEvent')
    }
  }
}
</script>
