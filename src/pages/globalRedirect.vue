<script lang="ts" setup>
import type { Ref } from 'vue'
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { connectToChild } from 'penpal'

const router = useRouter()
const baseUrl = import.meta.env?.VITE_WALLET_URL || 'http://localhost:3000'
const route = useRoute()
let err = ref('')
let message = ref('')
let desc = ref('Logging in')
let iframeRef: Ref<HTMLIFrameElement | undefined> = ref()
let loading = ref(true)

onMounted(async () => {
    const url = new URL(`/global-redirect/`, baseUrl);
    if (route.query) {
        for (const k of Object.keys(route.query)) {
            url.searchParams.append(k, route.query[k] as string)
        }
    }

    if (!iframeRef.value) {
        err.value = 'could not set iframe ref'
        return
    }
    iframeRef.value.src = url.href

    await connectToChild({
        iframe: iframeRef.value,
        methods: {
            setSuccess,
            setError,
            goToMfaRestore,
        }
    }).promise

})

const goToMfaRestore = (id: string) => {
    router.push({ name: 'mfa-restore', params: { id } })
}

const setError = (err: string) => {
    window.opener?.postMessage({ status: 'error', error: err }, "*")
}

const setSuccess = () => {
    window.opener?.postMessage({ status: 'success' }, "*")
    loading.value = false
    message.value = 'Login Successful'
    desc.value = 'You can close this window now'
}

</script>


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