<template>
  <div id="app-container">
    <DemoPage />
  </div>
</template>

<script setup>
import DemoPage from './components/DemoPage.vue'
</script>

<style>
body {
  margin: 0;
  padding: 20px;
  background-color: #f5f7fa;
}
#app-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>