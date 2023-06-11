import type { Ref } from 'vue'
import { onBeforeMount, onMounted, onUnmounted, ref, useSlots } from 'vue'

export function useTabLabels(
  container: Ref<HTMLDivElement | undefined>
): Ref<string[]> {
  const tabLabels: Ref<string[]> = ref([])
  const slots = useSlots()
  const mutationObserver: Ref<MutationObserver | null> = ref(null)

  const getLabels = () => {
    const defaultSlot = slots.default?.()
    if (!defaultSlot) {
      tabLabels.value = []
      return
    }
    tabLabels.value = defaultSlot
      .filter(
        vnode =>
          typeof vnode.type === 'object' &&
          '__name' in vnode.type &&
          vnode.type.__name === 'PluginTabsTab' &&
          vnode.props
      )
      .map(vnode => vnode.props?.label)
  }

  onBeforeMount(getLabels)

  onMounted(() => {
    if (!container.value) {
      return
    }
    mutationObserver.value = new MutationObserver(getLabels)

    mutationObserver.value.observe(container.value, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    })
  })
  onUnmounted(() => {
    mutationObserver.value?.disconnect()
  })
  return tabLabels
}
