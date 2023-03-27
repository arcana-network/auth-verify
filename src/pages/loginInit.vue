<template>
  <main class="center">
    <iframe ref="iframeRef" />
    <div v-if="!err" class="stack stack-space-4">
      <Loading class="app-icon" />
    </div>
    <div v-else class="stack stack-space-4">
      <img class="app-icon" src="../assets/error-icon.svg" />
      <div class="stack stack-space-3">
        <div class="stack stack-space-1">
          <h1 class="text-center">Authorization Error</h1>
          <h2 id="error-code" class="text-center">Error: {{ err }}</h2>
        </div>
      </div>
    </div>
    <div class="stick-to-bottom">
      <a href="https://arcana.network" target="_blank">
        <img src="../assets/secured-by-arcana.svg" class="footer-logo" alt="Secured by Arcana" />
      </a>
    </div>
  </main>
</template>

<script lang="ts" setup>
import Loading from '../components/loadingSpinner.vue'
import { connectToChild } from 'penpal'
import { redirect, decodeJSON, cleanUrl } from '../helpers/utils'
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'

let err = ref('')
let parentUrl = ''
let theme = 'dark'
let loginSrc = ''
let sessionId = ''
let setToken = ''

let iframeRef: Ref<HTMLIFrameElement | undefined> = ref()

onMounted(async () => {
  const route = useRoute()
  if (!route.hash) {
    return
  }
  const params = getHashParams(route.hash)

  // set to default dark
  theme = params.theme ? params.theme : 'dark'

  localStorage.setItem('CURRENT_THEME', theme)
  document.body.className = theme

  if (!(params.appId && params.parentUrl && params.loginType)) {
    err.value = 'Invalid login params'
    return
  }
  cleanUrl()

  loginSrc = params.loginSrc
  parentUrl = params.parentUrl

  const url = getIframeUrl(
    import.meta.env?.VITE_WALLET_URL || 'http://localhost:3000',
    params.appId
  )
  if (!iframeRef.value) {
    err.value = 'could not set iframe ref'
    return
  }

  iframeRef.value.src = url
  const c = await connectToChild<{
    triggerPasswordlessLogin: (email: string) => Promise<string>
    triggerSocialLogin: (kind: string) => Promise<string>
  }>({
    iframe: iframeRef.value,
    methods: {
      getParentUrl: () => parentUrl,
      error: (error: string) => (err.value = error),
      getPasswordlessParams: getPasswordlessParams,
      getLoginSource: () => loginSrc
    }
  }).promise

  try {
    if (params.loginType === 'passwordless') {
      if (params.email) {
        sessionId = params.sessionId
        setToken = params.setToken
        const url = await c.triggerPasswordlessLogin(params.email)
        replyToOpener({ status: 'done' })
        redirect(url)
      } else {
        err.value = 'Email not available for login with link'
      }
    } else {
      const url = await c.triggerSocialLogin(params.loginType)
      redirect(url)
    }
  } catch (e) {
    if (e instanceof Error) {
      err.value = e.message
    }
  }
})

const getHashParams = (hash: string) => {
  const paramString = hash.substring(1)
  const params = decodeJSON(paramString)
  return params
}

const getPasswordlessParams = () => {
  return { sessionId, setToken }
}

const replyToOpener = (data: any) => {
  window.opener?.postMessage(data, new URL(parentUrl).origin)
}

const getIframeUrl = (baseUrl: string, appId: string) => {
  const url = new URL(`${baseUrl}/${appId}/init/`)
  return url.toString()
}
</script>

<style>
iframe {
  height: 0;
  width: 0;
  border: 0;
}
</style>
