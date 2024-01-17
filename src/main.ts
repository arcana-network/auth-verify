import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'

import 'vue-toastification/dist/index.css'

import './assets/main.css'

const toastOptions = {
  timeout: 5000,
  closeOnClick: false,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  draggable: false,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  closeButton: false,
  icon: true,
  rtl: false
}

const app = createApp(App)

app.use(router)
app.use(Toast, toastOptions)

app.mount('#app')
