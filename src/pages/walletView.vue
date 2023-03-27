<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script lang="ts" setup>
import { AuthProvider } from '@arcana/auth'
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

let client = 'rn'
let removeHandler: (() => void) | null = null

onMounted(async () => {
  const id = useRoute().params.id as string
  const auth = new AuthProvider(id, {
    network: import.meta.env.VITE_SELF_ENV,
    alwaysVisible: true
  })
  await auth.init()
  auth.provider.on('connect', () => {
    auth.showWallet()
    if (client == 'rn') {
      removeHandler = ReactNativeHandler(auth)
    } else if (client == 'flutter') {
      removeHandler = FlutterHandler(auth)
    }
  })
})

onUnmounted(() => {
  if (removeHandler) {
    removeHandler()
  }
})

const ReactNativeHandler = (auth: AuthProvider) => {
  const respond = (data: any) => {
    console.log({ response: data })
    ;(window as any).ReactNativeWebView?.postMessage(JSON.stringify({ type: 'response', data }))
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
  const respond = (data: any) => {
    console.log({ response: data })
    ;(window as any).xarFlutter?.postMessage(JSON.stringify({ type: 'response', data }))
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

const handleRequest = async (
  event: MessageEvent,
  auth: AuthProvider,
  respond: (data: any) => void
) => {
  const data = event.data
  if (data && data.type) {
    let result
    const { id, method } = data.data
    switch (data.type) {
      case 'request':
        if (method === 'get_user_info') {
          result = await auth.getUser()
        } else {
          result = await auth.provider.request(data.data)
        }
        respond({ result, id })
        break
      case 'logout':
        await auth.logout()
        respond({ result: 'logout_success', id })
        break
    }
  }
}
</script>


