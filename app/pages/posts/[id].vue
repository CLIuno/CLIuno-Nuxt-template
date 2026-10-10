<script setup lang="ts">
import {
  ArrowLeftIcon,
  Loader2Icon,
  MessageSquareIcon,
  PencilIcon,
  SendIcon,
  Trash2Icon,
  UserIcon,
} from '@lucide/vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const authStore = useAuthStore()
const postApi = usePostApi()
const timeAgo = useTimeAgo()
const postId = route.params.id as string

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    username: string
    first_name: string
    last_name: string
    avatar_url?: string | null
  }
}

interface Post {
  id: string
  title: string
  content: string
  image_url?: string | null
  is_paid: boolean
  createdAt: string
  user: {
    id: string
    username: string
    first_name: string
    last_name: string
    avatar_url?: string | null
  }
  comments: Comment[]
}

const post = ref<Post | null>(null)
const loading = ref(true)
const newComment = ref('')
const submittingComment = ref(false)
const editing = ref(false)
const editTitle = ref('')
const editContent = ref('')
const editingCommentId = ref<string | null>(null)
const editCommentContent = ref('')

async function fetchPost() {
  loading.value = true
  try {
    const res = await postApi.getPostById(postId)
    post.value = res.data.data.post
  } catch {
    // handle
  } finally {
    loading.value = false
  }
}

async function addComment() {
  if (!newComment.value.trim()) return
  submittingComment.value = true
  try {
    await postApi.createComment(postId, { content: newComment.value })
    newComment.value = ''
    await fetchPost()
  } catch {
    // handle
  } finally {
    submittingComment.value = false
  }
}

async function deleteComment(commentId: string) {
  try {
    await postApi.deleteComment(postId, commentId)
    if (post.value) {
      post.value.comments = post.value.comments.filter((c) => c.id !== commentId)
    }
  } catch {
    // handle
  }
}

function startEdit() {
  if (!post.value) return
  editTitle.value = post.value.title
  editContent.value = post.value.content || ''
  editing.value = true
}

async function saveEdit() {
  if (!post.value) return
  try {
    await postApi.updatePostById(postId, {
      title: editTitle.value,
      content: editContent.value,
    })
    post.value.title = editTitle.value
    post.value.content = editContent.value
    editing.value = false
  } catch {
    // handle
  }
}

function startEditComment(comment: Comment) {
  editingCommentId.value = comment.id
  editCommentContent.value = comment.content
}

async function saveEditComment(commentId: string) {
  try {
    await postApi.updateComment(postId, commentId, { content: editCommentContent.value })
    const comment = post.value?.comments.find((c) => c.id === commentId)
    if (comment) comment.content = editCommentContent.value
    editingCommentId.value = null
  } catch {
    // handle
  }
}

onMounted(fetchPost)
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <!-- Back -->
    <Button variant="ghost" size="sm" class="mb-6" as-child>
      <NuxtLink to="/posts">
        <ArrowLeftIcon class="size-4" />
        Back to Posts
      </NuxtLink>
    </Button>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <Loader2Icon class="size-8 animate-spin text-muted-foreground" />
    </div>

    <template v-else-if="post">
      <!-- Detail Card -->
      <Card class="mb-6">
        <CardContent>
          <template v-if="!editing">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h1 class="text-2xl font-bold">
                  {{ post.title }}
                </h1>
                <p v-if="post.content" class="mt-3 text-muted-foreground">
                  {{ post.content }}
                </p>
                <img
                  v-if="post.image_url"
                  :src="post.image_url"
                  :alt="post.title"
                  class="mt-3 max-h-96 w-full rounded-md border object-cover"
                />
              </div>
              <div v-if="post.user.id === authStore.user?.id" class="flex shrink-0 gap-2">
                <Button variant="outline" size="icon-sm" aria-label="Edit post" @click="startEdit">
                  <PencilIcon class="size-4" />
                </Button>
              </div>
            </div>
          </template>

          <!-- Edit Mode -->
          <form v-else class="space-y-4" @submit.prevent="saveEdit">
            <div class="space-y-2">
              <Label for="post-edit-title">Title</Label>
              <Input
                id="post-edit-title"
                v-model="editTitle"
                type="text"
                class="text-xl font-bold"
              />
            </div>
            <div class="space-y-2">
              <Label for="post-edit-content">Content</Label>
              <Textarea id="post-edit-content" v-model="editContent" :rows="5" />
            </div>
            <div class="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" @click="editing = false">
                Cancel
              </Button>
              <Button type="submit" size="sm">Save</Button>
            </div>
          </form>

          <!-- Meta -->
          <div class="mt-4 flex items-center gap-4 border-t pt-4 text-sm text-muted-foreground">
            <NuxtLink
              :to="`/users/${post.user.id}`"
              class="flex items-center gap-1 hover:text-foreground"
            >
              <UserIcon class="size-4" />
              {{ post.user.first_name }} {{ post.user.last_name }} (@{{ post.user.username }})
            </NuxtLink>
            <span>{{ timeAgo(post.createdAt) }}</span>
          </div>
        </CardContent>
      </Card>

      <!-- Comments Section -->
      <Card>
        <CardContent>
          <h2 class="mb-4 flex items-center gap-2 text-xl font-bold">
            <MessageSquareIcon class="size-5" />
            Comments ({{ post.comments?.length || 0 }})
          </h2>

          <!-- Add Comment -->
          <form class="mb-6 flex gap-2" @submit.prevent="addComment">
            <Input
              v-model="newComment"
              type="text"
              placeholder="Write a comment..."
              aria-label="Write a comment"
              required
            />
            <Button
              type="submit"
              size="icon"
              :disabled="submittingComment"
              aria-label="Send comment"
            >
              <Loader2Icon v-if="submittingComment" class="size-4 animate-spin" />
              <SendIcon v-else class="size-4" />
            </Button>
          </form>

          <Separator v-if="post.comments?.length" class="mb-4" />

          <!-- Comments List -->
          <div v-if="!post.comments?.length" class="py-8 text-center text-muted-foreground/60">
            <MessageSquareIcon class="mx-auto mb-2 size-10" />
            <p>No comments yet. Be the first!</p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="comment in post.comments" :key="comment.id" class="flex gap-3">
              <Avatar size="sm">
                <AvatarImage
                  v-if="comment.user.avatar_url"
                  :src="comment.user.avatar_url"
                  :alt="comment.user.username"
                />
                <AvatarFallback
                  >{{ comment.user.first_name[0] }}{{ comment.user.last_name[0] }}</AvatarFallback
                >
              </Avatar>
              <div class="flex-1 rounded-lg bg-muted p-3">
                <div class="mb-1 flex items-center justify-between">
                  <NuxtLink
                    :to="`/users/${comment.user.id}`"
                    class="text-sm font-semibold hover:text-foreground"
                  >
                    {{ comment.user.username }}
                  </NuxtLink>
                  <div class="flex items-center gap-1">
                    <span class="text-xs text-muted-foreground">{{
                      timeAgo(comment.createdAt)
                    }}</span>
                    <template v-if="comment.user.id === authStore.user?.id">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label="Edit comment"
                        @click="startEditComment(comment)"
                      >
                        <PencilIcon class="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        class="text-muted-foreground hover:text-destructive"
                        aria-label="Delete comment"
                        @click="deleteComment(comment.id)"
                      >
                        <Trash2Icon class="size-3" />
                      </Button>
                    </template>
                  </div>
                </div>

                <div v-if="editingCommentId === comment.id" class="flex gap-2">
                  <Input
                    v-model="editCommentContent"
                    class="h-8 flex-1 text-sm"
                    aria-label="Edit comment"
                  />
                  <Button size="sm" @click="saveEditComment(comment.id)">Save</Button>
                  <Button variant="outline" size="sm" @click="editingCommentId = null">
                    Cancel
                  </Button>
                </div>
                <p v-else class="text-sm">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </template>
  </div>
</template>
