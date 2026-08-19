<template>
  <div class="algorithm-demo">
    <header class="header">
      <h1>算法演示系统</h1>
      <button
        class="export-btn"
        :disabled="exporting"
        @click="handleExport"
      >
        {{ exporting ? '导出中...' : '导出当前结果' }}
      </button>
    </header>

    <!-- Tab 导航 -->
    <nav class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['tab-btn', { active: activeTab === tab.key }]"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- Tab 内容区 -->
    <main class="tab-content">
      <!-- HelloWorld Tab -->
      <div v-if="activeTab === 'hello'" class="tab-panel">
        <div class="panel-header">
          <h2>HelloWorld</h2>
          <button class="action-btn" @click="runHello" :disabled="loading">
            执行
          </button>
        </div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button class="retry-btn" @click="runHello">重试</button>
        </div>
        <div v-else-if="helloResult" class="result-card">
          <div class="result-item">
            <span class="label">消息：</span>
            <span class="value">{{ helloResult.message }}</span>
          </div>
          <div class="result-item">
            <span class="label">时间戳：</span>
            <span class="value">{{ helloResult.timestamp }}</span>
          </div>
        </div>
        <div v-else class="placeholder">点击"执行"按钮运行 HelloWorld 算法</div>
      </div>

      <!-- Hash Tab -->
      <div v-if="activeTab === 'hash'" class="tab-panel">
        <div class="panel-header">
          <h2>哈希算法 (SHA-256)</h2>
          <button class="action-btn" @click="runHash" :disabled="loading || !hashInput">
            执行
          </button>
        </div>
        <div class="input-area">
          <label>输入字符串：</label>
          <input
            v-model="hashInput"
            type="text"
            placeholder="请输入待计算的字符串"
            @keyup.enter="runHash"
          />
        </div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button class="retry-btn" @click="runHash">重试</button>
        </div>
        <div v-else-if="hashResult" class="result-card">
          <div class="result-item">
            <span class="label">输入：</span>
            <span class="value">{{ hashResult.input }}</span>
          </div>
          <div class="result-item">
            <span class="label">算法：</span>
            <span class="value">{{ hashResult.algorithm }}</span>
          </div>
          <div class="result-item">
            <span class="label">哈希值：</span>
            <span class="value hash-value">{{ hashResult.hashValue }}</span>
          </div>
        </div>
        <div v-else class="placeholder">输入字符串后点击"执行"按钮计算哈希值</div>
      </div>

      <!-- Sort Tab -->
      <div v-if="activeTab === 'sort'" class="tab-panel">
        <div class="panel-header">
          <h2>冒泡排序</h2>
          <button class="action-btn" @click="runSort" :disabled="loading || !sortInput">
            执行
          </button>
        </div>
        <div class="input-area">
          <label>输入数字（逗号分隔）：</label>
          <input
            v-model="sortInput"
            type="text"
            placeholder="例如: 5,3,8,1,2"
            @keyup.enter="runSort"
          />
        </div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button class="retry-btn" @click="runSort">重试</button>
        </div>
        <div v-else-if="sortResult" class="result-card">
          <div class="result-item">
            <span class="label">原始列表：</span>
            <span class="value">[{{ sortResult.original.join(', ') }}]</span>
          </div>
          <div class="result-item">
            <span class="label">排序结果：</span>
            <span class="value highlight">[{{ sortResult.sorted.join(', ') }}]</span>
          </div>
          <div class="result-item">
            <span class="label">交换次数：</span>
            <span class="value">{{ sortResult.swapCount }}</span>
          </div>
        </div>
        <div v-else class="placeholder">输入数字后点击"执行"按钮进行冒泡排序</div>
      </div>
    </main>

    <!-- Toast 提示 -->
    <div v-if="toast" :class="['toast', toast.type]">{{ toast.message }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { fetchHello, fetchHash, fetchSort, exportResult } from '../api/algorithm.js'

// Tab 配置
const tabs = [
  { key: 'hello', label: 'HelloWorld' },
  { key: 'hash', label: '哈希算法' },
  { key: 'sort', label: '冒泡排序' }
]

// 状态
const activeTab = ref('hello')
const loading = ref(false)
const error = ref('')
const exporting = ref(false)
const toast = ref(null)

// HelloWorld 状态
const helloResult = ref(null)

// Hash 状态
const hashInput = ref('')
const hashResult = ref(null)

// Sort 状态
const sortInput = ref('')
const sortResult = ref(null)

// 当前 Tab 对应的算法类型
const currentAlgorithmType = computed(() => {
  const map = { hello: 'HELLO', hash: 'HASH', sort: 'SORT' }
  return map[activeTab.value]
})

// 切换 Tab
function switchTab(key) {
  activeTab.value = key
  error.value = ''
}

// 显示 Toast
function showToast(message, type = 'info') {
  toast.value = { message, type }
  setTimeout(() => { toast.value = null }, 3000)
}

// 执行 HelloWorld
async function runHello() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetchHello()
    if (res.data.code === '200') {
      helloResult.value = res.data.data
    } else {
      error.value = res.data.msg || '执行失败'
    }
  } catch (e) {
    error.value = '网络错误，请重试'
  } finally {
    loading.value = false
  }
}

// 执行哈希计算
async function runHash() {
  if (!hashInput.value.trim()) return
  loading.value = true
  error.value = ''
  try {
    const res = await fetchHash(hashInput.value.trim())
    if (res.data.code === '200') {
      hashResult.value = res.data.data
    } else {
      error.value = res.data.msg || '执行失败'
    }
  } catch (e) {
    error.value = '网络错误，请重试'
  } finally {
    loading.value = false
  }
}

// 执行冒泡排序
async function runSort() {
  if (!sortInput.value.trim()) return
  loading.value = true
  error.value = ''
  try {
    const numbers = sortInput.value.split(',').map(s => {
      const n = parseInt(s.trim(), 10)
      if (isNaN(n)) throw new Error('输入包含非整数')
      return n
    })
    const res = await fetchSort(numbers)
    if (res.data.code === '200') {
      sortResult.value = res.data.data
    } else {
      error.value = res.data.msg || '执行失败'
    }
  } catch (e) {
    error.value = e.message || '网络错误，请重试'
  } finally {
    loading.value = false
  }
}

// 导出当前 Tab 结果
async function handleExport() {
  exporting.value = true
  try {
    const type = currentAlgorithmType.value
    let input = null

    if (type === 'HASH') {
      input = hashInput.value.trim() || 'hello world'
    } else if (type === 'SORT') {
      input = sortInput.value.trim() || '5,3,8,1,2'
    }

    const res = await exportResult(type, input)
    // 触发浏览器下载
    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${type.toLowerCase()}_result.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    showToast('导出成功', 'success')
  } catch (e) {
    showToast('导出失败，请重试', 'error')
  } finally {
    exporting.value = false
  }
}

// 页面加载时自动执行 HelloWorld
runHello()
</script>

<style scoped>
.algorithm-demo {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 2px solid #e4e7ed;
}

.header h1 {
  font-size: 24px;
  color: #303133;
}

.export-btn {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.export-btn:hover:not(:disabled) {
  background-color: #66b1ff;
}

.export-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.tab-nav {
  display: flex;
  gap: 0;
  margin-top: 20px;
  border-bottom: 2px solid #e4e7ed;
}

.tab-btn {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 15px;
  color: #606266;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.3s;
}

.tab-btn:hover {
  color: #409eff;
}

.tab-btn.active {
  color: #409eff;
  border-bottom-color: #409eff;
  font-weight: 600;
}

.tab-content {
  padding: 20px 0;
}

.tab-panel {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h2 {
  font-size: 18px;
  color: #303133;
}

.action-btn {
  padding: 8px 16px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.action-btn:hover:not(:disabled) {
  background-color: #85ce61;
}

.action-btn:disabled {
  background-color: #b3e19d;
  cursor: not-allowed;
}

.input-area {
  margin-bottom: 20px;
}

.input-area label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.input-area input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.input-area input:focus {
  border-color: #409eff;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #909399;
  font-size: 14px;
}

.error {
  text-align: center;
  padding: 40px;
  color: #f56c6c;
}

.retry-btn {
  margin-top: 10px;
  padding: 6px 16px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.result-card {
  padding: 16px;
  background: #f0f9eb;
  border-radius: 6px;
  border: 1px solid #e1f3d8;
}

.result-item {
  padding: 8px 0;
  border-bottom: 1px solid #e1f3d8;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item .label {
  font-weight: 600;
  color: #67c23a;
  margin-right: 8px;
}

.result-item .value {
  color: #303133;
}

.hash-value {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  word-break: break-all;
}

.highlight {
  color: #409eff;
  font-weight: 600;
}

.placeholder {
  text-align: center;
  padding: 40px;
  color: #c0c4cc;
  font-size: 14px;
}

.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 9999;
}

.toast.success {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}

.toast.error {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fde2e2;
}
</style>
