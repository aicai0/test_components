<template>
  <div style="width:100%;text-align: center;">
    <opt-year v-if="showBefore" title="添加上一年" icon="el-icon-plus" @clickEvent="addBeforeYear" />
    <select-start-year :is-lock="isLock" :year="yearData.year" :month="yearData.month" @selectTime="selectTime" />
    <opt-year v-if="showDelete" title="移除该列" icon="el-icon-delete" btn-type="danger" @clickEvent="removeLine" />
    <opt-year v-if="showNext" title="添加下一年" icon="el-icon-plus" btn-type="warning" @clickEvent="addNextYear" />
  </div>
</template>

<script>
import OptYear from './OptYear'
import SelectStartYear from './SelectStartYear'

export default {
  components: { OptYear, SelectStartYear },
  props: {
    yearData: {
      type: Object,
      default: function() {
        return {
          year: undefined,
          month: undefined
        }
      }
    },
    index: {
      type: Number,
      default: -1
    },
    length: {
      type: Number,
      default: 0
    },
    yearDataList: {
      type: Array,
      default: function() {
        return []
      }
    },
    isLock: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    showNext: function() {
      console.log('--------------------------------------------')
      console.log(this.yearDataList)
      console.log(this.index, this.yearDataList.length)
      return this.index === this.yearDataList.length - 1
    },
    showBefore: function() {
      return this.index === 0
    },
    showDelete: function() {
      return this.showBefore || this.showNext
    }
  },
  methods: {
    removeLine: function() {
      this.$emit('removeLine', this.index)
    },
    selectTime: function(time) {
      this.$emit('selectTime', time, this.index)
    },
    addBeforeYear: function() {
      const beforeYear = this.yearData.year - 1
      this.$emit('addYear', beforeYear, this.index)
    },
    addNextYear: function() {
      const nextYear = this.yearData.year + 1
      const nowDate = new Date()
      const year = nowDate.getFullYear()
      if (nextYear > year) {
        this.$notify({
          title: '提示',
          message: '最多添加至当前年的数据',
          type: 'warning'
        })
        return
      }
      this.$emit('addYear', nextYear, this.index + 1)
    }
  }
}
</script>
