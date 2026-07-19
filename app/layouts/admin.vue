<template>
  <div class="admin-layout flex min-h-screen bg-gray-50">
    <AdminSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />

    <div class="flex flex-1 flex-col" :class="sidebarCollapsed ? 'ms-16' : 'ms-0 md:ms-64'">
      <AdminHeader @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />

      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <AdminToast />
    <AdminConfirmModal />
  </div>
</template>

<script setup lang="ts">
const sidebarCollapsed = ref(false)
</script>
