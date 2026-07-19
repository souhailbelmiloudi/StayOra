<template>
  <div>
    <div
      class="mb-4 flex min-h-[120px] cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-blue-400 hover:bg-blue-50"
      @click="triggerUpload"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
      :class="{ 'border-blue-500 bg-blue-50': dragging }"
    >
      <div class="text-center">
        <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
        </svg>
        <p class="mt-1 text-xs text-gray-500">{{ t('admin.images.dropHint') }}</p>
      </div>
    </div>
    <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="onFileSelect" />

    <div v-if="images.length" class="space-y-2">
      <div
        v-for="(img, index) in sortedImages"
        :key="img.id"
        class="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-2 transition-colors hover:bg-gray-50"
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

        <img
          :src="getImageUrl(img)"
          :alt="img.alt"
          class="h-12 w-12 shrink-0 rounded-lg object-cover"
        />

        <div class="min-w-0 flex-1">
          <input
            v-model="img.alt"
            type="text"
            :placeholder="t('admin.images.altPlaceholder')"
            class="w-full border-0 bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-300 focus:ring-0"
            @change="emitUpdate"
          />
        </div>

        <div class="flex items-center gap-1">
          <button
            class="rounded-lg px-2 py-1 text-xs transition-colors"
            :class="img.is_primary ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'"
            @click="setPrimary(index)"
          >
            {{ t('admin.images.primary') }}
          </button>

          <button
            v-if="index > 0"
            class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            @click="moveUp(index)"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
          <button
            v-if="index < images.length - 1"
            class="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            @click="moveDown(index)"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <button
            class="rounded-lg p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
            @click="removeImage(img.id, index)"
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
const { getPublicUrl, uploadImage, addImage, deleteImage, updateImageOrder } = useAdminService()

const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)
const dragging = ref(false)
const dragIndex = ref(-1)

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
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue
      const path = await uploadImage(file)
      if (path) {
        const isFirst = props.images.length === 0
        await addImage(props.apartmentId, path, file.name, isFirst)
      }
    }
    success(t('admin.images.uploaded'))
    emit('update', [...props.images])
    refreshImages()
  } catch {
    toastError(t('admin.images.uploadError'))
  } finally {
    uploading.value = false
  }
}

async function refreshImages() {
  const { data } = await useSupabaseClient()
    .from('apartment_images')
    .select('*')
    .eq('apartment_id', props.apartmentId)
    .order('sort_order')

  emit('update', (data || []) as ApartmentImage[])
}

async function removeImage(id: string, index: number) {
  await deleteImage(id)
  const updated = props.images.filter((i) => i.id !== id)
  emit('update', updated)
  success(t('admin.images.deleted'))
}

async function setPrimary(index: number) {
  const sorted = sortedImages.value
  const updates = sorted.map((img, i) => ({
    id: img.id,
    sort_order: i,
    is_primary: i === index,
  }))
  await updateImageOrder(updates)
  const updated = props.images.map((img) => ({
    ...img,
    is_primary: img.id === sorted[index].id,
  }))
  emit('update', updated)
}

async function moveUp(index: number) {
  if (index <= 0) return
  const sorted = sortedImages.value
  ;[sorted[index - 1], sorted[index]] = [sorted[index], sorted[index - 1]]
  await saveOrder(sorted)
}

async function moveDown(index: number) {
  const sorted = sortedImages.value
  if (index >= sorted.length - 1) return
  ;[sorted[index], sorted[index + 1]] = [sorted[index + 1], sorted[index]]
  await saveOrder(sorted)
}

async function onReorder(toIndex: number) {
  const from = dragIndex.value
  if (from === toIndex || from < 0) return
  const sorted = sortedImages.value
  const item = sorted.splice(from, 1)[0]
  sorted.splice(toIndex, 0, item)
  await saveOrder(sorted)
  dragIndex.value = -1
}

async function saveOrder(sorted: ApartmentImage[]) {
  const updates = sorted.map((img, i) => ({
    id: img.id,
    sort_order: i,
    is_primary: img.is_primary,
  }))
  await updateImageOrder(updates)
  emit('update', [...sorted])
}

function emitUpdate() {
  emit('update', [...props.images])
}
</script>
