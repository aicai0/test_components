<template>
  <div>
    <div class="filter-container" style="text-align: right;">
      <el-button v-if="showAddLine" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="openSelectStartTimeDialog">
        录入数据
      </el-button>
      <el-button v-if="!showAddLine" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-connection" @click="openSelectStartTimeDialog">
        保存
      </el-button>
    </div>
    <el-table
      :data="tableTitle"
      border
      style="width: 100%"
      height="700"
      class="my-table"
      size="mini"
    >
      <el-table-column
        prop="title"
        label="资产"
        width="200"
      >
        <template slot-scope="scope">
          <span :class="tableHeaderClass(scope.row.header)">{{ scope.row.title || '&nbsp;' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(yearData,index) in yearDataList" :key="'left'+index+yearData.id" :min-width="minHeaderWidth">
        <template slot="header">
          <table-year-header
            v-if="yearData.show"
            :year-data="yearData"
            :year-data-list="yearDataList"
            :index="index"
            :length="yearDataList.length"
            :is-lock="true"
            @removeLine="removeLine"
            @selectTime="selectTime"
            @addYear="addYear"
          />
        </template>
        <template slot-scope="scope">
          <div v-if="yearData.show&&scope.row.title&&!scope.row.header" style="width: 100%;text-align: center;">
            <el-input
              v-model="yearData.data['title'+yearData.id+scope.$index]"
              :name="scope.row.title+yearData.id"
              class="my-input"
              :style="{'width':inputWidth}"
              :placeholder="scope.row.title"
              size="mini"
              clearable
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="title2"
        label="负债和所有者权益"
        width="200"
      >
        <template slot-scope="scope">
          <span :class="tableHeaderClass(scope.row.header2)">{{ scope.row.title2 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(yearData,index) in yearDataList" :key="'right'+index+yearData.id" :min-width="minHeaderWidth">
        <template slot="header">
          <table-year-header
            v-if="yearData.show"
            :year-data="yearData"
            :year-data-list="yearDataList"
            :index="index"
            :is-lock="true"
            @removeLine="removeLine"
            @selectTime="selectTime"
            @addYear="addYear"
          />
        </template>
        <template slot-scope="scope">
          <div v-if="yearData.show&&scope.row.title2&&!scope.row.header2" style="width: 100%;text-align: center;">
            <el-input
              v-model="yearData.data['title'+yearData.id+scope.$index]"
              :name="scope.row.title2+yearData.id"
              class="my-input"
              :style="{'width':inputWidth}"
              :placeholder="scope.row.title2"
              size="mini"
              clearable
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="!showAddLine" class="add-another-area">
      <span class="another-area">
        <span class="table-header">{{ supplementaryData.year }}非流动资产合计：</span>
        <el-input
          v-model="supplementaryData.totalNonCurrent"
          placeholder="请输入非流动资产合计"
          suffix-icon="el-icon-date"
          :style="{'width':inputWidth}"
        />
      </span>
      <span class="another-area">
        <span class="table-header">{{ supplementaryData.year }}所有者权益合计：</span>
        <el-input
          v-model="supplementaryData.totalOwnerEquity"
          placeholder="请输入所有者权益合计"
          suffix-icon="el-icon-date"
          :style="{'width':inputWidth}"
        />
      </span>
    </div>

    <el-dialog title="选择录入年月" :visible.sync="selectDataVisible" width="240px">
      <select-start-year :year="startData.year" :month="startData.month" max-width="300px" @selectTime="selectStartTime" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectDataVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addLine()">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import TableYearHeader from './component/tableYearHeader/index'
import SelectStartYear from './component/tableYearHeader/SelectStartYear'
import { balanceSheet } from '@/utils/table-title'

export default {
  components: { TableYearHeader, SelectStartYear },
  data() {
    return {
      startData: {
        year: undefined,
        month: undefined
      },
      selectDataVisible: false,
      minHeaderWidth: '250px',
      inputWidth: '190px',
      tableTitle: balanceSheet,
      yearDataList: [],
      singleYearTemplate: {
        year: undefined,
        isFullYear: false,
        month: undefined,
        data: {
          title1: 'title1'
        },
        show: true
      },
      id: 1
    }
  },
  computed: {
    supplementaryData: function() {
      const firstYearData = this.yearDataList[0]
      if (firstYearData) {
        return { year: firstYearData.year - 1, totalNonCurrent: undefined, totalOwnerEquity: undefined }
      }
      return {}
    },
    showAddLine: function() {
      return this.yearDataList.length === 1 && !this.yearDataList[0]['show']
    }
  },
  created() {
    this.createDominateTable()
  },
  methods: {
    addYear: function(year, index) {
      this.startData = {
        year: year,
        month: 0,
        isFullYear: true
      }
      const singleYearTemplate = this.createYearTemplate()
      this.yearDataList = this.yearDataList.filter(item => item.show).map(item=>{
        return { ...item, id: item.id*2 }
      })
      this.yearDataList.splice(index, 0, singleYearTemplate)
    },
    // 生成日期一列对象
    createYearTemplate() {
      return Object.assign({}, this.singleYearTemplate, this.startData, { id: this.id++ })
    },
    addLine: function() {
      if (this.startData.year === undefined || this.startData.month === undefined) {
        this.$notify({
          title: '提示',
          message: '请选择开始年月',
          type: 'warning'
        })
        return
      }
      const singleYearTemplate = this.createYearTemplate()
      this.yearDataList = this.yearDataList.filter(item => item.show)
      this.yearDataList.push(singleYearTemplate)
      this.selectDataVisible = false
    },
    removeLine: function(index) {
      const len = this.yearDataList.length
      if (len === 1) {
        this.createDominateTable()
      } else {
        this.yearDataList.splice(index, 1)
      }
    },
    createDominateTable: function() {
      this.yearDataList = [{ show: false }]
    },
    selectTime: function(dateArray, index) {
      this.yearDataList[index]['year'] = dateArray[0]
      this.yearDataList[index]['month'] = dateArray[1]
    },
    openSelectStartTimeDialog: function() {
      this.startData = {
        year: undefined,
        month: undefined,
        isFullYear: false
      }
      this.selectDataVisible = true
    },
    selectStartTime: function(dateArray) {
      this.startData = {
        year: dateArray[0],
        month: dateArray[1],
        isFullYear: dateArray[1] === 0
      }
    },
    tableHeaderClass: function(isHeader) {
      return isHeader ? 'table-header' : 'table-title'
    }
  }
}
</script>
<style lang="scss" scoped>
  .add-another-area{

    .another-area{
      display: block;
      margin-top: 10px;
    }
  }
</style>
