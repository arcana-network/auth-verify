<template>
  <main class="center">
    <iframe ref="iframeRef" />
    <div v-if="!err" class="stack stack-space-4">
      <div v-if="loading" class="stack stack-space-4">
        <Loading class="app-icon" />
      </div>
      <div v-else class="stack stack-space-4">
        <img class="app-icon" src="../assets/success-icon.svg" />
      </div>
      <h1 v-if="message" id="text" class="text-center">{{ message }}</h1>
      <span v-if="desc" id="text" class="text-center">{{ desc }}</span>
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
import { redirect, cleanUrl } from '../helpers/utils'
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter, type LocationQuery } from 'vue-router'

let err = ref('')
let loading = ref(true)
let message = ref('')
let desc = ref('Logging in')
let id = ''
let iframeRef: Ref<HTMLIFrameElement | undefined> = ref()
const router = useRouter()

onMounted(async () => {
  document.body.className = 'dark'
  const route = useRoute()
  let hash = route.hash
  if (!hash) {
    const query = getQueryString(route.query)
    if (!query) {
      err.value = 'Invalid params in redirect'
      return
    } else {
      hash = query
    }
  }
  id = route.params.id as string
  const url = getIframeURL(import.meta.env?.VITE_WALLET_URL || 'http://localhost:3000', id, hash)
  cleanUrl()
  if (!iframeRef.value) {
    err.value = 'could not set iframe ref'
    return
  }
  iframeRef.value.src = url
  await connectToChild({
    iframe: iframeRef.value,
    methods: {
      replyTo,
      error: setError,
      redirect,
      goToWallet
    }
  }).promise
})

const goToWallet = () => {
  router.push({ path: `/wallet/${id}` })
}

const getQueryString = (queryParams: LocationQuery) => {
  const u = new URLSearchParams()
  for (const k in queryParams) {
    u.append(k, queryParams[k] as string)
  }
  return u.toString()
}

const getIframeURL = (baseUrl: string, appId: string, hash: string) => {
  const url = new URL(`${appId}/redirect/`, baseUrl)
  url.hash = hash
  return url.toString()
}

const setError = (err: Error | string) => {
  if (err === 'LOCAL_SHARE_MISSING') {
    return router.push({ name: 'mfa-restore', params: { id } })
  }
  window.opener?.postMessage({ status: 'error', error: err }, "*")
}

const replyTo = () => {
  window.opener?.postMessage({ status: 'success' }, "*")

  loading.value = false
  message.value = 'Login Successful'
  desc.value = 'You can close this window now'
}
</script>

<style>
iframe {
  height: 0;
  width: 0;
  border: 0;
}
</style>
