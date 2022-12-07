<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useStabilizeScrollPosition } from './useStabilizeScrollPosition';
import { useTabs } from './useTabs'
import { useUid } from './useUid'

const props = defineProps<{
  tabLabels: string[]
  sharedStateKey?: string
}>()

const { selected, select } = useTabs(
  toRef(props, 'tabLabels'),
  toRef(props, 'sharedStateKey')
)

const tablist = ref<HTMLDivElement>()
const { stabilizeScrollPosition } = useStabilizeScrollPosition(tablist)
const selectStable = stabilizeScrollPosition(select)

const buttonRefs = ref<HTMLButtonElement[]>([])

const onKeydown = (e: KeyboardEvent) => {
  const currentIndex = props.tabLabels.indexOf(selected.value)
  let selectIndex: number | undefined

  if (e.key === 'ArrowLeft') {
    selectIndex =
      currentIndex >= 1 ? currentIndex - 1 : props.tabLabels.length - 1
  } else if (e.key === 'ArrowRight') {
    selectIndex =
      currentIndex < props.tabLabels.length - 1 ? currentIndex + 1 : 0
  }

  if (selectIndex !== undefined) {
    selectStable(props.tabLabels[selectIndex])
    buttonRefs.value[selectIndex]?.focus()
  }
}

const uid = useUid()
</script>

<template>
  <div class="plugin-tabs">
    <div ref="tablist" role="tablist" @keydown="onKeydown">
      <button
        v-for="tabLabel in tabLabels"
        :id="`tab-${tabLabel}-${uid}`"
        ref="buttonRefs"
        :key="tabLabel"
        role="tab"
        class="plugin-tabs--tab"
        :aria-selected="tabLabel === selected"
        :aria-controls="`panel-${tabLabel}-${uid}`"
        :tabindex="tabLabel === selected ? 0 : -1"
        @click="() => selectStable(tabLabel)"
      >
        {{ tabLabel }}
      </button>
    </div>
    <template v-for="tabLabel in tabLabels" :key="tabLabel">
      <div
        v-if="tabLabel === selected"
        :id="`panel-${tabLabel}-${uid}`"
        class="plugin-tabs--content"
        role="tabpanel"
        tabindex="0"
        :aria-labelledby="`tab-${tabLabel}-${uid}`"
      >
        <slot :name="tabLabel" />
      </div>
    </template>
  </div>
</template>

<style>
.plugin-tabs {
  margin: 16px 0;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.plugin-tabs--tab {
  padding: 4px 16px;
  border-bottom: 2px solid transparent;
  transition: border-bottom-color 0.25s;
}
.plugin-tabs--tab[aria-selected='true'] {
  border-bottom-color: var(--vp-c-divider);
}
.plugin-tabs--tab:hover {
  border-bottom-color: var(--vp-c-divider-light);
}

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
