import { ref, computed, reactive, inject, watch } from 'vue'
import type { App, Ref, InjectionKey } from 'vue'

type TabsSharedState = Record<string, string>

const injectionKey: InjectionKey<TabsSharedState> = Symbol()
const ls = typeof localStorage !== 'undefined' ? localStorage : null
const localStorageKey = 'vitepress:tabsSharedState'

const getLocalStorageValue = (): TabsSharedState => {
  const rawValue = ls?.getItem(localStorageKey)
  if (rawValue) {
    try {
      return JSON.parse(rawValue)
    } catch {}
  }
  return {}
}
const setLocalStorageValue = (v: TabsSharedState) => {
  if (!ls) return
  ls.setItem(localStorageKey, JSON.stringify(v))
}

export const provideTabsSharedState = (app: App) => {
  const state = reactive(getLocalStorageValue())
  watch(state, newState => {
    setLocalStorageValue(newState)
  })

  app.provide(injectionKey, state)
}

export const useTabs = <T extends string>(
  acceptValues: Ref<T[]>,
  sharedStateKey: Ref<string | undefined>
) => {
  const sharedState = inject(injectionKey)
  if (!sharedState) {
    throw new Error(
      '[vitepress-plugin-tabs] TabsSharedState should be injected'
    )
  }

  const nonSharedState = ref<T | undefined>()

  const selected = computed({
    get() {
      const key = sharedStateKey.value
      const acceptVals = acceptValues.value
      if (key) {
        const value = sharedState[key]
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
        sharedState[key] = v
      } else {
        nonSharedState.value = v
      }
    }
  })
  const select = (newValue: T) => {
    selected.value = newValue
  }

  return { selected, select }
}
