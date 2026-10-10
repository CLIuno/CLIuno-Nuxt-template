<script setup lang="ts">
import { Loader2Icon, UserCheckIcon, UserPlusIcon } from '@lucide/vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const authStore = useAuthStore()
const userApi = useUserApi()
const followApi = useFollowApi()

interface User {
  id: string
  username: string
  first_name: string
  last_name: string
  email: string
  avatar_url?: string | null
}

const user = ref<User | null>(null)
const loading = ref(true)
const followers = ref<User[]>([])
const following = ref<User[]>([])
const isFollowing = ref(false)

const isOwnProfile = computed(() => authStore.user?.id === user.value?.id)
const { uploading, uploadError, uploadImage } = useImageUpload()
const avatarInput = ref<HTMLInputElement | null>(null)

async function onAvatarPicked(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const url = await uploadImage(file)
  if (url) {
    await userApi.updateCurrentUser({ avatar_url: url })
    await authStore.fetchCurrentUser()
    if (user.value) user.value = { ...user.value, avatar_url: url }
  }

  // reset so re-picking the same file still fires change
  input.value = ''
}

async function loadProfile() {
  loading.value = true
  const userId = (route.params.id as string) || authStore.user?.id
  if (!userId) {
    loading.value = false
    return
  }
  try {
    const userRes = await userApi.getUserById(userId)
    user.value = userRes.data.data.user

    const [followersRes, followingRes, followStatusRes] = await Promise.all([
      followApi.getFollowers(userId),
      followApi.getFollowing(userId),
      authStore.user?.id === userId
        ? Promise.resolve({ data: { data: { isFollowing: false } } })
        : followApi.isFollowing(userId),
    ])
    followers.value = followersRes.data.data.followers
    following.value = followingRes.data.data.following
    isFollowing.value = followStatusRes.data.data.isFollowing
  } catch {
    // handle
  } finally {
    loading.value = false
  }
}

async function toggleFollow() {
  if (!user.value) return
  try {
    if (isFollowing.value) {
      await followApi.unfollow(user.value.id)
      isFollowing.value = false
      followers.value = followers.value.filter((f) => f.id !== authStore.user?.id)
    } else {
      await followApi.follow(user.value.id)
      isFollowing.value = true
      if (authStore.user) followers.value.push(authStore.user as User)
    }
  } catch {
    // handle
  }
}

watch(() => route.params.id, loadProfile)
onMounted(loadProfile)
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <div v-if="loading" class="flex justify-center py-20">
      <Loader2Icon class="size-8 animate-spin text-muted-foreground" />
    </div>

    <template v-else-if="user">
      <!-- Profile Card -->
      <Card class="mb-6 gap-0 py-0">
        <!-- Cover -->
        <div class="h-32 rounded-t-xl bg-linear-to-r from-primary to-secondary" />

        <CardContent class="px-6 pb-6">
          <div class="-mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <div class="flex flex-col items-center gap-2">
              <Avatar class="size-24 text-2xl ring-4 ring-background">
                <AvatarImage v-if="user.avatar_url" :src="user.avatar_url" :alt="user.username" />
                <AvatarFallback>{{ user.first_name[0] }}{{ user.last_name[0] }}</AvatarFallback>
              </Avatar>

              <template v-if="isOwnProfile">
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  class="hidden"
                  @change="onAvatarPicked"
                />
                <Button
                  variant="outline"
                  size="sm"
                  :disabled="uploading"
                  @click="avatarInput?.click()"
                >
                  {{ uploading ? 'Uploading…' : 'Change photo' }}
                </Button>
              </template>
            </div>

            <div class="flex-1 text-center sm:text-left">
              <h1 class="text-2xl font-bold">{{ user.first_name }} {{ user.last_name }}</h1>
              <p class="text-muted-foreground">@{{ user.username }}</p>
              <p v-if="uploadError" class="mt-1 text-sm text-destructive">{{ uploadError }}</p>
            </div>

            <!-- Follow Button -->
            <Button
              v-if="!isOwnProfile"
              :variant="isFollowing ? 'outline' : 'default'"
              @click="toggleFollow"
            >
              <UserCheckIcon v-if="isFollowing" class="size-4" />
              <UserPlusIcon v-else class="size-4" />
              {{ isFollowing ? 'Following' : 'Follow' }}
            </Button>
          </div>

          <!-- Stats -->
          <div class="mt-6 flex justify-center gap-8 sm:justify-start">
            <div class="text-center">
              <span class="text-xl font-bold">{{ followers.length }}</span>
              <p class="text-sm text-muted-foreground">Followers</p>
            </div>
            <div class="text-center">
              <span class="text-xl font-bold">{{ following.length }}</span>
              <p class="text-sm text-muted-foreground">Following</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Followers -->
      <Card v-if="followers.length" class="mb-6">
        <CardContent>
          <h2 class="mb-3 text-lg font-bold">Followers</h2>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              v-for="f in followers"
              :key="f.id"
              :to="`/users/${f.id}`"
              class="flex items-center gap-2 rounded-full bg-muted px-3 py-1 transition-colors hover:bg-accent"
            >
              <Avatar size="sm">
                <AvatarImage v-if="f.avatar_url" :src="f.avatar_url" :alt="f.username" />
                <AvatarFallback>{{ f.first_name[0] }}</AvatarFallback>
              </Avatar>
              <span class="text-sm">{{ f.username }}</span>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>

      <!-- Following -->
      <Card v-if="following.length">
        <CardContent>
          <h2 class="mb-3 text-lg font-bold">Following</h2>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              v-for="f in following"
              :key="f.id"
              :to="`/users/${f.id}`"
              class="flex items-center gap-2 rounded-full bg-muted px-3 py-1 transition-colors hover:bg-accent"
            >
              <Avatar size="sm">
                <AvatarImage v-if="f.avatar_url" :src="f.avatar_url" :alt="f.username" />
                <AvatarFallback>{{ f.first_name[0] }}</AvatarFallback>
              </Avatar>
              <span class="text-sm">{{ f.username }}</span>
            </NuxtLink>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
