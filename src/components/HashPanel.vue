<template>
  <div class="panel">
    <el-input
      v-model="inputText"
      placeholder="请输入待加密字符串"
      style="margin-bottom: 15px"
    />
    <el-button type="primary" @click="fetchHash" :loading="loading" :disabled="!inputText">
      加密
    </el-button>
    <div v-if="data" class="result">
      <p><strong>原始字符串:</strong> {{ data.input }}</p>
      <p><strong>算法:</strong> {{ data.algorithm }}</p>
      <p><strong>哈希值:</strong> <code>{{ data.hash }}</code></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getHash } from '../api/index.js'
import { ElMessage } from 'element-plus'

const inputText = ref('')
const loading = ref(false)
const data = ref(null)

async function fetchHash() {
  if (!inputText.value) return
  loading.value = true
  try {
    const res = await getHash(inputText.value)
    data.value = res.data
  } catch (e) {
    ElMessage.error('请求失败: ' + e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.panel { padding: 20px; }
.result { margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; }
code { word-break: break-all; background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
</style>