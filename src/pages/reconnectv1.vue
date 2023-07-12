<template>
  <main class="center">
    <div v-if="!err" class="stack stack-space-4">
      <div v-show="loading" class="stack stack-space-4">
        <Loading class="app-icon" />
        <span id="text" class="text-center">Reconnecting</span>
      </div>
    </div>
    <div v-else class="stack stack-space-4">
      <img class="app-icon" src="../assets/error-icon.svg" />
      <div class="stack stack-space-3">
        <div class="stack stack-space-1">
          <h1 class="text-center">Reconnection Error</h1>
          <h2 id="error-code" class="text-center">{{ err }}</h2>
        </div>
      </div>
    </div>
    <div class="stick-to-bottom">
      <a href="https://arcana.network" target="_blank">
        <img src="../assets/secured-by-arcana.svg" class="footer-logo" alt="Secured by Arcana" />
      </a>
    </div>
  </main>
  <iframe ref="iframeRef" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { Ref } from 'vue'
import { cleanUrl } from "@/helpers/utils";
import { useRoute } from "vue-router";
import { connectToChild } from "penpal";
import Loading from '../components/loadingSpinner.vue'

const loading = ref(true)
const err = ref('')
const iframeRef: Ref<HTMLIFrameElement | undefined> = ref()

const getIframeURL = (baseUrl: string, appId: string) => {
  const url = new URL(`${appId}/v1/reconnect/`, baseUrl)
  return url.toString()
}

onMounted(async () => {
  document.body.className = 'dark'
  const route = useRoute()
  const sid = route.query['sessionID']
  if (sid == null) {
    err.value = 'Invalid session ID'
    return
  }

  const url = getIframeURL(import.meta.env?.VITE_WALLET_URL || 'http://localhost:3000', route.params.id as string)
  cleanUrl()

  if (!iframeRef.value) {
    err.value = 'could not set iframe ref'
    return
  }
  iframeRef.value.src = url

  await connectToChild({
    iframe: iframeRef.value,
    methods: {
      getSessionID() {
        return sid
      },
      requestExit() {
        window.opener.postMessage({ status: 'success' }, '*')
      },
      reportError(msg: string) {
        err.value = msg
        window.opener.postMessage({ status: 'error', error: msg }, '*')
      }
    }
  }).promise
})
</script>

<style>
iframe {
  height: 0;
  width: 0;
  border: 0;
}
</style>