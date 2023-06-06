<template>
  <main class="center">
    <div v-if="recoverySuccess" class="center">
      <div class="stack stack-space-4">
        <div class="stack stack-space-4">
          <img class="app-icon" src="../assets/success-icon.svg" />
        </div>
        <h1 id="text" class="text-center">Login Successful</h1>
        <br />
        <span id="text" class="text-center">You can close this window now</span>
      </div>
      <div class="stick-to-bottom">
        <a href="https://arcana.network" target="_blank">
          <img src="../assets/secured-by-arcana.svg" class="footer-logo" alt="Secured by Arcana" />
        </a>
      </div>
    </div>
    <iframe v-else ref="iframeRef" class="full-page-frame" />
  </main>
</template>

<script lang="ts" setup>
import { redirect, cleanUrl } from '../helpers/utils'
import { connectToChild } from 'penpal'
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const iframeRef: Ref<HTMLIFrameElement | undefined> = ref()

const recoverySuccess = ref(false)
const router = useRouter()

let id = ''
onMounted(async () => {
  const route = useRoute()
  document.body.className = 'dark'
  id = route.params.id as string
  const url = getIframeURL(
    import.meta.env?.VITE_WALLET_URL || 'http://localhost:3000',
    `${id}/mfa/restore`
  )
  cleanUrl()
  if (!iframeRef.value) {
    // err.value = 'could not set iframe ref'
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
const getIframeURL = (baseUrl: string, path: string) => {
  const url = new URL(path, baseUrl)
  url.searchParams.append('theme', 'dark')
  return url.toString()
}

const setError = (err: Error) => {
  window.opener?.postMessage({ status: 'error', error: err }, "*")
}

const replyTo = () => {
  recoverySuccess.value = true
  window.opener?.postMessage({ status: 'success' }, "*")
  recoverySuccess.value = true
}
</script>
<style>
.full-page-frame {
  position: fixed;
  z-index: 10;
  inset: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  border: none;
}
</style>
