<!-- eslint-disable vue/valid-template-root -->
<template>
  <main class="center">
    <div v-if="loading" class="stack stack-space-4">
      <Loading class="app-icon" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { CLIENT_STORAGE_KEY, type ClientKey } from '@/helpers/utils';
import { AuthProvider } from '@arcana/auth'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import Loading from '../components/loadingSpinner.vue'
let loading = ref(true)

let client: ClientKey = localStorage.getItem(CLIENT_STORAGE_KEY) as (ClientKey | null) || 'rn'
let removeHandler: (() => void) | null = null

onMounted(async () => {
  document.body.className = 'dark-transparent'
  // document.body.style.backgroundColor = 'rgb(24, 24, 24, 0.8)'
  const id = useRoute().params.id as string
  const auth = new AuthProvider(id, {
    network: import.meta.env.VITE_SELF_ENV,
    alwaysVisible: true
  })
  await auth.init()
  auth.provider.on('connect', () => {
    loading.value = false
    const data = JSON.stringify({ type: 'login_complete' })
      ; (window as any).ReactNativeWebView?.postMessage(data)
      ; (window as any).xarFlutter?.postMessage(data)
    auth.showWallet()
    if (client == 'rn') {
      removeHandler = ReactNativeHandler(auth)
    } else if (client == 'flutter') {
      removeHandler = FlutterHandler(auth)
    } else if (client == 'unity') {
      removeHandler = UnityHandler(auth)
    }
  })
})

onUnmounted(() => {
  if (removeHandler) {
    removeHandler()
  }
})

const ReactNativeHandler = (auth: AuthProvider) => {
  const respond = (data: any, type = 'response') => {
    const response: { type: string, data?: any } = { type };
    if (data) {
      response.data = data;
    }
    console.log({ response: data })
      ; (window as any).ReactNativeWebView?.postMessage(JSON.stringify(response))
  }
  const eventHandler = (event: MessageEvent) => {
    console.log({ request: event.data })
    handleRequest(event, auth, respond)
  }
  window.addEventListener('message', eventHandler)
  return () => {
    window.removeEventListener('message', eventHandler)
  }
}

const FlutterHandler = (auth: AuthProvider) => {
  const respond = (data: any, type = 'response') => {
    const response: { type: string, data?: any } = { type };
    if (data) {
      response.data = data;
    }
    console.log({ response: data })
      ; (window as any).xarFlutter?.postMessage(JSON.stringify(response))
  }
  const eventHandler = (event: MessageEvent) => {
    console.log({ request: event.data })
    handleRequest(event, auth, respond)
  }
  window.addEventListener('message', eventHandler)

  return () => {
    window.removeEventListener('message', eventHandler)
  }
}

const UnityHandler = (auth: AuthProvider) => {
  const respond = (data: any, type = 'response') => {
    const response: { type: string, data?: any } = { type };
    if (data) {
      response.data = data;
    }
    console.log({ response: data })
      ; (window as any).vuplex?.postMessage(JSON.stringify(response))
  }
  const eventHandler = (event: MessageEvent) => {
    console.log({ request: event.data })
    handleRequest(event, auth, respond)
  }
  window.addEventListener('message', eventHandler)

  return () => {
    window.removeEventListener('message', eventHandler)
  }
}

const permissionedCalls = [
  'eth_sign',
  'personal_sign',
  'eth_decrypt',
  'eth_signTypedData_v4',
  'eth_signTransaction',
  'eth_sendTransaction',
  'wallet_switchEthereumChain',
  'wallet_addEthereumChain',
]

const handleRequest = async (
  event: MessageEvent,
  auth: AuthProvider,
  respond: (data: any, type?: string) => void
) => {
  const data = event.data
  if (data && data.type) {
    switch (data.type) {
      case 'request': {
        const { id, method } = data.data
        try {
          let result
          if (method === 'get_user_info') {
            result = await auth.getUser()
          } else {
            //show 
            const requiresPermission = permissionedCalls.includes(method)
            if (requiresPermission) {
              respond(null, "show_webview")
            }
            result = await auth.provider.request(data.data)
            // hide
            if (requiresPermission) {
              respond(null, "hide_webview")
            }

          }
          respond({ result, id })
        } catch (e) {
          respond({ error: e, id })
        }
        break;
      }
      case 'logout': {
        await auth.logout()
        break
      }
    }
  }
}
</script>


