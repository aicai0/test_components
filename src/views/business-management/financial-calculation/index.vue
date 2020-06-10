<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <balance-sheet v-if="activeName=='BS'" />
        <income-statement v-if="activeName=='US'" />
        <crash-flow-sheet v-if="activeName=='JP'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import TabPane from './components/TabPane'
import BalanceSheet from './components/BalanceSheet'
import IncomeStatement from './components/IncomeStatement'
import CrashFlowSheet from './components/CrashFlowSheet'

export default {
  name: 'Tab',
  components: { BalanceSheet, IncomeStatement, CrashFlowSheet },
  data() {
    return {
      tabMapOptions: [
        { label: '资产负债表', key: 'BS' },
        { label: '利润表', key: 'US' },
        { label: '现金流量表', key: 'JP' }
      ],
      activeName: 'BS',
      createdTimes: 0
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    }
  }
}
</script>

<style lang="scss">
  .table-header{
    font-weight: bold;
    font-size: 14px;
    color: #606266;
  }
  .table-title{
    font-weight: normal;
    text-align: right;
    display: block;
    font-size: 12px;
  }
  .my-table{
    &.el-table--mini th, &.el-table--mini td{
      padding:6px 0;
    }
  }
</style>
<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
