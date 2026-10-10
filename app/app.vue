<script setup lang="ts">
const authStore = useAuthStore()

onMounted(async () => {
  if (authStore.token) {
    await authStore.fetchCurrentUser()
  }
})
</script>

<template>
  <NuxtPage />
</template>
