<template>
  <div class="chart-wrapper">
    <h4 class="chart-title">🧑‍💼 人员分布（饼图）</h4>
    <div style="margin-bottom: 8px;">
      <el-radio-group v-model="dimension" size="small" @change="$emit('change-dim', dimension)">
        <el-radio-button value="type">人员类型</el-radio-button>
        <el-radio-button value="dept">部门</el-radio-button>
      </el-radio-group>
    </div>
    <v-chart :option="option" autoresize style="height: 280px;" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent])

const props = defineProps({
  data: { type: Array, default: () => [] }
})

defineEmits(['change-dim'])

const dimension = ref('type')

const option = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, type: 'scroll' },
  series: [{
    type: 'pie',
    radius: ['30%', '60%'],
    center: ['50%', '45%'],
    data: props.data.map(d => ({ name: d.name, value: d.value })),
    emphasis: {
      itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' }
    },
    label: { show: true, formatter: '{b}\n{d}%' }
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