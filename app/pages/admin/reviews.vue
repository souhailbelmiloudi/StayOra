<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.reviews.title') }}</h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ t('admin.reviews.subtitle', { count: reviews.length }) }}
        </p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        {{ t('admin.reviews.new') }}
      </button>
    </div>

    <div
      v-if="showForm"
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h3 class="mb-4 text-sm font-semibold text-gray-900">
        {{ editingId ? t('admin.reviews.edit') : t('admin.reviews.new') }}
      </h3>
      <form class="space-y-4" @submit.prevent="handleSave">
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.reviews.name') }}</label>
            <input v-model="form.name" type="text" required class="input-field" placeholder="María García" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.reviews.city') }}</label>
            <input v-model="form.city" type="text" class="input-field" placeholder="Madrid" />
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.reviews.rating') }}</label>
            <select v-model.number="form.rating" class="input-field">
              <option v-for="n in 5" :key="n" :value="n">{{ t('admin.reviews.stars', { count: n }) }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.reviews.order') }}</label>
            <input v-model.number="form.sort_order" type="number" min="0" class="input-field" />
          </div>
          <div class="flex items-end">
            <label class="flex items-center gap-2 pb-2.5 text-sm font-medium text-gray-700">
              <input v-model="form.published" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600" />
              {{ t('admin.reviews.published') }}
            </label>
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.reviews.avatarUrl') }}</label>
          <input v-model="form.avatar" type="url" class="input-field" placeholder="https://..." />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.reviews.comment') }}</label>
          <textarea
            v-model="form.text"
            required
            rows="3"
            class="input-field resize-none"
            :placeholder="t('admin.reviews.commentPlaceholder')"
          />
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" class="btn-secondary" @click="closeForm">{{ t('admin.reviews.cancel') }}</button>
          <button type="submit" :disabled="saving" class="btn-primary">
            {{ saving ? t('admin.reviews.saving') : editingId ? t('admin.reviews.saveChanges') : t('admin.reviews.create') }}
          </button>
        </div>
      </form>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 4" :key="i" class="h-20 animate-pulse rounded-xl bg-gray-100" />
    </div>

    <div v-else-if="reviews.length" class="space-y-3">
      <div
        v-for="review in reviews"
        :key="review.id"
        class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div class="flex min-w-0 flex-1 gap-3">
          <div
            v-if="review.avatar"
            class="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100"
          >
            <img :src="review.avatar" :alt="review.name" class="h-full w-full object-cover" />
          </div>
          <div
            v-else
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600"
          >
            {{ review.name.charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <p class="font-medium text-gray-900">{{ review.name }}</p>
              <span v-if="review.city" class="text-xs text-gray-400">{{ review.city }}</span>
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                :class="review.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ review.published ? t('admin.reviews.published') : t('admin.reviews.hidden') }}
              </span>
            </div>
            <div class="mt-0.5 flex gap-0.5">
              <svg
                v-for="i in 5"
                :key="i"
                class="h-3.5 w-3.5"
                :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-200'"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p class="mt-1 line-clamp-2 text-sm text-gray-600">{{ review.text }}</p>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-1">
          <button
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            :title="t('admin.apartments.edit')"
            @click="openEdit(review)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          <button
            class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
            :title="t('admin.apartments.delete')"
            @click="handleDelete(review)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="py-20 text-center">
      <p class="text-gray-500">{{ t('admin.reviews.empty') }}</p>
      <button class="btn-primary mt-4 inline-flex" @click="openCreate">
        {{ t('admin.reviews.createFirst') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Review, ReviewInput } from '~/types'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const { t } = useI18n()

useHead({ title: computed(() => t('admin.reviews.metaTitle')) })

const { success, error: toastError } = useToast()
const { open } = useConfirmModal()
const { getAllReviews, createReview, updateReview, deleteReview } = useAdminService()

const reviews = ref<Review[]>([])
const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const editingId = ref<string | null>(null)

const emptyForm = (): ReviewInput => ({
  name: '',
  city: '',
  avatar: '',
  rating: 5,
  text: '',
  published: true,
  sort_order: 0,
})

const form = reactive<ReviewInput>(emptyForm())

async function loadData() {
  loading.value = true
  try {
    reviews.value = await getAllReviews()
  } catch {
    toastError(t('admin.reviews.loadError'))
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  showForm.value = true
}

function openEdit(review: Review) {
  editingId.value = review.id
  Object.assign(form, {
    name: review.name,
    city: review.city,
    avatar: review.avatar,
    rating: review.rating,
    text: review.text,
    published: review.published,
    sort_order: review.sort_order,
  })
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
}

async function handleSave() {
  saving.value = true
  try {
    const payload: ReviewInput = { ...form }
    if (editingId.value) {
      await updateReview(editingId.value, payload)
      success(t('admin.reviews.updated'))
    } else {
      await createReview(payload)
      success(t('admin.reviews.created'))
    }
    closeForm()
    await loadData()
  } catch (e) {
    toastError(e instanceof Error ? e.message : t('admin.reviews.saveError'))
  } finally {
    saving.value = false
  }
}

async function handleDelete(review: Review) {
  const ok = await open(
    t('admin.reviews.deleteTitle'),
    t('admin.reviews.deleteMessage', { name: review.name }),
    t('admin.confirm.delete'),
  )
  if (!ok) return

  try {
    await deleteReview(review.id)
    reviews.value = reviews.value.filter((r) => r.id !== review.id)
    success(t('admin.reviews.deleted'))
  } catch {
    toastError(t('admin.reviews.deleteError'))
  }
}

onMounted(loadData)
</script>
