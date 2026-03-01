<script setup lang="ts">
import { ref, toRef, useId } from 'vue'
import { useStabilizeScrollPosition } from './useStabilizeScrollPosition'
import { useTabsSelectedState } from './useTabsSelectedState'
import { useTabLabels } from './useTabLabels'
import { provideTabsSingleState } from './useTabsSingleState'
import { useIsPrint } from './useIsPrint'

const props = defineProps<{
  sharedStateKey?: string
  variant?: 'default' | 'code'
}>()

const isPrint = useIsPrint()

const tabLabels = useTabLabels()

const { selected, select } = useTabsSelectedState(tabLabels, toRef(props, 'sharedStateKey'))

const tablist = ref<HTMLDivElement>()
const { stabilizeScrollPosition } = useStabilizeScrollPosition(tablist)
const selectStable = stabilizeScrollPosition(select)

const buttonRefs = ref<HTMLButtonElement[]>([])

const onKeydown = (e: KeyboardEvent) => {
  const currentIndex = tabLabels.value.indexOf(selected.value)
  let selectIndex: number | undefined

  if (e.key === 'ArrowLeft') {
    selectIndex = currentIndex >= 1 ? currentIndex - 1 : tabLabels.value.length - 1
  } else if (e.key === 'ArrowRight') {
    selectIndex = currentIndex < tabLabels.value.length - 1 ? currentIndex + 1 : 0
  }

  if (selectIndex !== undefined) {
    selectStable(tabLabels.value[selectIndex])
    buttonRefs.value[selectIndex]?.focus()
  }
}

const uid = useId()

provideTabsSingleState({ uid, selected })
</script>

<template>
  <div class="plugin-tabs" :data-variant="props.variant">
    <div ref="tablist" class="plugin-tabs--tab-list" role="tablist" @keydown="onKeydown">
      <button
        v-for="tabLabel in tabLabels"
        :id="`tab-${tabLabel}-${uid}`"
        ref="buttonRefs"
        :key="tabLabel"
        role="tab"
        class="plugin-tabs--tab"
        :aria-selected="tabLabel === selected && !isPrint"
        :aria-controls="`panel-${tabLabel}-${uid}`"
        :tabindex="tabLabel === selected ? 0 : -1"
        @click="() => selectStable(tabLabel)"
      >
        {{ tabLabel }}
      </button>
    </div>
    <slot />
  </div>
</template>

<style>
:root {
  --vp-plugin-tabs-tab-text-color: var(--vp-c-text-2);
  --vp-plugin-tabs-tab-active-text-color: var(--vp-c-text-1);
  --vp-plugin-tabs-tab-hover-text-color: var(--vp-c-text-1);
  --vp-plugin-tabs-tab-bg: var(--vp-c-bg-soft);
  --vp-plugin-tabs-tab-divider: var(--vp-c-divider);
  --vp-plugin-tabs-tab-active-bar-color: var(--vp-c-brand-1);
}

.plugin-tabs {
  margin: 16px 0;
  background-color: var(--vp-plugin-tabs-tab-bg);
  border-radius: 8px;
}

.plugin-tabs--tab-list {
  position: relative;
  padding: 0 12px;
  overflow-x: auto;
  overflow-y: hidden;
}

.plugin-tabs--tab-list::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--vp-plugin-tabs-tab-divider);
}

.plugin-tabs--tab {
  position: relative;
  padding: 0 12px;
  line-height: 48px;
  border-bottom: 2px solid transparent;
  color: var(--vp-plugin-tabs-tab-text-color);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: color 0.25s;
}

.plugin-tabs--tab[aria-selected='true'] {
  color: var(--vp-plugin-tabs-tab-active-text-color);
}

.plugin-tabs--tab:hover {
  color: var(--vp-plugin-tabs-tab-hover-text-color);
}

.plugin-tabs--tab::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 8px;
  right: 8px;
  height: 2px;
  background-color: transparent;
  transition: background-color 0.25s;
  z-index: 1;
}

.plugin-tabs--tab[aria-selected='true']::after {
  background-color: var(--vp-plugin-tabs-tab-active-bar-color);
}

.plugin-tabs[data-variant='code'] {
  margin-top: 16px;
  margin-bottom: 0;
  background-color: transparent;
  border-radius: 0;
}

.plugin-tabs[data-variant='code'] .plugin-tabs--tab-list {
  margin-right: -24px;
  margin-left: -24px;
  background-color: var(--vp-code-tab-bg);
  box-shadow: inset 0 -1px var(--vp-code-tab-divider);
}

@media (min-width: 640px) {
  .plugin-tabs[data-variant='code'] .plugin-tabs--tab-list {
    margin-right: 0;
    margin-left: 0;
    border-radius: 8px 8px 0 0;
  }
}

.plugin-tabs[data-variant='code'] .plugin-tabs--tab-list::after {
  display: none;
}

.plugin-tabs[data-variant='code'] .plugin-tabs--tab {
  color: var(--vp-code-tab-text-color);
}

.plugin-tabs[data-variant='code'] .plugin-tabs--tab[aria-selected='true'] {
  color: var(--vp-code-tab-active-text-color);
}

.plugin-tabs[data-variant='code'] .plugin-tabs--tab:hover {
  color: var(--vp-code-tab-hover-text-color);
}

.plugin-tabs[data-variant='code'] .plugin-tabs--tab[aria-selected='true']::after {
  background-color: var(--vp-code-tab-active-bar-color);
}
</style>
