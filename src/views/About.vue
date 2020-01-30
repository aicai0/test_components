<template>
  <div class="about">
    <h1>饼图</h1>
    <div class="echarts" ref="myChart">

    </div>
  </div>
</template>

<script>
export default {
  name:'home',
  props: {
    data: {
      type: Object,
      default: function() {
        return {
          title: "饼状图",
          // xAxis: [],
          // y_value: [],
          xAxis: ["在线", "离线", "火警", "故障"],
          y_value: [
            { value: 200, name: "在线" },
            { value: 400, name: "离线" },
            { value: 100, name: "火警" },
            { value: 300, name: "故障" },
          ],
          overtip: ""
        };
      }
    }
  },
  data(){
    return{

    }
  },
   mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs.myChart);
      // 绘制图表
      myChart.setOption(
        {
          title: {
            text: this.data.title,
            textStyle: {
              fontSize: 14,
              color: "#24BBEE",
              fontStyle: "normal", //主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
              fontWeight: "lighter", //可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
              fontFamily: "PingFangSC-Regular" //主题文字字体，默认微软雅黑
            },
            left: "12px",
            top: '8%',
          },
          color: [
            "#00A0E9",
            "#999999",
            "#E60012",
            "#F19149",
          ],
          tooltip: {},
          legend: {
            orient: "vertical",
            show: true,
            right: 0,
            // top: 20,
            bottom: 10,
            textStyle: {
              width: 50
            },
            data: this.data.xAxis
          },
          grid: {
            left: 0
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          series: [
            {
              name: this.data.overtip,
              radius: ['30%', '70%'],
              type: "pie",
              itemStyle:{
                borderWidth:5,
                borderColor:'#fff',
              },
              label: {
                normal: {
                  show: true,
                  formatter: function(params) {
                    return params.name;
                  }
                }
              },
              data: this.data.y_value
            }
          ]
        },
        true
      );
      window.addEventListener("resize", function() {
        myChart.resize();
      });
    }
  },
  watch: {
    data: {
      // console.log(this.data,'this.data');
      handler(){
        this.drawLine();
      },
      deep:true,
      
    }
  }
}
</script>

<style lang="less" scoped>
.echarts{
  width: 600px;
  height: 600px;
  margin:0 auto;
}
</style>