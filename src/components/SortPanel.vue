<template>
  <div class="panel">
    <el-form :inline="true">
      <el-form-item label="数组大小">
        <el-input-number v-model="arraySize" :min="3" :max="50" :step="1" />
      </el-form-item>
      <el-form-item label="最小值">
        <el-input-number v-model="minVal" :min="0" :max="999" />
      </el-form-item>
      <el-form-item label="最大值">
        <el-input-number v-model="maxVal" :min="1" :max="1000" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="fetchSort" :loading="loading">
      开始排序
    </el-button>
    <div v-if="data" class="result">
      <p><strong>原始数组:</strong> {{ data.originalArray.join(', ') }}</p>
      <p><strong>排序后数组:</strong> {{ data.sortedArray.join(', ') }}</p>
      <p><strong>总轮次:</strong> {{ data.totalRounds }} | <strong>交换次数:</strong> {{ data.swapCount }}</p>
      <el-collapse>
        <el-collapse-item title="查看排序过程">
          <div v-for="step in data.steps" :key="step.round">
            <p><strong>第 {{ step.round }} 轮:</strong> {{ step.array.join(', ') }}</p>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getBubbleSort } from '../api/index.js'
import { ElMessage } from 'element-plus'

const arraySize = ref(10)
const minVal = ref(1)
const maxVal = ref(100)
const loading = ref(false)
const data = ref(null)

async function fetchSort() {
  loading.value = true
  try {
    const res = await getBubbleSort({
      arraySize: arraySize.value,
      min: minVal.value,
      max: maxVal.value
    })
    data.value = res.data
  } catch (e) {
    ElMessage.error('请求失败: ' + e.message)
  } finally {
    loading.value = false
  }
}

// 暴露排序结果数据，供父组件导出时使用
defineExpose({ data })
</script>

<style scoped>
.panel { padding: 20px; }
.result { margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; }
</style>