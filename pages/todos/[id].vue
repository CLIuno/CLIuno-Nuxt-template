<script setup lang="ts">
import { ArrowLeftIcon, CheckIcon, Loader2Icon, PencilIcon, Undo2Icon, UserIcon } from '@lucide/vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const authStore = useAuthStore()
const todoApi = useTodoApi()
const timeAgo = useTimeAgo()
const todoId = route.params.id as string

interface Todo {
  id: string
  title: string
  description: string
  is_completed: boolean
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
}

const todo = ref<Todo | null>(null)
const loading = ref(true)
const editing = ref(false)
const editTitle = ref('')
const editDescription = ref('')

async function fetchTodo() {
  loading.value = true
  try {
    const res = await todoApi.getTodoById(todoId)
    todo.value = res.data.data.todo
  } catch {
    // handle
  } finally {
    loading.value = false
  }
}

async function toggleComplete() {
  if (!todo.value) return
  try {
    await todoApi.toggleTodo(todoId)
    todo.value.is_completed = !todo.value.is_completed
  } catch {
    // handle
  }
}

function startEdit() {
  if (!todo.value) return
  editTitle.value = todo.value.title
  editDescription.value = todo.value.description || ''
  editing.value = true
}

async function saveEdit() {
  if (!todo.value) return
  try {
    await todoApi.updateTodo(todoId, {
      title: editTitle.value,
      description: editDescription.value,
    })
    todo.value.title = editTitle.value
    todo.value.description = editDescription.value
    editing.value = false
  } catch {
    // handle
  }
}

onMounted(fetchTodo)
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <!-- Back -->
    <Button variant="ghost" size="sm" class="mb-6" as-child>
      <NuxtLink to="/todos">
        <ArrowLeftIcon class="size-4" />
        Back to Todos
      </NuxtLink>
    </Button>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <Loader2Icon class="size-8 animate-spin text-muted-foreground" />
    </div>

    <Card v-else-if="todo">
      <CardContent>
        <template v-if="!editing">
          <div class="flex items-start justify-between gap-4">
            <div>
              <Badge :variant="todo.is_completed ? 'secondary' : 'outline'" class="mb-2">
                {{ todo.is_completed ? 'Completed' : 'Active' }}
              </Badge>
              <h1
                class="text-2xl font-bold"
                :class="{ 'text-muted-foreground line-through': todo.is_completed }"
              >
                {{ todo.title }}
              </h1>
              <p v-if="todo.description" class="mt-3 text-muted-foreground">
                {{ todo.description }}
              </p>
            </div>
            <div v-if="todo.user.id === authStore.user?.id" class="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" @click="toggleComplete">
                <Undo2Icon v-if="todo.is_completed" class="size-4" />
                <CheckIcon v-else class="size-4" />
                {{ todo.is_completed ? 'Reopen' : 'Complete' }}
              </Button>
              <Button variant="outline" size="icon-sm" aria-label="Edit todo" @click="startEdit">
                <PencilIcon class="size-4" />
              </Button>
            </div>
          </div>
        </template>

        <!-- Edit Mode -->
        <form v-else class="space-y-4" @submit.prevent="saveEdit">
          <div class="space-y-2">
            <Label for="todo-edit-title">Title</Label>
            <Input
              id="todo-edit-title"
              v-model="editTitle"
              type="text"
              class="text-lg font-semibold"
            />
          </div>
          <div class="space-y-2">
            <Label for="todo-edit-description">Description</Label>
            <Textarea id="todo-edit-description" v-model="editDescription" :rows="3" />
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
            :to="`/users/${todo.user.id}`"
            class="flex items-center gap-1 hover:text-foreground"
          >
            <UserIcon class="size-4" />
            {{ todo.user.first_name }} {{ todo.user.last_name }} (@{{ todo.user.username }})
          </NuxtLink>
          <span>{{ timeAgo(todo.createdAt) }}</span>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
