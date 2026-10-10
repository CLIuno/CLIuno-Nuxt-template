<script setup lang="ts">
import { CircleAlertIcon, CircleCheckIcon, Loader2Icon, RocketIcon } from '@lucide/vue'

definePageMeta({ layout: false, middleware: 'guest' })

const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    const authApi = useAuthApi()
    await authApi.forgotPassword(email.value)
    success.value = true
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    error.value = axiosErr.response?.data?.message || 'Something went wrong'
  } finally {
    loading.value = false
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
        <CardTitle class="text-xl">Forgot Password</CardTitle>
        <CardDescription>Enter your email to receive a reset link</CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <Alert v-if="success">
          <CircleCheckIcon />
          <AlertTitle>Reset link sent!</AlertTitle>
          <AlertDescription>Check your email.</AlertDescription>
        </Alert>

        <Alert v-if="error" variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>{{ error }}</AlertTitle>
        </Alert>

        <form v-if="!success" class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="forgot-email">Email Address</Label>
            <Input
              id="forgot-email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            <Loader2Icon v-if="loading" class="size-4 animate-spin" />
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </Button>
        </form>
      </CardContent>

      <CardFooter class="justify-center text-sm text-muted-foreground">
        <NuxtLink
          to="/login"
          class="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to Sign In
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>
