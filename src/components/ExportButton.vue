<template>
  <el-button type="success" @click="handleExport" :loading="loading">
    📥 导出当前结果 (CSV)
  </el-button>
</template>

<script setup>
import { ref } from 'vue'
import { exportApi } from '../api/index.js'
import { downloadCsv } from '../utils/export.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  tab: { type: String, default: 'hello' }
})

const loading = ref(false)

async function handleExport() {
  loading.value = true
  try {
    const res = await exportApi.download(props.tab)
    const contentDisposition = res.headers['content-disposition']
    let filename = `export_${props.tab}.csv`
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+?)"?$/)
      if (match) filename = match[1]
    }
    downloadCsv(res.data, filename)
    ElMessage.success('导出成功')
  } catch (e) {
    ElMessage.error('导出失败: ' + (e.response?.data?.error || e.message))
  } finally {
    loading.value = false
  }
}
</script>