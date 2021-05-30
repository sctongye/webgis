import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios' //追記
import VueAxios from 'vue-axios' //追記

import 'bootstrap'
import "bootstrap/dist/css/bootstrap.min.css";

const app = createApp(App)
app.use(store).use(router).mount('#app')
app.use(VueAxios,axios) 