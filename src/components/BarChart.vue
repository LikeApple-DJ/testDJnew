<template>
  <div class="chart-wrapper">
    <h4 class="chart-title">📊 人员层级（柱状图）</h4>
    <v-chart :option="option" autoresize style="height: 300px;" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, XAxisComponent, YAxisComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, XAxisComponent, YAxisComponent])

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: props.data.map(d => d.name)
  },
  yAxis: { type: 'value' },
  series: [{
    data: props.data.map(d => d.value),
    type: 'bar',
    barWidth: '40%',
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#67C23A' },
          { offset: 1, color: '#E6A23C' }
        ]
      },
      borderRadius: [4, 4, 0, 0]
    }
  }]
}))
</script>

<style scoped>
.chart-wrapper {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  background: #fff;
}
.chart-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #606266;
}
</style>