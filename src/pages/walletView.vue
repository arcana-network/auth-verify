<!-- eslint-disable vue/valid-template-root -->
<template>
  <main class="center">
    <div v-show="loading" class="stack stack-space-4">
      <Loading class="app-icon" />
      <span id="text" class="text-center">Logging in</span>
    </div>

  </main>
</template>

<script lang="ts" setup>
import { getClientStorageKey, type ClientValue } from '@/helpers/utils';
import { AuthProvider } from '@arcana/auth'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import Loading from '../components/loadingSpinner.vue'
let loading = ref(true)

const id = useRoute().params.id as string
let client: ClientValue = localStorage.getItem(getClientStorageKey(id)) as (ClientValue | null) || 'rn'
let removeHandler: (() => void) | null = null
let respondHandler: (data: any, type?: string) => void = () => { }

onMounted(async () => {
  const log = function (log: string) {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ 'type': 'Console', 'data': { 'log': log } }))
  };
  // eslint-disable-next-line no-global-assign
  console = {
    log,
    debug: log,
    info: log,
    warn: log,
    error: log,
  };
  const auth = new AuthProvider(id, {
    network: import.meta.env.VITE_SELF_ENV,
    alwaysVisible: true
  })
  const isStandAlone = client === "rn" || client === "flutter" || client === "unity"
  if (isStandAlone) {
    const mode = client === "rn" || client === "flutter" ? 1 : 2;
    auth["standaloneMode"](mode, (event: string, data: any) => {
      if (event === "wallet_close") {
        respondHandler(null, "hide_webview")
      } else if (event === "open_url") {
        respondHandler(data.url, "open_link")
      }
    })
  }
  await auth.init()
  auth.provider.on('connect', () => {
    loading.value = false
    if (client === "rn" || client === "flutter") {
      document.body.className = 'dark-transparent'
    } else {
      document.body.className = 'dark-opacity'
    }
    auth.showWallet()
    if (client == 'rn') {
      const { respond, destroy } = ReactNativeHandler(auth)
      respondHandler = respond
      removeHandler = destroy
    } else if (client == 'flutter') {
      const { respond, destroy } = FlutterHandler(auth)
      respondHandler = respond
      removeHandler = destroy
    } else if (client == 'unity') {
      const { respond, destroy } = UnityHandler(auth)
      respondHandler = respond
      removeHandler = destroy
    }
    respondHandler(null, "login_complete")
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

  return createWindowListener(auth, respond)
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
  return createWindowListener(auth, respond)
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
  return createWindowListener(auth, respond)
}

const createWindowListener = (auth: AuthProvider,
  respond: (data: any, type?: string) => void) => {

  const eventHandler = (event: MessageEvent) => {
    console.log({ request: event.data })
    handleRequest(event, auth, respond)
  }

  window.addEventListener('message', eventHandler)

  document.body.onclick = (e: MouseEvent) => {
    respond(null, "hide_webview")
    e.stopImmediatePropagation()
  }

  return {
    destroy: () => {
      document.body.onclick = null
      window.removeEventListener('message', eventHandler)
    },
    respond,
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
            result = await auth.provider.request(data.data).finally(() => {
              // hide
              if (requiresPermission) {
                respond(null, "hide_webview")
              }
            })

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


