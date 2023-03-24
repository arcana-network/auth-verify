import { createRouter, createWebHistory } from 'vue-router'
import LoginInitPage from '../pages/loginInit.vue'
import StartPage from '../pages/startLogin.vue'
import VerifyPage from '../pages/verifyLogin.vue'
import WalletPage from '../pages/walletView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/init',
      name: 'home',
      component: LoginInitPage
    },
    {
      path: '/start',
      name: 'home',
      component: StartPage
    },
    {
      path: '/login/init',
      name: 'login-init',
      component: LoginInitPage
    },
    {
      path: '/verify/:id',
      name: 'redirect',
      component: VerifyPage
    },
    {
      path: '/wallet/:id',
      name: 'wallet',
      component: WalletPage
    }
  ]
})

export default router
