<template>
  <e-charts class="charts"
            ref="chart"
            :options="options"
            theme="macarons">
  </e-charts>
</template>

<script>
  import 'echarts'
  import ECharts from 'vue-echarts/components/ECharts'
  require('echarts/theme/macarons') // echarts theme
  export default {
    name: 'dash-chart',
    components: {
      ECharts
    },
    props: {
      options: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
      }
    },
    methods: {
      setOption() {
        this.$refs.chart.setOption(this.options)
      }
    },
    mounted() {
      window.addEventListener('resize', () => {
        this.$refs.chart.resize()
      })
    },
    watch: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.charts
  width: 100%
  height: 100%
</style>
