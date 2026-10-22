import { createRouter, createWebHistory } from 'vue-router'
import ToolsPage from '../views/ToolsPage.vue'

const routes = [
  { path: '/', redirect: '/tools' },
  { path: '/tools', name: 'tools', component: ToolsPage }
]

export default createRouter({
  history: createWebHistory(),
  routes
})