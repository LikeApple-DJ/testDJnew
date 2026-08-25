<template>
  <div class="tab-content">
    <div class="tab-controls">
      <el-input v-model="arrayInput" placeholder="输入逗号分隔的数字，如: 3,1,4,1,5,9,2,6" style="width: 400px; margin-right: 12px;" />
      <el-button type="primary" @click="callSort" :loading="loading">
        排序
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
import { sortApi } from '../api/index.js'
import { ElMessage } from 'element-plus'

const arrayInput = ref('3,1,4,1,5,9,2,6')
const loading = ref(false)
const result = ref(null)

async function callSort() {
  if (!arrayInput.value) {
    ElMessage.warning('请输入数字数组')
    return
  }
  const nums = arrayInput.value.split(',').map(s => parseInt(s.trim(), 10))
  if (nums.some(isNaN)) {
    ElMessage.warning('输入格式错误，请使用逗号分隔的数字')
    return
  }
  loading.value = true
  try {
    const res = await sortApi.call(nums)
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