<script setup lang="ts">
import {
  FileTextIcon,
  Loader2Icon,
  MessageSquareIcon,
  PlusIcon,
  Trash2Icon,
  UserIcon,
} from '@lucide/vue'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const postApi = usePostApi()
const timeAgo = useTimeAgo()

interface Post {
  id: string
  title: string
  content: string
  imageUrl: string
  is_paid: boolean
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
  comments: Record<string, unknown>[]
}

const posts = ref<Post[]>([])
const loading = ref(true)
const showCreateModal = ref(false)
const newTitle = ref('')
const newContent = ref('')
const creating = ref(false)
const filter = ref<'all' | 'mine'>('all')

const filters = [
  { value: 'all', label: 'All' },
  { value: 'mine', label: 'Mine' },
] as const

const filteredPosts = computed(() => {
  if (filter.value === 'mine') return posts.value.filter((p) => p.user.id === authStore.user?.id)
  return posts.value
})

async function fetchPosts() {
  loading.value = true
  try {
    const res = await postApi.getAllPosts()
    posts.value = res.data.data.posts
  } catch {
    // handle
  } finally {
    loading.value = false
  }
}

async function createPost() {
  if (!newTitle.value.trim() || !newContent.value.trim()) return
  creating.value = true
  try {
    await postApi.createPost({ title: newTitle.value, content: newContent.value })
    newTitle.value = ''
    newContent.value = ''
    showCreateModal.value = false
    await fetchPosts()
  } catch {
    // handle
  } finally {
    creating.value = false
  }
}

async function deletePost(id: string) {
  try {
    await postApi.deletePostById(id)
    posts.value = posts.value.filter((p) => p.id !== id)
  } catch {
    // handle
  }
}

onMounted(fetchPosts)
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold">Posts</h1>
        <p class="text-muted-foreground">Share and discuss with the community</p>
      </div>
      <Button @click="showCreateModal = true">
        <PlusIcon class="size-4" />
        New Post
      </Button>
    </div>

    <!-- Filters -->
    <div class="mb-6 inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-1">
      <button
        v-for="f in filters"
        :key="f.value"
        type="button"
        class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
        :class="
          filter === f.value
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        "
        @click="filter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <Loader2Icon class="size-8 animate-spin text-muted-foreground" />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredPosts.length === 0" class="py-20 text-center">
      <FileTextIcon class="mx-auto size-16 text-muted-foreground/40" />
      <h3 class="mt-4 text-xl font-semibold">No posts yet</h3>
      <p class="mt-2 text-muted-foreground">Create your first post to get started!</p>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <Card v-for="post in filteredPosts" :key="post.id" class="py-4">
        <CardContent class="flex items-start gap-3 px-4">
          <div class="min-w-0 flex-1">
            <NuxtLink :to="`/posts/${post.id}`">
              <h3 class="font-semibold transition-colors hover:text-muted-foreground">
                {{ post.title }}
              </h3>
            </NuxtLink>
            <p v-if="post.content" class="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {{ post.content }}
            </p>
            <div class="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <NuxtLink
                :to="`/users/${post.user.id}`"
                class="flex items-center gap-1 hover:text-foreground"
              >
                <UserIcon class="size-4" />
                @{{ post.user.username }}
              </NuxtLink>
              <span class="flex items-center gap-1">
                <MessageSquareIcon class="size-4" />
                {{ post.comments?.length || 0 }}
              </span>
              <span>{{ timeAgo(post.createdAt) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <Button
            v-if="post.user.id === authStore.user?.id"
            variant="ghost"
            size="icon-sm"
            class="text-muted-foreground hover:text-destructive"
            aria-label="Delete post"
            @click="deletePost(post.id)"
          >
            <Trash2Icon class="size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Create Dialog -->
    <Dialog v-model:open="showCreateModal">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>Share something with the community.</DialogDescription>
        </DialogHeader>
        <form class="space-y-4" @submit.prevent="createPost">
          <div class="space-y-2">
            <Label for="post-title">Title</Label>
            <Input
              id="post-title"
              v-model="newTitle"
              type="text"
              placeholder="Post title"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="post-content">Content</Label>
            <Textarea
              id="post-content"
              v-model="newContent"
              placeholder="Write your post..."
              :rows="5"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="showCreateModal = false">
              Cancel
            </Button>
            <Button type="submit" :disabled="creating">
              <Loader2Icon v-if="creating" class="size-4 animate-spin" />
              {{ creating ? 'Creating...' : 'Create' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
