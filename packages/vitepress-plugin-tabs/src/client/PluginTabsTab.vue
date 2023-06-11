<script setup lang="ts">
import { inject } from 'vue'
defineProps<{ label: string }>()
const uid = inject('tabs-uid')
const selected = inject('tabs-selected')
</script>

<template>
  <div
    v-if="selected === label"
    :id="`panel-${label}-${uid}`"
    class="plugin-tabs--content"
    role="tabpanel"
    tabindex="0"
    :aria-labelledby="`tab-${label}-${uid}`"
  >
    <slot />
  </div>
</template>

<style scoped>
.plugin-tabs--content {
  padding: 16px;
}

.plugin-tabs--content > :first-child {
  margin-top: 0;
}

.plugin-tabs--content > :last-child {
  margin-bottom: 0;
}

.plugin-tabs--content > div[class*='language-'] {
  margin: 8px 0;
}
</style>
