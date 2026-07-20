<template>
  <div>
    <div
      class="mb-4 flex min-h-[120px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-blue-400 hover:bg-blue-50"
      :class="{ 'border-blue-500 bg-blue-50': dragging }"
      @click="triggerUpload"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <div class="text-center">
        <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
        <p class="mt-1 text-xs text-gray-500">{{ t('admin.images.dropHint') }}</p>
      </div>
    </div>
    <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onFileSelect" />

    <div v-if="sortedImages.length" class="mb-3 flex items-center justify-between gap-2">
      <p class="text-xs text-gray-500">{{ t('admin.images.catalogCount', { count: sortedImages.length }) }}</p>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50"
        @click="catalogOpen = true"
      >
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
        </svg>
        {{ t('admin.images.viewCatalog') }}
      </button>
    </div>

    <div v-if="sortedImages.length" class="space-y-2">
      <div
        v-for="(img, index) in sortedImages"
        :key="img.id"
        class="group flex items-center gap-2 rounded-xl border bg-white p-2 transition-colors hover:bg-gray-50"
        :class="img.is_primary ? 'border-blue-200' : 'border-gray-100'"
        draggable="true"
        @dragstart="dragIndex = index"
        @dragover.prevent
        @drop.prevent="onReorder(index)"
      >
        <div class="cursor-grab text-gray-300 transition-colors group-hover:text-gray-500">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>

        <input
          type="number"
          min="1"
          :max="sortedImages.length"
          :value="index + 1"
          :title="t('admin.images.order')"
          class="w-12 shrink-0 rounded-lg border border-gray-200 bg-gray-50 px-1.5 py-1 text-center text-xs text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          @change="onOrderInput(index, $event)"
        />

        <img
          :src="getImageUrl(img)"
          :alt="img.alt"
          class="h-12 w-12 shrink-0 rounded-lg object-cover"
        />

        <div class="min-w-0 flex-1">
          <input
            :value="img.alt"
            type="text"
            :placeholder="t('admin.images.altPlaceholder')"
            class="w-full border-0 bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-300 focus:ring-0"
            @change="onAltChange(img.id, $event)"
          />
        </div>

        <div class="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            class="rounded-lg px-2 py-1 text-xs font-medium transition-colors"
            :class="img.is_primary ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'"
            :title="t('admin.images.primary')"
            @click="setPrimary(index)"
          >
            {{ t('admin.images.primary') }}
          </button>

          <button
            v-if="index > 0"
            type="button"
            class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            @click="moveUp(index)"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
          <button
            v-if="index < sortedImages.length - 1"
            type="button"
            class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            @click="moveDown(index)"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <button
            type="button"
            class="rounded-lg p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
            @click="confirmRemove(img.id)"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="uploading" class="mt-3 flex items-center gap-2 text-sm text-blue-600">
      <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {{ t('admin.images.uploading') }}
    </div>

    <!-- Catalog modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="catalogOpen"
          class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          @click.self="catalogOpen = false"
        >
          <div
            class="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            @click.stop
          >
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">{{ t('admin.images.catalogTitle') }}</h3>
                <p class="text-sm text-gray-500">{{ t('admin.images.catalogCount', { count: sortedImages.length }) }}</p>
              </div>
              <button
                type="button"
                class="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                :aria-label="t('admin.images.close')"
                @click="catalogOpen = false"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="overflow-y-auto p-5">
              <div v-if="sortedImages.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div
                  v-for="(img, index) in sortedImages"
                  :key="img.id"
                  class="group relative overflow-hidden rounded-xl border bg-gray-50"
                  :class="img.is_primary ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-100'"
                >
                  <img
                    :src="getImageUrl(img)"
                    :alt="img.alt || ''"
                    class="aspect-square w-full object-cover"
                  />

                  <div class="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-8">
                    <span
                      v-if="img.is_primary"
                      class="rounded-md bg-blue-500 px-1.5 py-0.5 text-[10px] font-semibold text-white"
                    >
                      {{ t('admin.images.primary') }}
                    </span>
                    <span v-else class="text-[10px] font-medium text-white/80">#{{ index + 1 }}</span>

                    <div class="flex items-center gap-1">
                      <button
                        v-if="!img.is_primary"
                        type="button"
                        class="rounded-md bg-white/90 px-1.5 py-1 text-[10px] font-medium text-gray-700 transition-colors hover:bg-white"
                        @click="setPrimary(index)"
                      >
                        {{ t('admin.images.primary') }}
                      </button>
                      <button
                        type="button"
                        class="rounded-md bg-red-500/90 p-1 text-white transition-colors hover:bg-red-600"
                        :title="t('admin.images.delete')"
                        @click="confirmRemove(img.id)"
                      >
                        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="py-10 text-center text-sm text-gray-400">{{ t('admin.images.catalogCount', { count: 0 }) }}</p>
            </div>

            <div class="flex justify-end border-t border-gray-100 px-5 py-4">
              <button type="button" class="btn-secondary" @click="catalogOpen = false">
                {{ t('admin.images.close') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ApartmentImage } from '~/types'

const props = defineProps<{
  apartmentId: string
  images: ApartmentImage[]
}>()

const emit = defineEmits<{
  update: [images: ApartmentImage[]]
}>()

const { t } = useI18n()
const { success, error: toastError } = useToast()
const { open: openConfirm } = useConfirmModal()
const {
  getPublicUrl,
  uploadImage,
  addImage,
  deleteImage,
  updateImageOrder,
  listImages,
  updateImageAlt,
} = useAdminService()

const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)
const dragging = ref(false)
const dragIndex = ref(-1)
const catalogOpen = ref(false)

const sortedImages = computed(() =>
  [...props.images].sort((a, b) => a.sort_order - b.sort_order),
)

function getImageUrl(img: ApartmentImage): string {
  return getPublicUrl(img.url)
}

function triggerUpload() {
  fileInput.value?.click()
}

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) {
    uploadFiles(Array.from(input.files))
    input.value = ''
  }
}

function onDrop(e: DragEvent) {
  dragging.value = false
  if (e.dataTransfer?.files) {
    uploadFiles(Array.from(e.dataTransfer.files))
  }
}

async function uploadFiles(files: File[]) {
  uploading.value = true
  try {
    // Only the first image of an empty gallery becomes primary
    let makePrimary = props.images.length === 0
    let uploaded = 0

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      const path = await uploadImage(file)
      if (!path) continue
      const ok = await addImage(props.apartmentId, path, file.name, makePrimary)
      if (ok) {
        uploaded++
        makePrimary = false
      }
    }

    if (uploaded) {
      await refreshImages()
      success(t('admin.images.uploaded'))
    } else {
      toastError(t('admin.images.uploadError'))
    }
  } catch {
    toastError(t('admin.images.uploadError'))
  } finally {
    uploading.value = false
  }
}

async function refreshImages() {
  const data = await listImages(props.apartmentId)
  emit('update', data)
}

async function confirmRemove(id: string) {
  const confirmed = await openConfirm(
    t('admin.images.deleteConfirmTitle'),
    t('admin.images.deleteConfirmMessage'),
    t('admin.images.delete'),
  )
  if (!confirmed) return

  const ok = await deleteImage(id)
  if (!ok) {
    toastError(t('admin.images.uploadError'))
    return
  }
  await refreshImages()
  success(t('admin.images.deleted'))
  if (!sortedImages.value.length) catalogOpen.value = false
}

async function setPrimary(index: number) {
  const sorted = [...sortedImages.value]
  const [primary] = sorted.splice(index, 1)
  // Principal goes first so cards/gallery pick it as cover
  sorted.unshift(primary)
  await saveOrder(sorted.map((img, i) => ({
    ...img,
    is_primary: i === 0,
  })))
}

async function moveUp(index: number) {
  if (index <= 0) return
  const sorted = [...sortedImages.value]
  ;[sorted[index - 1], sorted[index]] = [sorted[index], sorted[index - 1]]
  await saveOrder(sorted)
}

async function moveDown(index: number) {
  const sorted = [...sortedImages.value]
  if (index >= sorted.length - 1) return
  ;[sorted[index], sorted[index + 1]] = [sorted[index + 1], sorted[index]]
  await saveOrder(sorted)
}

async function onReorder(toIndex: number) {
  const from = dragIndex.value
  if (from === toIndex || from < 0) return
  const sorted = [...sortedImages.value]
  const [item] = sorted.splice(from, 1)
  sorted.splice(toIndex, 0, item)
  await saveOrder(sorted)
  dragIndex.value = -1
}

async function onOrderInput(fromIndex: number, e: Event) {
  const raw = Number((e.target as HTMLInputElement).value)
  if (!Number.isFinite(raw)) {
    await refreshImages()
    return
  }
  const toIndex = Math.max(0, Math.min(sortedImages.value.length - 1, Math.round(raw) - 1))
  if (toIndex === fromIndex) return
  const sorted = [...sortedImages.value]
  const [item] = sorted.splice(fromIndex, 1)
  sorted.splice(toIndex, 0, item)
  await saveOrder(sorted)
}

async function onAltChange(id: string, e: Event) {
  const alt = (e.target as HTMLInputElement).value
  await updateImageAlt(id, alt)
  emit('update', props.images.map((img) => (img.id === id ? { ...img, alt } : img)))
}

async function saveOrder(sorted: ApartmentImage[]) {
  const updates = sorted.map((img, i) => ({
    id: img.id,
    sort_order: i,
    is_primary: img.is_primary,
  }))
  const ok = await updateImageOrder(updates)
  if (!ok) {
    toastError(t('admin.images.uploadError'))
    return
  }
  emit('update', sorted.map((img, i) => ({ ...img, sort_order: i })))
}
</script>
