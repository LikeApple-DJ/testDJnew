<template>
  <div class="tab-content">
    <div class="tab-controls">
      <el-input v-model="inputText" placeholder="输入要哈希的字符串" style="width: 300px; margin-right: 12px;" />
      <el-select v-model="algorithm" style="width: 150px; margin-right: 12px;">
        <el-option label="SHA-256" value="SHA-256" />
        <el-option label="MD5" value="MD5" />
        <el-option label="SHA-512" value="SHA-512" />
        <el-option label="SHA-1" value="SHA-1" />
      </el-select>
      <el-button type="primary" @click="callHash" :loading="loading">
        计算哈希
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
import { hashApi } from '../api/index.js'
import { ElMessage } from 'element-plus'

const inputText = ref('Hello World')
const algorithm = ref('SHA-256')
const loading = ref(false)
const result = ref(null)

async function callHash() {
  if (!inputText.value) {
    ElMessage.warning('请输入字符串')
    return
  }
  loading.value = true
  try {
    const res = await hashApi.call(inputText.value, algorithm.value)
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
.tab-controls {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
}
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