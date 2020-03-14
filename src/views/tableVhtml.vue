<template>
  <div class="table-v-html">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="img" label="图片">
            <slot slot-scope="data">
              <div v-html="data.row.img"></div>
            </slot>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import rssi0 from '../assets/imgs/rssi0.png';
import rssi1 from '../assets/imgs/rssi1.png';
import rssi2 from '../assets/imgs/rssi2.png';
export default {
  name: "tableVhtml",
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: '上海市普陀区金沙江路 1518 弄',
          img: `<img class='voltage-img' src=' ${rssi0} ' alt=''>`
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: '上海市普陀区金沙江路 1518 弄' ,
          img:`<img class='voltage-img' src=' ${rssi1} ' alt=''>`
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: '上海市普陀区金沙江路 1518 弄' ,
          img:`<img class='voltage-img' src=' ${rssi2} ' alt=''>`
        },
      ]
    };
  },
  methods:{}
};
</script>
<style lang="less" scoped>
.table-v-html {
    /deep/ .voltage-img{
        display: inline-block;
        width: 27px;
        height: 17px;
    }
}
</style>