<template>
  <div class="relative" ref="root">
    <button
      type="button"
      class="flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
      :aria-label="t('currency.label')"
      @click="open = !open"
    >
      <span class="font-semibold">{{ currencyMeta.symbol }}</span>
      <span class="uppercase">{{ currency }}</span>
      <svg class="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>

    <div
      v-if="open"
      class="absolute end-0 top-full z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
    >
      <button
        v-for="c in currencies"
        :key="c.code"
        type="button"
        class="flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
        :class="c.code === currency ? 'font-semibold text-blue-600' : 'text-gray-700'"
        @click="select(c.code)"
      >
        <span class="w-5 text-center">{{ c.symbol }}</span>
        {{ c.code }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CurrencyCode } from '~/types'

const { t } = useI18n()
const { currency, currencyMeta, currencies, setCurrency, ensureRates } = useCurrency()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

onMounted(() => {
  ensureRates()
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => document.removeEventListener('click', onClickOutside))

function select(code: CurrencyCode) {
  setCurrency(code)
  open.value = false
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    open.value = false
  }
}
</script>
