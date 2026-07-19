<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.apartments.title') }}</h1>
        <p class="mt-1 text-sm text-gray-500">{{ t('admin.apartments.count', { count: apartments.length }) }}</p>
      </div>
      <NuxtLink :to="localePath('/admin/apartments/new')" class="btn-primary">
        <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {{ t('admin.apartments.new') }}
      </NuxtLink>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-16 animate-pulse rounded-xl bg-gray-100" />
    </div>

    <div v-else-if="apartments.length" class="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="px-4 py-3 font-medium text-gray-500">{{ t('admin.apartments.colApartment') }}</th>
              <th class="hidden px-4 py-3 font-medium text-gray-500 sm:table-cell">{{ t('admin.apartments.colCity') }}</th>
              <th class="hidden px-4 py-3 font-medium text-gray-500 md:table-cell">{{ t('admin.apartments.colPrice') }}</th>
              <th class="hidden px-4 py-3 font-medium text-gray-500 md:table-cell">{{ t('admin.apartments.colCapacity') }}</th>
              <th class="px-4 py-3 font-medium text-gray-500">{{ t('admin.apartments.colStatus') }}</th>
              <th class="px-4 py-3 font-medium text-gray-500">{{ t('admin.apartments.colActions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="apt in apartments"
              :key="apt.id"
              class="transition-colors hover:bg-gray-50"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img
                    v-if="getPrimaryImage(apt)"
                    :src="getImageUrl(getPrimaryImage(apt)!)"
                    :alt="apt.name"
                    class="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />
                  <div v-else class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <svg class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ apt.name }}</p>
                    <p class="text-xs text-gray-400">{{ localeDateString(apt.created_at) }}</p>
                  </div>
                </div>
              </td>
              <td class="hidden px-4 py-3 text-gray-600 sm:table-cell">{{ apt.city }}</td>
              <td class="hidden px-4 py-3 text-gray-600 md:table-cell">{{ formatPrice(apt.price_per_night) }}{{ t('admin.apartments.perNight') }}</td>
              <td class="hidden px-4 py-3 text-gray-600 md:table-cell">{{ apt.max_guests }} · {{ t('admin.apartments.bedrooms', { count: apt.bedrooms }) }}</td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="apt.status === 'published'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-600'"
                >
                  {{ apt.status === 'published' ? t('admin.apartments.published') : t('admin.apartments.hidden') }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1">
                  <NuxtLink
                    :to="localePath(`/admin/apartments/${apt.id}`)"
                    class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    :title="t('admin.apartments.edit')"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </NuxtLink>
                  <button
                    class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                    :title="t('admin.apartments.duplicate')"
                    @click="handleDuplicate(apt)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                  </button>
                  <button
                    class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    :title="t('admin.apartments.delete')"
                    @click="handleDelete(apt)"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="py-20 text-center">
      <p class="text-gray-500">{{ t('admin.apartments.empty') }}</p>
      <NuxtLink :to="localePath('/admin/apartments/new')" class="btn-primary mt-4 inline-flex">
        {{ t('admin.apartments.createFirst') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApartmentWithImages } from '~/types'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const { t, locale } = useI18n()
const localePath = useLocalePath()

useHead({ title: computed(() => t('admin.apartments.metaTitle')) })

const { success, error: toastError } = useToast()
const { open } = useConfirmModal()
const { getAllApartments, deleteApartment, duplicateApartment, getPublicUrl } = useAdminService()
const { formatPrice } = useFormatUtils()

const localeDateMap: Record<string, string> = {
  es: 'es-ES',
  en: 'en-US',
  fr: 'fr-FR',
  ar: 'ar',
}

function localeDateString(date: string | Date) {
  const loc = localeDateMap[locale.value] || 'es-ES'
  return new Date(date).toLocaleDateString(loc)
}

const apartments = ref<ApartmentWithImages[]>([])
const loading = ref(true)

function getPrimaryImage(apt: ApartmentWithImages) {
  return apt.apartment_images?.find((i) => i.is_primary) || apt.apartment_images?.[0]
}

function getImageUrl(img: { url: string }) {
  return getPublicUrl(img.url)
}

async function loadData() {
  loading.value = true
  try {
    apartments.value = await getAllApartments()
  } catch {
    toastError(t('admin.apartments.loadError'))
  } finally {
    loading.value = false
  }
}

async function handleDelete(apt: ApartmentWithImages) {
  const ok = await open(
    t('admin.apartments.deleteTitle'),
    t('admin.apartments.deleteMessage', { name: apt.name }),
    t('admin.confirm.delete'),
  )
  if (!ok) return

  try {
    await deleteApartment(apt.id)
    apartments.value = apartments.value.filter((a) => a.id !== apt.id)
    success(t('admin.apartments.deleted'))
  } catch (e) {
    toastError(e instanceof Error ? e.message : t('admin.apartments.deleteError'))
  }
}

async function handleDuplicate(apt: ApartmentWithImages) {
  try {
    const newApt = await duplicateApartment(apt.id)
    if (newApt) {
      apartments.value.unshift(newApt as ApartmentWithImages)
      success(t('admin.apartments.duplicated'))
    }
  } catch {
    toastError(t('admin.apartments.duplicateError'))
  }
}

onMounted(loadData)
</script>
