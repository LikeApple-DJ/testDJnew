<template>
  <div class="dashboard">
    <el-tabs v-model="activeTab" type="border-card" @tab-click="onTabChange">
      <el-tab-pane label="HelloWorld" name="hello">
        <HelloTab ref="helloRef" />
      </el-tab-pane>
      <el-tab-pane label="哈希算法" name="hash">
        <HashTab ref="hashRef" />
      </el-tab-pane>
      <el-tab-pane label="冒泡排序" name="sort">
        <SortTab ref="sortRef" />
      </el-tab-pane>
    </el-tabs>

    <div style="margin: 16px 0; text-align: right;">
      <ExportButton :tab="activeTab" />
    </div>

    <el-divider content-position="left">📊 调用统计看板</el-divider>
    <StatsChart />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HelloTab from '../components/HelloTab.vue'
import HashTab from '../components/HashTab.vue'
import SortTab from '../components/SortTab.vue'
import ExportButton from '../components/ExportButton.vue'
import StatsChart from '../components/StatsChart.vue'

const activeTab = ref('hello')
const helloRef = ref(null)
const hashRef = ref(null)
const sortRef = ref(null)

function onTabChange() {
  // Tab 切换时触发的逻辑
}
</script>

<style scoped>
.dashboard {
  padding: 16px;
}
</style>