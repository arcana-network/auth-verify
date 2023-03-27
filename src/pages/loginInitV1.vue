<template>
  <main class="center">
    <iframe ref="iframeRef" />
    <div v-if="!error" class="stack stack-space-4">
      <Loading class="app-icon" />
    </div>
    <div v-else class="stack stack-space-4">
      <img class="app-icon" src="../assets/error-icon.svg" />
      <div class="stack stack-space-3">
        <div class="stack stack-space-1">
          <h1 class="text-center">Authorization Error</h1>
          <h2 id="error-code" class="text-center">Error: {{ error }}</h2>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import Loading from '../components/loadingSpinner.vue'
import { connectToChild } from 'penpal'
import { redirect } from '../helpers/utils'
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'

const expectedKeys = ['loginType', 'email', 'appId', 'parentUrl']
const route = useRoute()

let parentUrl = ''
let error = ref('')
let iframeRef: Ref<HTMLIFrameElement | undefined> = ref()

onMounted(async () => {
  document.body.className = 'dark'
  const hash = route.hash
  if (!hash) {
    setError('required hash not present in params')
    return
  }
  const params = getHashParams(hash)
  if (!(params.appId && params.parentUrl && params.loginType)) {
    setError('required params missing ')

    return
  }
  parentUrl = params.parentUrl
  if (!iframeRef.value) {
    error.value = 'could not set iframe ref'
    return
  }

  iframeRef.value.src = getIframeUrl(
    import.meta.env.VITE_WALLET_URL || 'http://localhost:3000',
    params.appId
  )

  const c = await connectToChild<{
    triggerPasswordlessLogin: (email: string) => Promise<string>
    triggerSocialLogin: (kind: string) => Promise<string>
  }>({
    iframe: iframeRef.value,
    methods: {
      getParentUrl: () => parentUrl,
      error: setError
    }
  }).promise

  try {
    if (params.loginType === 'passwordless') {
      if (params.email) {
        const url = await c.triggerPasswordlessLogin(params.email)
        replyToOpener({ status: 'done' })
        redirect(url)
      } else {
        setError('Email not available for login with link')
      }
    } else {
      const url = await c.triggerSocialLogin(params.loginType)
      redirect(url)
    }
  } catch (e) {
    if (e instanceof Error) {
      setError(e.message)
    }
  }
})

const getIframeUrl = (baseUrl: string, appId: string) => {
  const url = new URL(`${baseUrl}/${appId}/init/`)
  return url.toString()
}

const getHashParams = (hash: string) => {
  const paramString = hash.substring(1)
  const searchParams = new URLSearchParams(paramString)
  let params: { [k: string]: string } = {}
  for (const key of expectedKeys) {
    const val = searchParams.get(key)
    if (val) {
      if (key === 'parentUrl') {
        params[key] = decodeURIComponent(val)
      } else {
        params[key] = val
      }
    }
  }
  return params
}

const setError = (err: string) => {
  error.value = err
  replyToOpener({ status: 'error', error: err })
}

const replyToOpener = (data: any) => {
  window.opener?.postMessage(data, new URL(parentUrl).origin)
}
</script>

<style>
iframe {
  height: 0;
  width: 0;
  border: 0;
}
</style>