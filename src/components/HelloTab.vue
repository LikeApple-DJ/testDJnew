<template>
  <div class="tab-content">
    <div class="tab-controls">
      <el-button type="primary" @click="callHello" :loading="loading">
        调用 HelloWorld
      </el-button>
    </div>
    <div v-if="result" class="result-panel">
      <h4>执行结果：</h4>
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { helloApi } from '../api/index.js'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const result = ref(null)

async function callHello() {
  loading.value = true
  try {
    const res = await helloApi.call()
    result.value = res.data
  } catch (e) {
    ElMessage.error('调用失败: ' + (e.response?.data?.error || e.message))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.tab-content { padding: 16px; }
.tab-controls { margin-bottom: 16px; }
.result-panel {
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 16px;
}
.result-panel pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>