<template>
  <div class="my-picker" :style="{'max-width':maxWidth}">
    <el-cascader
      :value="value"
      :options="options"
      placeholder="选择年月"
      @change="handleChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    year: {
      type: Number,
      default: -1
    },
    month: {
      type: Number,
      default: -1
    },
    maxWidth: {
      type: String,
      default: '155px'
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
    value: function() {
      return [this.year, this.month]
    },
    options: function() {
      console.log(this.isLock)
      const nowDate = new Date()
      const year = this.isLock ? this.year : nowDate.getFullYear()
      const end = this.isLock ? this.year : 1990
      const options = []
      for (let first = year; first >= end; first--) {
        const temp = {
          value: first,
          label: first + '年',
          children: [
            {
              value: 0,
              label: '全年'
            }
          ]
        }
        for (let i = 1; i <= 11; i++) {
          temp.children.push({
            value: i,
            label: i + '月底'
          })
        }
        options.push(temp)
      }
      return options
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('selectTime', value)
    }
  }
}
</script>

<style scoped>
  .my-picker{
    display: inline-block;
  }
</style>
