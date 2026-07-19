<template>
  <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div class="flex-1">
        <label class="mb-1.5 block text-xs font-medium text-gray-500">{{ t('filters.city') }}</label>
        <select v-model="filters.city" class="input-field">
          <option value="">{{ t('filters.allCities') }}</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>

      <div class="flex-1">
        <label class="mb-1.5 block text-xs font-medium text-gray-500">{{ t('filters.priceMin') }}</label>
        <input
          v-model.number="filters.priceMin"
          type="number"
          min="0"
          placeholder="€0"
          class="input-field"
        />
      </div>

      <div class="flex-1">
        <label class="mb-1.5 block text-xs font-medium text-gray-500">{{ t('filters.priceMax') }}</label>
        <input
          v-model.number="filters.priceMax"
          type="number"
          min="0"
          :placeholder="t('filters.noLimit')"
          class="input-field"
        />
      </div>

      <div class="flex-1">
        <label class="mb-1.5 block text-xs font-medium text-gray-500">{{ t('filters.guests') }}</label>
        <input
          v-model.number="filters.guests"
          type="number"
          min="1"
          :placeholder="t('filters.anyGuests')"
          class="input-field"
        />
      </div>

      <div class="flex gap-2">
        <button class="btn-primary" @click="applyFilters">
          <svg class="me-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          {{ t('filters.apply') }}
        </button>
        <button class="btn-secondary" @click="clearFilters">{{ t('filters.clear') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { filters, cities, applyFilters, clearFilters } = useApartmentFilters()
</script>
