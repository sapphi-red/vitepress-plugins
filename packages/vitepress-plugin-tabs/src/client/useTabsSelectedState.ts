import { ref, computed, reactive, inject, watch, onMounted } from 'vue'
import type { App, Ref, InjectionKey } from 'vue'

type TabsSharedState = {
  content?: TabsSharedStateContent
}
type TabsSharedStateContent = Record<string, string>

const injectionKey: InjectionKey<TabsSharedState> = 'vitepress:tabSharedState' as unknown as symbol
const ls = typeof localStorage !== 'undefined' ? localStorage : null
const localStorageKey = 'vitepress:tabsSharedState'

const getLocalStorageValue = (): TabsSharedStateContent => {
  const rawValue = ls?.getItem(localStorageKey)
  if (rawValue) {
    try {
      return JSON.parse(rawValue)
    } catch {}
  }
  return {}
}
const setLocalStorageValue = (v: TabsSharedStateContent) => {
  if (!ls) return
  ls.setItem(localStorageKey, JSON.stringify(v))
}

const getUrlParamValue = (key: string): string | null => {
  if (typeof location === 'undefined') return null
  return new URLSearchParams(location.search).get(key)
}
const setUrlParamValue = (key: string, value: string) => {
  if (typeof location === 'undefined' || typeof history === 'undefined') return
  const url = new URL(location.href)
  if (url.searchParams.get(key) === value) return
  url.searchParams.set(key, value)
  history.replaceState(history.state, '', url.toString())
}

export const provideTabsSharedState = (app: App) => {
  const state = reactive<TabsSharedState>({})
  watch(
    () => state.content,
    (newStateContent, oldStateContent) => {
      // skip initialize
      if (newStateContent && oldStateContent) {
        setLocalStorageValue(newStateContent)
      }
    },
    { deep: true },
  )

  app.provide(injectionKey, state)
}

export const useTabsSelectedState = <T extends string>(
  acceptValues: Ref<T[]>,
  sharedStateKey: Ref<string | undefined>,
) => {
  const sharedState = inject(injectionKey)
  if (!sharedState) {
    throw new Error('[vitepress-plugin-tabs] TabsSharedState should be injected')
  }

  onMounted(() => {
    if (!sharedState.content) {
      sharedState.content = getLocalStorageValue()
    }
    const key = sharedStateKey.value
    if (key && sharedState.content) {
      const urlValue = getUrlParamValue(key)
      if (urlValue !== null && (acceptValues.value as string[]).includes(urlValue)) {
        sharedState.content[key] = urlValue
      }
    }
  })

  const nonSharedState = ref<T | undefined>()

  const selected = computed({
    get() {
      const key = sharedStateKey.value
      const acceptVals = acceptValues.value
      if (key) {
        const value = sharedState.content?.[key]
        if (value && (acceptVals as string[]).includes(value)) {
          return value as T
        }
      } else {
        const nonSharedStateVal = nonSharedState.value
        if (nonSharedStateVal) {
          return nonSharedStateVal
        }
      }
      return acceptVals[0]
    },
    set(v) {
      const key = sharedStateKey.value
      if (key) {
        if (sharedState.content) {
          sharedState.content[key] = v
        }
        setUrlParamValue(key, v)
      } else {
        nonSharedState.value = v
      }
    },
  })
  const select = (newValue: T) => {
    selected.value = newValue
  }

  return { selected, select }
}
