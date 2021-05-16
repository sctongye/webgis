import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import GeoMap from '../views/GeoMap.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/map',
    name: 'Map',
    component: GeoMap
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
