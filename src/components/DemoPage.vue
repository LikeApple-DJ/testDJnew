<template>
  <div class="demo-page">
    <h1>三接口演示平台</h1>
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="Hello World" name="hello">
        <HelloPanel ref="helloRef" />
      </el-tab-pane>
      <el-tab-pane label="SHA-256 哈希" name="hash">
        <HashPanel ref="hashRef" />
      </el-tab-pane>
      <el-tab-pane label="冒泡排序" name="sort">
        <SortPanel ref="sortRef" />
      </el-tab-pane>
    </el-tabs>
    <div class="export-bar">
      <el-button type="success" @click="handleExport" :loading="exportLoading">
        导出当前 Tab 结果 (Excel)
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { exportData } from '../api/index.js'
import { ElMessage } from 'element-plus'
import HelloPanel from './HelloPanel.vue'
import HashPanel from './HashPanel.vue'
import SortPanel from './SortPanel.vue'

const activeTab = ref('hello')
const exportLoading = ref(false)
const helloRef = ref(null)
const hashRef = ref(null)
const sortRef = ref(null)

async function handleExport() {
  exportLoading.value = true
  try {
    const type = activeTab.value
    // 根据当前 Tab 获取对应组件的展示数据，传递给导出接口
    const params = { type }
    if (type === 'hash' && hashRef.value?.data) {
      params.input = hashRef.value.data.input
      params.hash = hashRef.value.data.hash
    } else if (type === 'sort' && sortRef.value?.data) {
      params.original = sortRef.value.data.originalArray.join(',')
      params.sorted = sortRef.value.data.sortedArray.join(',')
      params.swaps = sortRef.value.data.swapCount
    }
    const res = await exportData(params)
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', type + '_result.xlsx')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (e) {
    ElMessage.error('导出失败: ' + e.message)
  } finally {
    exportLoading.value = false
  }
}
</script>

<style scoped>
.demo-page { padding: 20px; }
h1 { text-align: center; margin-bottom: 30px; color: #303133; }
.export-bar { margin-top: 20px; text-align: right; }
</style>