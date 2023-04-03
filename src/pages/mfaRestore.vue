<template>
  <main>
    <iframe ref="iframeRef" class="full-page-frame" />
  </main>
</template>

<script lang="ts" setup>
import { redirect, cleanUrl } from '../helpers/utils'
import { connectToChild } from 'penpal'
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'

let iframeRef: Ref<HTMLIFrameElement | undefined> = ref()
onMounted(async () => {
  const route = useRoute()
  document.body.className = 'dark'
  const id = route.params.id
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
      redirect
    }
  }).promise
})

const getIframeURL = (baseUrl: string, path: string) => {
  const url = new URL(path, baseUrl)
  url.searchParams.append('theme', 'dark')
  return url.toString()
}

const setError = (err: Error, url: string) => {
  const u = new URL(url)
  window.opener?.postMessage({ status: 'error', error: err }, u.origin)
}

const replyTo = (url: string) => {
  if (url) {
    const u = new URL(url)
    window.opener?.postMessage({ status: 'success' }, u.origin)
  }
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
