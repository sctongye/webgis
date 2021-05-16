import { createRouter, createWebHistory } from 'vue-router'
import HomeMap from '../views/HomeMap.vue'

const routes = [

  {
    path: '/',
    name: 'HomeMap',
    component: HomeMap
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  // URLが挙動がおかしかったため修正
  // history modeで動くか要検証
  history: createWebHistory(),
  routes
})

export default router
