import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import jQuery from 'jquery' //added

import "bootstrap"; //added
import "bootstrap/dist/css/bootstrap.min.css"; //added

const app = createApp(App)
app.use(store)
app.use(router)
app.use(jQuery)
app.mount('#app')