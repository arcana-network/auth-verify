<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const iframeRef = ref<HTMLIFrameElement | undefined>()
const baseUrl = import.meta.env?.VITE_WALLET_URL || 'http://localhost:3000'

onMounted(async () => {
  document.body.className = 'dark'
  const url = new URL(`/${route.params.id}/sell/transak`, baseUrl)
  if (route.query) {
    for (const k of Object.keys(route.query)) {
      url.searchParams.append(k, route.query[k] as string)
    }
  }
  if (!iframeRef.value) {
    console.error('could not set iframe ref')
    return
  }
  iframeRef.value.src = url.href
})
</script>

<template>
  <main class="center">
    <iframe ref="iframeRef" />
  </main>
</template>

<style scoped>
iframe {
  width: 100vw;
  height: 100vh;
}
</style>
