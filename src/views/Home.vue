<template>
  <div class="home">
    <h1>柱图</h1>
    <div @click="go">跳转</div>
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
          title: "柱形图",
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
      // color: [
      //       "#00A0E9",
      //       "#999999",
      //       "#E60012",
      //       "#F19149",
      // ],
    }
  },
  created(){

  },
  mounted() {
    this.drawLine();
  },
  methods: {
    go(){
      window.location.href = "http://192.168.11.43:8083/index#/login?l=wangkai&p=HiFApC5R/CK/cWYbNQIRcQ==&s=fireUnit&to=fireUnitFirefighter&bac=fireUnit&from=otherLogin"
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      // 全局引入时初始化
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
            top: "10px"
          },
          tooltip: {

          },
          toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
          },
          xAxis:  {
            type: 'category',
            boundaryGap: true,
            data: this.data.xAxis ,
            axisLine: {
              lineStyle: {
                color: "#24BBEE"
              }
            },
            axisLabel: {
              color: "#24BBEE"
            },
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: "#24BBEE"
              }
            },
            axisLabel: {
              color: "#24BBEE"
            },
            splitLine:{
              lineStyle:{
                color:'#24BBEE',
              }
            }
          },
          color:this.color,
          grid: {},
          series: [
            {
              name: this.data.overtip,
              type: "bar",
              barWidth:70,
              label: {
                normal: {
                  show: true,
                  formatter: function(params) {
                    return params.name;
                  }
                }
              },
              itemStyle:{
                normal: {
　　　　　　　　　　//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: function(params) {
                            // build a color map as your need.
                      var colorList = ["#00A0E9", "#999999", "#E60012", "#F19149",];
                     return colorList[params.dataIndex]
                  }
                }
              },
              data: this.data.y_value,
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
      handler(){
        console.log(this.data,'this.data');
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
