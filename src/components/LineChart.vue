<template>
  <div class="chart-wrapper">
    <h4 class="chart-title">📈 调用趋势（折线图）</h4>
    <v-chart :option="option" autoresize style="height: 300px;" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent])

const props = defineProps({
  data: { type: Array, default: () => [] }
})

const option = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: props.data.map(d => d.name),
    axisLabel: { rotate: 45 }
  },
  yAxis: { type: 'value' },
  series: [{
    data: props.data.map(d => d.value),
    type: 'line',
    smooth: true,
    areaStyle: { opacity: 0.3 },
    lineStyle: { width: 2 },
    itemStyle: { color: '#409EFF' }
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