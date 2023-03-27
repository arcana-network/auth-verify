import { createRouter, createWebHistory } from 'vue-router'
import LoginInitPage from '../pages/loginInit.vue'
import LoginInitV1Page from '../pages/loginInitV1.vue'
import StartPage from '../pages/startLogin.vue'
import VerifyPage from '../pages/verifyLogin.vue'
import WalletPage from '../pages/walletView.vue'
import MFAPage from '../pages/mfaSetup.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/init',
      name: 'login-init-v1',
      component: LoginInitV1Page
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
      path: '/mfa/:id/setup',
      name: 'mfa-setup',
      component: MFAPage
    },
    {
      path: '/wallet/:id',
      name: 'wallet',
      component: WalletPage
    }
  ]
})

export default router
