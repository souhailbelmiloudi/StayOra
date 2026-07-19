<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <div class="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 class="mb-4 text-sm font-semibold text-gray-900">{{ t('admin.form.basicInfo') }}</h3>
          <div class="space-y-4">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.name') }}</label>
              <input v-model="form.name" type="text" required class="input-field" @input="onNameInput" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.slug') }}</label>
              <input v-model="form.slug" type="text" required class="input-field" />
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.city') }}</label>
                <input v-model="form.city" type="text" required class="input-field" />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.address') }}</label>
                <input v-model="form.address" type="text" class="input-field" />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.shortDescription') }}</label>
              <textarea v-model="form.description" rows="3" class="input-field resize-none" />
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 class="mb-4 text-sm font-semibold text-gray-900">{{ t('admin.form.details') }}</h3>
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.pricePerNight') }}</label>
              <input v-model.number="form.price_per_night" type="number" min="1" required class="input-field" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.guests') }}</label>
              <input v-model.number="form.max_guests" type="number" min="1" required class="input-field" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.sqm') }}</label>
              <input v-model.number="form.square_meters" type="number" min="0" class="input-field" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.bedrooms') }}</label>
              <input v-model.number="form.bedrooms" type="number" min="1" required class="input-field" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.bathrooms') }}</label>
              <input v-model.number="form.bathrooms" type="number" min="1" required class="input-field" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.status') }}</label>
              <select v-model="form.status" class="input-field">
                <option value="published">{{ t('admin.form.published') }}</option>
                <option value="hidden">{{ t('admin.form.hidden') }}</option>
              </select>
            </div>
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.latitude') }}</label>
              <input v-model.number="form.latitude" type="number" step="any" class="input-field" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700">{{ t('admin.form.longitude') }}</label>
              <input v-model.number="form.longitude" type="number" step="any" class="input-field" />
            </div>
          </div>
          <div class="mt-4">
            <label class="flex items-center gap-2">
              <input v-model="form.featured" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
              <span class="text-sm font-medium text-gray-700">{{ t('admin.form.featured') }}</span>
            </label>
          </div>
        </div>

        <div class="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 class="mb-4 text-sm font-semibold text-gray-900">{{ t('admin.form.services') }}</h3>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label
              v-for="s in serviceOptions"
              :key="s.value"
              class="flex items-center gap-2 rounded-xl border border-gray-100 px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
            >
              <input
                type="checkbox"
                :value="s.value"
                v-model="form.services"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              {{ t(s.labelKey) }}
            </label>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 class="mb-4 text-sm font-semibold text-gray-900">{{ t('admin.form.images') }}</h3>
          <AdminImageUploader
            v-if="apartmentId"
            :apartment-id="apartmentId"
            :images="images"
            @update="images = $event"
          />
          <p v-else class="text-sm text-gray-400">{{ t('admin.form.saveImagesFirst') }}</p>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-end gap-3">
      <NuxtLink :to="localePath('/admin/apartments')" class="btn-secondary">{{ t('admin.form.cancel') }}</NuxtLink>
      <button type="submit" :disabled="saving" class="btn-primary">
        <svg v-if="saving" class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ saving ? t('admin.form.saving') : (apartmentId ? t('admin.form.saveChanges') : t('admin.form.create')) }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { ApartmentImage } from '~/types'

const props = defineProps<{
  apartmentId?: string
}>()

const emit = defineEmits<{
  saved: [id: string]
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { success, error: toastError } = useToast()
const { createApartment, updateApartment, getApartmentById } = useAdminService()

const saving = ref(false)
const images = ref<ApartmentImage[]>([])

// Spanish values stored in DB; labels shown via i18n
const serviceOptions = [
  { value: 'WiFi gratuito', labelKey: 'amenities.wifi' },
  { value: 'Aire acondicionado', labelKey: 'amenities.ac' },
  { value: 'Calefacción', labelKey: 'amenities.heating' },
  { value: 'Cocina equipada', labelKey: 'amenities.kitchen' },
  { value: 'Lavadora', labelKey: 'amenities.washer' },
  { value: 'Televisión', labelKey: 'amenities.tv' },
  { value: 'Terraza', labelKey: 'amenities.terrace' },
  { value: 'Parking', labelKey: 'amenities.parking' },
  { value: 'Piscina', labelKey: 'amenities.pool' },
  { value: 'Limpieza incluida', labelKey: 'amenities.cleaning' },
  { value: 'Ropa de cama', labelKey: 'amenities.bedding' },
  { value: 'Toallas', labelKey: 'amenities.towels' },
  { value: 'Ascensor', labelKey: 'admin.form.elevator' },
  { value: 'Amueblado', labelKey: 'admin.form.furnished' },
  { value: 'Caja fuerte', labelKey: 'admin.form.safe' },
]

const form = reactive({
  name: '',
  slug: '',
  description: '',
  city: '',
  address: '',
  price_per_night: 80,
  max_guests: 2,
  bedrooms: 1,
  bathrooms: 1,
  square_meters: 50,
  featured: false,
  status: 'published' as 'published' | 'hidden',
  latitude: null as number | null,
  longitude: null as number | null,
  services: [] as string[],
})

let slugManual = false

function onNameInput() {
  if (!slugManual && !props.apartmentId) {
    form.slug = form.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

watch(() => form.slug, () => { slugManual = true })

onMounted(async () => {
  if (props.apartmentId) {
    const apt = await getApartmentById(props.apartmentId)
    if (apt) {
      Object.assign(form, {
        name: apt.name,
        slug: apt.slug,
        description: apt.description,
        city: apt.city,
        address: apt.address,
        price_per_night: apt.price_per_night,
        max_guests: apt.max_guests,
        bedrooms: apt.bedrooms,
        bathrooms: apt.bathrooms,
        square_meters: apt.square_meters,
        featured: apt.featured,
        status: apt.status,
        latitude: apt.latitude,
        longitude: apt.longitude,
        services: apt.services || [],
      })
      images.value = apt.apartment_images || []
      slugManual = true
    }
  }
})

async function handleSubmit() {
  saving.value = true
  try {
    if (props.apartmentId) {
      await updateApartment(props.apartmentId, { ...form })
      success(t('admin.form.updated'))
      emit('saved', props.apartmentId)
    } else {
      const apt = await createApartment({ ...form })
      if (apt) {
        success(t('admin.form.created'))
        emit('saved', apt.id)
        navigateTo(localePath(`/admin/apartments/${apt.id}`))
      }
    }
  } catch (e: any) {
    toastError(e.message || t('admin.form.saveError'))
  } finally {
    saving.value = false
  }
}
</script>
