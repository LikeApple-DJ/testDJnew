<template>
  <div class="panel">
    <el-button type="primary" @click="fetchHello" :loading="loading">
      获取问候信息
    </el-button>
    <div v-if="data" class="result">
      <p><strong>消息:</strong> {{ data.message }}</p>
      <p><strong>时间戳:</strong> {{ data.timestamp }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getHello } from '../api/index.js'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const data = ref(null)

async function fetchHello() {
  loading.value = true
  try {
    const res = await getHello()
    data.value = res.data
  } catch (e) {
    ElMessage.error('请求失败: ' + e.message)
  } finally {
    loading.value = false
  }
}

// 暴露数据和导出所需的方法，供父组件调用
defineExpose({ data })
</script>

<style scoped>
.panel { padding: 20px; }
.result { margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; }
</style>