import { nextTick, Ref } from 'vue'

export const useStabilizeScrollPosition = (
  targetEle: Ref<HTMLElement | undefined>
) => {
  const scrollableEleVal = document.documentElement

  const stabilizeScrollPosition =
    <Args extends readonly unknown[], Return>(
      func: (...args: Args) => Return
    ) =>
    async (...args: Args): Promise<Return> => {
      const result = func(...args)
      const eleVal = targetEle.value
      if (!eleVal) return result

      const offset = eleVal.offsetTop - scrollableEleVal.scrollTop
      await nextTick()
      scrollableEleVal.scrollTop = eleVal.offsetTop - offset

      return result
    }

  return { stabilizeScrollPosition }
}
