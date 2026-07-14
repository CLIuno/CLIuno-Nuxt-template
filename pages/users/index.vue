<script setup lang="ts">
import { Loader2Icon, UserCheckIcon, UserPlusIcon, UsersIcon } from '@lucide/vue'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const userApi = useUserApi()
const followApi = useFollowApi()

interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
}

const users = ref<User[]>([])
const loading = ref(true)
const followingMap = ref<Record<string, boolean>>({})

async function fetchUsers() {
  loading.value = true
  try {
    const res = await userApi.getUsers()
    users.value = res.data.data.users.filter((u: User) => u.id !== authStore.user?.id)
    for (const user of users.value) {
      try {
        const followRes = await followApi.isFollowing(user.id)
        followingMap.value[user.id] = followRes.data.data.isFollowing
      } catch {
        followingMap.value[user.id] = false
      }
    }
  } catch {
    // handle
  } finally {
    loading.value = false
  }
}

async function toggleFollow(userId: string) {
  try {
    if (followingMap.value[userId]) {
      await followApi.unfollow(userId)
      followingMap.value[userId] = false
    } else {
      await followApi.follow(userId)
      followingMap.value[userId] = true
    }
  } catch {
    // handle
  }
}

onMounted(fetchUsers)
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Users</h1>
      <p class="text-muted-foreground">Discover and follow other users</p>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <Loader2Icon class="size-8 animate-spin text-muted-foreground" />
    </div>

    <div v-else-if="users.length === 0" class="py-20 text-center">
      <UsersIcon class="mx-auto size-16 text-muted-foreground/40" />
      <h3 class="mt-4 text-xl font-semibold">No other users yet</h3>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card v-for="user in users" :key="user.id" class="py-4">
        <CardContent class="flex flex-row items-center gap-4 px-4">
          <Avatar size="lg">
            <AvatarFallback>{{ user.first_name[0] }}{{ user.last_name[0] }}</AvatarFallback>
          </Avatar>

          <div class="min-w-0 flex-1">
            <NuxtLink
              :to="`/users/${user.id}`"
              class="font-semibold transition-colors hover:text-muted-foreground"
            >
              {{ user.first_name }} {{ user.last_name }}
            </NuxtLink>
            <p class="text-sm text-muted-foreground">@{{ user.username }}</p>
          </div>

          <Button
            size="sm"
            :variant="followingMap[user.id] ? 'outline' : 'default'"
            @click="toggleFollow(user.id)"
          >
            <UserCheckIcon v-if="followingMap[user.id]" class="size-4" />
            <UserPlusIcon v-else class="size-4" />
            {{ followingMap[user.id] ? 'Following' : 'Follow' }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
