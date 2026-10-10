<script setup lang="ts">
import { ClipboardCheckIcon, Loader2Icon, PlusIcon, Trash2Icon, UserIcon } from '@lucide/vue'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const todoApi = useTodoApi()
const timeAgo = useTimeAgo()

interface Todo {
  id: string
  title: string
  description: string
  is_completed: boolean
  createdAt: string
  user: { id: string; username: string; first_name: string; last_name: string }
}

const todos = ref<Todo[]>([])
const loading = ref(true)
const showCreateModal = ref(false)
const newTitle = ref('')
const newDescription = ref('')
const creating = ref(false)
const filter = ref<'all' | 'mine' | 'active' | 'completed'>('all')

const filters = [
  { value: 'all', label: 'All' },
  { value: 'mine', label: 'Mine' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
] as const

const filteredTodos = computed(() => {
  let result = todos.value
  if (filter.value === 'mine') result = result.filter((t) => t.user.id === authStore.user?.id)
  if (filter.value === 'active') result = result.filter((t) => !t.is_completed)
  if (filter.value === 'completed') result = result.filter((t) => t.is_completed)
  return result
})

async function fetchTodos() {
  loading.value = true
  try {
    const res = await todoApi.getAllTodos()
    todos.value = res.data.data.todos
  } catch {
    // handle
  } finally {
    loading.value = false
  }
}

async function createTodo() {
  if (!newTitle.value.trim()) return
  creating.value = true
  try {
    await todoApi.createTodo({ title: newTitle.value, description: newDescription.value })
    newTitle.value = ''
    newDescription.value = ''
    showCreateModal.value = false
    await fetchTodos()
  } catch {
    // handle
  } finally {
    creating.value = false
  }
}

async function toggleTodo(id: string) {
  try {
    await todoApi.toggleTodo(id)
    const todo = todos.value.find((t) => t.id === id)
    if (todo) todo.is_completed = !todo.is_completed
  } catch {
    // handle
  }
}

async function deleteTodo(id: string) {
  try {
    await todoApi.deleteTodo(id)
    todos.value = todos.value.filter((t) => t.id !== id)
  } catch {
    // handle
  }
}

onMounted(fetchTodos)
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold">Todos</h1>
        <p class="text-muted-foreground">Manage your tasks and collaborate with others</p>
      </div>
      <Button @click="showCreateModal = true">
        <PlusIcon class="size-4" />
        New Todo
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
    <div v-else-if="filteredTodos.length === 0" class="py-20 text-center">
      <ClipboardCheckIcon class="mx-auto size-16 text-muted-foreground/40" />
      <h3 class="mt-4 text-xl font-semibold">No todos yet</h3>
      <p class="mt-2 text-muted-foreground">Create your first todo to get started!</p>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <Card v-for="todo in filteredTodos" :key="todo.id" class="py-4">
        <CardContent class="flex items-start gap-3 px-4">
          <Checkbox
            :model-value="todo.is_completed"
            :disabled="todo.user.id !== authStore.user?.id"
            :aria-label="todo.is_completed ? 'Mark as active' : 'Mark as completed'"
            class="mt-1"
            @update:model-value="toggleTodo(todo.id)"
          />

          <!-- Content -->
          <div class="min-w-0 flex-1">
            <NuxtLink :to="`/todos/${todo.id}`">
              <h3
                class="font-semibold transition-colors hover:text-muted-foreground"
                :class="{ 'text-muted-foreground line-through': todo.is_completed }"
              >
                {{ todo.title }}
              </h3>
            </NuxtLink>
            <p v-if="todo.description" class="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {{ todo.description }}
            </p>
            <div class="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <NuxtLink
                :to="`/users/${todo.user.id}`"
                class="flex items-center gap-1 hover:text-foreground"
              >
                <UserIcon class="size-4" />
                @{{ todo.user.username }}
              </NuxtLink>
              <span>{{ timeAgo(todo.createdAt) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <Button
            v-if="todo.user.id === authStore.user?.id"
            variant="ghost"
            size="icon-sm"
            class="text-muted-foreground hover:text-destructive"
            aria-label="Delete todo"
            @click="deleteTodo(todo.id)"
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
          <DialogTitle>Create New Todo</DialogTitle>
          <DialogDescription>Add a task to your list.</DialogDescription>
        </DialogHeader>
        <form class="space-y-4" @submit.prevent="createTodo">
          <div class="space-y-2">
            <Label for="todo-title">Title</Label>
            <Input
              id="todo-title"
              v-model="newTitle"
              type="text"
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="todo-description">Description (optional)</Label>
            <Textarea
              id="todo-description"
              v-model="newDescription"
              placeholder="Add more details..."
              :rows="3"
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
