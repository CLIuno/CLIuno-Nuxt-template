<script setup lang="ts">
import { ChevronDownIcon, LogOutIcon, MoonIcon, RocketIcon, SunIcon, UserIcon } from '@lucide/vue'

const authStore = useAuthStore()

const isDark = ref(false)

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  document.documentElement.classList.toggle('dark', isDark.value)
})

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const initials = computed(() => {
  const first = authStore.user?.first_name?.[0] || ''
  const last = authStore.user?.last_name?.[0] || ''
  return `${first}${last}` || '?'
})
</script>

<template>
  <header class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
    <nav class="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
      <!-- Brand + Links -->
      <div class="flex items-center gap-6">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold">
          <RocketIcon class="size-5" />
          <span>CLIuno</span>
        </NuxtLink>
        <div class="flex items-center gap-4 text-sm font-medium">
          <NuxtLink
            to="/todos"
            class="text-muted-foreground transition-colors hover:text-foreground"
            active-class="text-foreground"
          >
            Todos
          </NuxtLink>
          <NuxtLink
            to="/posts"
            class="text-muted-foreground transition-colors hover:text-foreground"
            active-class="text-foreground"
          >
            Posts
          </NuxtLink>
          <NuxtLink
            to="/users"
            class="text-muted-foreground transition-colors hover:text-foreground"
            active-class="text-foreground"
          >
            Users
          </NuxtLink>
        </div>
      </div>

      <!-- Theme toggle + auth -->
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Toggle theme" @click="toggleTheme">
          <MoonIcon v-if="isDark" class="size-4" />
          <SunIcon v-else class="size-4" />
        </Button>

        <ClientOnly>
          <DropdownMenu v-if="authStore.isAuthenticated">
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="sm" class="gap-2 px-1.5">
                <Avatar size="sm">
                  <AvatarImage
                    v-if="authStore.user?.avatar_url"
                    :src="authStore.user.avatar_url"
                    :alt="initials"
                  />
                  <AvatarFallback>{{ initials }}</AvatarFallback>
                </Avatar>
                <span class="hidden sm:inline">{{ authStore.user?.username }}</span>
                <ChevronDownIcon class="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
              <DropdownMenuLabel>{{ authStore.fullName || 'Account' }}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem v-if="authStore.user" as-child>
                <NuxtLink :to="`/users/${authStore.user.id}`">
                  <UserIcon />
                  My Profile
                </NuxtLink>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" @select="authStore.logout()">
                <LogOutIcon />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div v-else class="flex items-center gap-2">
            <Button variant="ghost" size="sm" as-child>
              <NuxtLink to="/login">Login</NuxtLink>
            </Button>
            <Button size="sm" as-child>
              <NuxtLink to="/register">Register</NuxtLink>
            </Button>
          </div>
        </ClientOnly>
      </div>
    </nav>
  </header>
</template>
