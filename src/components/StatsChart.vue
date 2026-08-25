<template>
  <div class="stats-container">
    <div class="stats-grid">
      <div class="stats-item">
        <LineChart :data="timeData" />
      </div>
      <div class="stats-item">
        <PieChart :data="pieData" @change-dim="onPieDimChange" />
      </div>
      <div class="stats-item">
        <BarChart :data="barData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { statsApi } from '../api/index.js'
import { ElMessage } from 'element-plus'
import LineChart from './LineChart.vue'
import PieChart from './PieChart.vue'
import BarChart from './BarChart.vue'

const timeData = ref([])
const pieData = ref([])
const barData = ref([])
const pieDim = ref('type')

async function loadData() {
  try {
    const [timeRes, pieRes, barRes] = await Promise.all([
      statsApi.getCalls('time'),
      statsApi.getCalls(pieDim.value),
      statsApi.getCalls('level')
    ])
    timeData.value = timeRes.data.data || []
    pieData.value = pieRes.data.data || []
    barData.value = barRes.data.data || []
  } catch (e) {
    // 如果无数据，静默处理
    if (e.response?.status !== 401) {
      console.warn('统计数据加载失败', e.message)
    }
  }
}

function onPieDimChange(dim) {
  pieDim.value = dim
  statsApi.getCalls(dim).then(res => {
    pieData.value = res.data.data || []
  }).catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.stats-container {
  margin-top: 16px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.stats-item {
  min-width: 0;
}
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>