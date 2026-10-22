<template>
  <div class="tools-page">
    <el-card class="tool-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>算法工具</span>
          <el-button type="primary" @click="handleExport">导出当前结果</el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <!-- helloworld -->
        <el-tab-pane label="helloworld" name="helloworld">
          <el-form :inline="true" @submit.prevent>
            <el-form-item label="名称">
              <el-input v-model="helloName" placeholder="World" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="runHello">执行</el-button>
            </el-form-item>
          </el-form>
          <el-alert v-if="helloResult" type="success" :title="helloResult" :closable="false" />
        </el-tab-pane>

        <!-- 哈希 -->
        <el-tab-pane label="哈希算法" name="hash">
          <el-form label-width="80px" @submit.prevent>
            <el-form-item label="文本">
              <el-input v-model="hashText" type="textarea" :rows="2" placeholder="请输入待哈希文本" />
            </el-form-item>
            <el-form-item label="算法">
              <el-radio-group v-model="hashAlgorithm">
                <el-radio label="MD5">MD5</el-radio>
                <el-radio label="SHA256">SHA256</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="runHash">执行</el-button>
            </el-form-item>
          </el-form>
          <el-descriptions v-if="hashResult" :column="1" border>
            <el-descriptions-item label="算法">{{ hashResult.algorithm }}</el-descriptions-item>
            <el-descriptions-item label="摘要">
              <span class="mono">{{ hashResult.hash }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>

        <!-- 冒泡排序 -->
        <el-tab-pane label="冒泡排序" name="bubble-sort">
          <el-form label-width="80px" @submit.prevent>
            <el-form-item label="数组">
              <el-input v-model="numsText" placeholder="逗号分隔，如 5,2,9,1" />
            </el-form-item>
            <el-form-item label="方向">
              <el-radio-group v-model="sortOrder">
                <el-radio label="ASC">升序</el-radio>
                <el-radio label="DESC">降序</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="runBubble">执行</el-button>
            </el-form-item>
          </el-form>
          <el-descriptions v-if="sortResult" :column="3" border>
            <el-descriptions-item label="原始数组">{{ (sortResult.original || []).join(', ') }}</el-descriptions-item>
            <el-descriptions-item label="排序结果">{{ (sortResult.sorted || []).join(', ') }}</el-descriptions-item>
            <el-descriptions-item label="交换次数">{{ sortResult.swapCount }}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-card class="report-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>调用情况报表</span>
          <div class="report-toolbar">
            <el-select v-model="dimension" style="width: 140px" @change="loadReport">
              <el-option label="人员类型" value="TYPE" />
              <el-option label="人员层级" value="LEVEL" />
              <el-option label="人员部门" value="DEPT" />
            </el-select>
            <el-button @click="loadReport">刷新</el-button>
          </div>
        </div>
      </template>

      <div v-loading="reportLoading" class="charts">
        <div class="chart-block">
          <div class="chart-title">调用趋势（折线图）</div>
          <div ref="lineChartRef" class="chart"></div>
        </div>
        <div class="chart-block">
          <div class="chart-title">维度分布（饼图）</div>
          <div ref="pieChartRef" class="chart"></div>
        </div>
        <div class="chart-block">
          <div class="chart-title">维度分布（柱状图）</div>
          <div ref="barChartRef" class="chart"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import {
  callHello,
  callHash,
  callBubbleSort,
  fetchTrend,
  fetchDistribution,
  exportResult
} from '../api/tools'

const activeTab = ref('helloworld')

// ---- helloworld ----
const helloName = ref('')
const helloResult = ref('')

// ---- hash ----
const hashText = ref('')
const hashAlgorithm = ref('MD5')
const hashResult = ref(null)

// ---- bubble sort ----
const numsText = ref('5, 2, 9, 1')
const sortOrder = ref('ASC')
const sortResult = ref(null)

// ---- report ----
const dimension = ref('TYPE')
const reportLoading = ref(false)
const lineChartRef = ref(null)
const pieChartRef = ref(null)
const barChartRef = ref(null)
let lineChart = null
let pieChart = null
let barChart = null

async function runHello() {
  try {
    const { data } = await callHello({ name: helloName.value })
    helloResult.value = data?.data?.message || ''
  } catch (e) {
    ElMessage.error(e.message)
  }
}

async function runHash() {
  try {
    const { data } = await callHash({ text: hashText.value, algorithm: hashAlgorithm.value })
    hashResult.value = data?.data || null
  } catch (e) {
    ElMessage.error(e.message)
  }
}

async function runBubble() {
  try {
    const nums = numsText.value.split(',').map((s) => Number(s.trim()))
    const { data } = await callBubbleSort({ nums, order: sortOrder.value })
    sortResult.value = data?.data || null
  } catch (e) {
    ElMessage.error(e.message)
  }
}

async function loadReport() {
  reportLoading.value = true
  try {
    const [trendResp, distResp] = await Promise.all([
      fetchTrend({}),
      fetchDistribution({ dimension: dimension.value })
    ])
    const trend = trendResp.data?.points || []
    const items = distResp.data?.items || []
    renderLine(trend)
    renderPie(items)
    renderBar(items)
  } catch (e) {
    ElMessage.error(e.message)
  } finally {
    reportLoading.value = false
  }
}

function renderLine(points) {
  lineChart = lineChart || echarts.init(lineChartRef.value)
  lineChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: (points || []).map((p) => p.time) },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: (points || []).map((p) => p.count), smooth: true }]
  })
}

function renderPie(items) {
  pieChart = pieChart || echarts.init(pieChartRef.value)
  pieChart.setOption({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: (items || []).map((i) => ({ name: i.key, value: i.count }))
    }]
  })
}

function renderBar(items) {
  barChart = barChart || echarts.init(barChartRef.value)
  barChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: (items || []).map((i) => i.key) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: (items || []).map((i) => i.count) }]
  })
}

async function handleExport() {
  try {
    const payload = buildExportPayload()
    const res = await exportResult(payload)
    const blob = new Blob([res.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `export_${activeTab.value}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (e) {
    ElMessage.error(e.message)
  }
}

function buildExportPayload() {
  if (activeTab.value === 'helloworld') {
    return { type: 'helloworld', format: 'xlsx', params: JSON.stringify({ name: helloName.value }) }
  }
  if (activeTab.value === 'hash') {
    return {
      type: 'hash',
      format: 'xlsx',
      params: JSON.stringify({ text: hashText.value, algorithm: hashAlgorithm.value })
    }
  }
  if (activeTab.value === 'bubble-sort') {
    return {
      type: 'bubble-sort',
      format: 'xlsx',
      params: JSON.stringify({
        nums: numsText.value.split(',').map((s) => Number(s.trim())),
        order: sortOrder.value
      })
    }
  }
  return { type: 'report', format: 'xlsx', params: JSON.stringify({ dimension: dimension.value }) }
}

function resizeCharts() {
  ;[lineChart, pieChart, barChart].forEach((c) => c && c.resize())
}

onMounted(async () => {
  await nextTick()
  await loadReport()
  window.addEventListener('resize', resizeCharts)
})
</script>

<style scoped>
.tools-page {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 16px;
}
.tool-card {
  margin-bottom: 16px;
}
.report-card {
  margin-bottom: 16px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.report-toolbar {
  display: flex;
  gap: 8px;
}
.charts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.chart-block {
  border: 1px solid #ebeef5;
  border-radius: 6px;
  padding: 8px;
}
.chart-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.chart {
  height: 260px;
}
.mono {
  font-family: monospace;
  word-break: break-all;
}
</style>