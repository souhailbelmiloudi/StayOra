<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()

const current = computed(() =>
  locales.value.find((l) => (typeof l === 'string' ? l : l.code) === locale.value),
)

const htmlDir = computed(() => {
  const loc = current.value
  if (!loc || typeof loc === 'string') return 'ltr'
  return loc.dir || 'ltr'
})

useHead({
  htmlAttrs: {
    lang: locale,
    dir: htmlDir,
  },
})
</script>
