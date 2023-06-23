<template>
  <div>
    <iframe ref="iframeRef" />
  </div>
</template>

<script lang="ts">
import {onMounted, ref } from "vue";
import type { Ref } from 'vue'
import {cleanUrl, redirect} from "@/helpers/utils";
import {useRoute} from "vue-router";
import {connectToChild} from "penpal";

const getIframeURL = (baseUrl: string, appId: string) => {
  const url = new URL(`${appId}/v1/reconnect/`, baseUrl)
  return url.toString()
}

export default {
  name: 'ReconnectV1',
  setup () {
    const err = ref('')
    const iframeRef: Ref<HTMLIFrameElement | undefined> = ref()

    onMounted(async () => {
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
          getSessionID () {
            return sid
          },
          requestExit () {
            window.close()
          },
          reportError (msg: string) {
            err.value = msg
          }
        }
      }).promise
    })

    return {
      iframeRef,
      err
    }
  }
}
</script>
