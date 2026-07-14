<script setup lang="ts">
import { CircleAlertIcon, EyeIcon, EyeOffIcon, Loader2Icon, RocketIcon } from '@lucide/vue'

definePageMeta({ layout: false, middleware: 'guest' })

const authStore = useAuthStore()
const usernameOrEmail = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleLogin() {
  if (!usernameOrEmail.value || !password.value) return
  try {
    await authStore.login(usernameOrEmail.value, password.value)
  } catch {
    // error handled in store
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
    <Card class="w-full max-w-sm">
      <CardHeader class="text-center">
        <NuxtLink to="/" class="mb-2 flex items-center justify-center gap-2 font-bold">
          <RocketIcon class="size-6" />
          <span class="text-xl">CLIuno</span>
        </NuxtLink>
        <CardTitle class="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <Alert v-if="authStore.error" variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>{{ authStore.error }}</AlertTitle>
        </Alert>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <Label for="login-username">Email or Username</Label>
            <Input
              id="login-username"
              v-model="usernameOrEmail"
              type="text"
              placeholder="Enter your email or username"
              required
            />
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="login-password">Password</Label>
              <NuxtLink
                to="/forgot-password"
                class="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </NuxtLink>
            </div>
            <div class="relative">
              <Input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="pr-9"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                class="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <EyeOffIcon v-if="showPassword" class="size-4" />
                <EyeIcon v-else class="size-4" />
              </Button>
            </div>
          </div>

          <Button type="submit" class="w-full" :disabled="authStore.loading">
            <Loader2Icon v-if="authStore.loading" class="size-4 animate-spin" />
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </form>
      </CardContent>

      <CardFooter class="justify-center text-sm text-muted-foreground">
        Don't have an account?
        <NuxtLink
          to="/register"
          class="ml-1 font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create account
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>
