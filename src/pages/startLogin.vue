<template>
  <main class="center">
    <iframe ref="v" />
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
  </main>
</template>
<script lang="ts" setup>
import Loading from '../components/loadingSpinner.vue'
import { encodeJSON, getClientStorageKey } from '@/helpers/utils'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

let err = ref('')

onMounted(() => {
  const route = useRoute()
  document.body.className = 'dark'
  const clientId = route.query.clientId as string
  const [, , id] = clientId.split('_')
  const loginType = route.query.type as string
  const email = route.query.email as string
  const loginSrc = route.query.loginSrc as string
  if (!(clientId && loginType && loginSrc)) {
    err.value = 'Missing params!'
    return
  }
  localStorage.setItem(getClientStorageKey(id), loginSrc)

  const appId = clientId.split('_')[2]
  if (loginType == 'passwordless' && !email) {
    err.value = 'email is missing'
    return
  }
  constructUrl({
    loginSrc,
    loginType,
    appId,
    parentUrl: window.location.href,
    email
  })
})

const constructUrl = ({
  loginType,
  appId,
  parentUrl,
  loginSrc,
  theme,
  email
}: {
  loginType: string
  appId: string
  parentUrl: string
  loginSrc: string
  theme?: string
  email?: string
}) => {
  const hash = encodeJSON({
    loginType,
    appId,
    parentUrl,
    theme: 'dark',
    loginSrc,
    email
  })

  useRouter().push({
    path: '/login/init',
    hash: `#${hash}`
  })
}
</script>

<style>
iframe {
  height: 0;
  width: 0;
  border: 0;
}
</style>
