<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200px'
    },
    renderData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      const colorList = this.renderData.color
      const title = this.renderData.item.map(item => {
        return item.title
      })
      const dataList = title.map(item => {
        return {
          value: Math.floor(Math.random() * 200),
          name: item
        }
      })
      this.chart.setOption({
        color: colorList,
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        legend: {
          // show: false,
          left: 'center',
          bottom: '0',
          formatter: function(params){
            return params.length > 4 ? (params.substring(0, 4) + '...') : params
          },
          itemHeight: 10,
          itemWidth: 12
        },
        series: [
          {
            type: 'pie',
            data: dataList,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            hoverOffset: 15,
            bottom: 100,
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorList[params.dataIndex]
                }
              }
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{a|{b}：{c}({d}%)}\n{hr|}',
              rich: {
                hr: {
                  backgroundColor: 't',
                  borderRadius: 3,
                  width: 3,
                  height: 3,
                  padding: [3, 3, 0, -12]
                },
                a: {
                  padding: [-30, 15, -20, 15]
                }
              }
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 30,
                lineStyle: {
                  width: 1
                }
              }
            }
          }
        ]
      })
    }
  }
}
</script>
