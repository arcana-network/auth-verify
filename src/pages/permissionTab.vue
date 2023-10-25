<template>
  <main class="center">
    <iframe ref="iframeRef" class="iframe" />
    <div v-if="err" class="stack stack-space-4">
      <img class="app-icon" src="../assets/error-icon.svg" />
      <div class="stack stack-space-3">
        <div class="stack stack-space-1">
          <h1 class="text-center">Error</h1>
          <h2 id="error-code" class="text-center">{{ err }}</h2>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import type { Ref } from 'vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { connectToChild } from 'penpal'

const baseUrl = import.meta.env?.VITE_WALLET_URL || 'http://localhost:3000'
let err = ref('')
let iframeRef: Ref<HTMLIFrameElement | undefined> = ref()

onMounted(async () => {
  const route = useRoute()
  const hash = route.hash
  if (!hash) {
    // TODO: send back error to close
    err.value = 'Invalid params'
    return
  }
  const url = new URL('/permission/', baseUrl)
  url.hash = hash
  if (!iframeRef.value) {
    err.value = 'could not load wallet'
    return
  }
  iframeRef.value.src = url.toString()

  await connectToChild({
    iframe: iframeRef.value,
    methods: {
      accept() {
        window.opener.postMessage({ status: 'accept' }, '*')
      },
      reject() {
        window.opener.postMessage({ status: 'error', error: 'user_deny' }, '*')
      }
    }
  }).promise
})
</script>

<style scoped>
main {
  background-color: #000;
  width: 100vw;
  height: 100vh;
}

.iframe {
  width: 330px;
  height: 590px;
  border: 1px solid;
  border-radius: 10px;
}
</style>
