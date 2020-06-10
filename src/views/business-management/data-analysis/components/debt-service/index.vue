<template>
  <div :style="{width: '100%', height: height, padding: padding+ ' 0'}">
    <el-table border :data="tabTitle" :style="{width: '100%', height: '120px' }" :show-header="false">
      <el-table-column
        prop="title"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(lineData,index) in tableData" :key="index" :min-width="'100px'" align="center">
        <template slot-scope="scope">
          <span v-if='scope.$index === 0'>{{ lineData.date }}</span>
          <span v-if='scope.$index === 1'>{{ lineData.address }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script>

export default {
  props: {
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      tableHeight: '120px',
      tabTitle: [
        {
          title: '填表日期'
        },
        {
          title: '资产负债率'
        }
      ],
      tableData: [
        {
          date: '2016-05-02',
          address: '10%'
        },
        {
          date: '2016-05-04',
          address: '15%'
        },
        {
          date: '2016-05-01',
          address: '30%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        },
        {
          date: '2016-05-03',
          address: '40%'
        }
      ]
    }
  },
  computed: {
    padding: function() {
      return (parseInt(this.height) - parseInt(this.tableHeight)) / 2 + 'px'
    }
  }
}
</script>
