<template>
  <el-container class="app-container">
    <el-header v-if="authStore.isLoggedIn" class="app-header">
      <div class="header-left">
        <span class="app-title">Demo Dashboard</span>
      </div>
      <div class="header-right">
        <el-tag type="info" effect="plain">
          {{ authStore.currentUser?.name || authStore.currentUser?.id }}
        </el-tag>
        <el-button type="danger" size="small" @click="handleLogout" style="margin-left: 12px;">
          退出登录
        </el-button>
      </div>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { useAuthStore } from './store/auth.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
.app-container {
  min-height: 100vh;
}
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #409eff;
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.app-title {
  font-size: 18px;
  font-weight: bold;
}
.header-right {
  display: flex;
  align-items: center;
}
</style>