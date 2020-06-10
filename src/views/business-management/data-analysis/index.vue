<template>
  <div class="datat-container">
    <!-- 资产结构 -->
    <main-title :title='"资产结构"' />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <small-title :title="'资产负债率'" />
          <assets-liability-table :height="assetsLibilityFirstLineHeight" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <small-title :title="'资产负债变化图'" />
          <bar-chart :height="assetsLibilityFirstLineHeight" />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col v-for="(item,key) in sevenItem[0]" :key="key" :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <small-title :title="item.title" />
          <pie-chart :height="assetsLibilitySecondPieHeight" :render-data="item" />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col v-for="(item,key) in sevenItem[1]" :key="key" :xs="24" :sm="24" :lg="6">
        <div class="chart-wrapper">
          <small-title :title="item.title" />
          <pie-chart :height="assetsLibilitySecondPieHeight" :render-data="item" />
        </div>
      </el-col>
    </el-row>

    <main-title :title='"偿债能力分析"' />
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <small-title :title="'短期偿债能力指标'" />
          <DebtServiceTable :height="assetsLibilityFirstLineHeight" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <small-title :title="'长期偿债能力指标'" />
          <DebtServiceTable :height="assetsLibilityFirstLineHeight" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import MainTitle from './components/each-main-title'
import SmallTitle from './components/each-small-title'

// 资产结构
import AssetsLiabilityTable from './components/assets-liability/table'
import BarChart from './components/assets-liability/BarChart'
import PieChart from './components/assets-liability/PieChart'

// 偿债能力
import DebtServiceTable from './components/debt-service/index'

export default {
  components: {
    AssetsLiabilityTable,
    BarChart,
    SmallTitle,
    MainTitle,
    PieChart,
    DebtServiceTable
  },
  data() {
    return {
      assetsLibilityFirstLineHeight: '200px', // 资产负债率  资产负债率变化图高度
      assetsLibilitySecondPieHeight: '200px', // 资产负债率  饼状图高度
      sevenItem: [
        [
          {
            title: '总资产结构',
            item: [
              {
                title: '所有者权益'
              },
              {
                title: '非流动负债合计'
              },
              {
                title: '流动资产合计'
              },
              {
                title: '流动负债合计'
              },
              {
                title: '非流动资产合计'
              }
            ],
            color: ['#EA68A2', '#556FB5', '#F8B551', '#32B16C', '#13B5B1']
          },
          {
            title: '资产结构',
            item: [
              {
                title: '非流动资产'
              },
              {
                title: '流动资产'
              }
            ],
            color: ['#13B5B1', '#F19149']
          },
          {
            title: '负债结构',
            item: [
              {
                title: '非流动负债'
              },
              {
                title: '流动负债'
              }
            ],
            color: ['#F8B551', '#32B16C']
          }
        ],
        [
          {
            title: '流动资产',
            item: [
              {
                title: '其它应收款'
              },
              {
                title: '预付款项'
              },
              {
                title: '货币资金'
              },
              {
                title: '应收账款'
              }
            ],
            color: ['#00A0E9', '#32B16C', '#8957A1', '#FF0000']
          },
          {
            title: '非流动资产',
            item: [
              {
                title: '长期待摊费用'
              },
              {
                title: '无形资产'
              },
              {
                title: '长期债券投资'
              }
            ],
            color: ['#13B5B1', '#F19149', '#E4007F']
          },
          {
            title: '流动负债',
            item: [
              {
                title: '其它应收款'
              },
              {
                title: '应付账款'
              },
              {
                title: '预付账款'
              },
              {
                title: '应交税费'
              }
            ],
            color: ['#448ACA', '#FF0000', '#22AC38', '#F19149']
          },
          {
            title: '非流动负债',
            item: [
              {
                title: '长期借款'
              },
              {
                title: '长期应付款'
              }
            ],
            color: ['#22AC38', '#FF0000']
          }
        ]
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.datat-container {
  padding: 32px;
  background-color: #E9E9E9;
  .chart-wrapper {
    background: #F6F6F6;
    padding: 16px;
    margin-bottom: 10px;
    background:rgba(246,246,246,1);
    box-shadow:0px 1px 1px 0px rgba(0, 0, 0, 0.35);
    border-radius:10px;
  }
}
</style>
