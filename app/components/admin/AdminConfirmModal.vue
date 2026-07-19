<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div
          class="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          @click.stop
        >
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <p class="mt-2 text-sm text-gray-500">{{ message }}</p>

          <div class="mt-6 flex justify-end gap-3">
            <button class="btn-secondary" @click="cancel">{{ t('admin.confirm.cancel') }}</button>
            <button
              class="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700"
              @click="confirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { isOpen, title, message, confirmText, confirm, cancel } = useConfirmModal()
</script>
