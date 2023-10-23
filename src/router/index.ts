import { createRouter, createWebHistory } from 'vue-router'
import LoginInitPage from '../pages/loginInit.vue'
import LoginInitV1Page from '../pages/loginInitV1.vue'
import StartPage from '../pages/startLogin.vue'
import VerifyPage from '../pages/verifyLogin.vue'
import WalletPage from '../pages/walletView.vue'
import MFASetup from '../pages/mfaSetup.vue'
import MFARestore from '../pages/mfaRestore.vue'
import ReconnectV1 from '../pages/reconnectv1.vue'
import Permission from '../pages/permissionTab.vue'

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
      component: MFASetup
    },
    {
      path: '/mfa/:id/restore',
      name: 'mfa-restore',
      component: MFARestore
    },
    {
      path: '/wallet/:id',
      name: 'wallet',
      component: WalletPage
    },
    {
      path: '/v1/reconnect/:id',
      name: 'reconnectv1',
      component: ReconnectV1
    },
    {
      path: '/permission',
      name: 'permission',
      component: Permission
    }
  ]
})

export default router
