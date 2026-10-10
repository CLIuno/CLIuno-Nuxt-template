<script setup lang="ts">
import { CircleAlertIcon, EyeIcon, EyeOffIcon, Loader2Icon, RocketIcon } from '@lucide/vue'

definePageMeta({ layout: false, middleware: 'guest' })

const authStore = useAuthStore()
const showPassword = ref(false)

const form = ref({
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
})

const passwordsMatch = computed(() => form.value.password === form.value.password_confirmation)
const isFormValid = computed(
  () =>
    form.value.first_name &&
    form.value.last_name &&
    form.value.username &&
    form.value.email &&
    form.value.phone &&
    form.value.password.length >= 8 &&
    passwordsMatch.value,
)

async function handleRegister() {
  if (!isFormValid.value) return
  try {
    await authStore.register(form.value)
  } catch {
    // error handled in store
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground"
  >
    <Card class="w-full max-w-sm">
      <CardHeader class="text-center">
        <NuxtLink to="/" class="mb-2 flex items-center justify-center gap-2 font-bold">
          <RocketIcon class="size-6" />
          <span class="text-xl">CLIuno</span>
        </NuxtLink>
        <CardTitle class="text-xl">Create Account</CardTitle>
        <CardDescription>Join the community</CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <Alert v-if="authStore.error" variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>{{ authStore.error }}</AlertTitle>
        </Alert>

        <form class="space-y-4" @submit.prevent="handleRegister">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="reg-first-name">First Name</Label>
              <Input
                id="reg-first-name"
                v-model="form.first_name"
                type="text"
                placeholder="John"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="reg-last-name">Last Name</Label>
              <Input
                id="reg-last-name"
                v-model="form.last_name"
                type="text"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="reg-username">Username</Label>
            <Input
              id="reg-username"
              v-model="form.username"
              type="text"
              placeholder="johndoe"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="reg-email">Email</Label>
            <Input
              id="reg-email"
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="reg-phone">Phone</Label>
            <Input
              id="reg-phone"
              v-model="form.phone"
              type="tel"
              placeholder="+966512345678"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="reg-password">Password</Label>
            <div class="relative">
              <Input
                id="reg-password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min 8 characters"
                class="pr-9"
                required
                minlength="8"
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

          <div class="space-y-2">
            <Label for="reg-password-confirm">Confirm Password</Label>
            <Input
              id="reg-password-confirm"
              v-model="form.password_confirmation"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
              :aria-invalid="Boolean(form.password_confirmation && !passwordsMatch)"
              required
            />
            <p
              v-if="form.password_confirmation && !passwordsMatch"
              class="text-sm text-destructive"
            >
              Passwords do not match
            </p>
          </div>

          <Button type="submit" class="w-full" :disabled="authStore.loading || !isFormValid">
            <Loader2Icon v-if="authStore.loading" class="size-4 animate-spin" />
            {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
          </Button>
        </form>
      </CardContent>

      <CardFooter class="justify-center text-sm text-muted-foreground">
        Already have an account?
        <NuxtLink
          to="/login"
          class="ml-1 font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </NuxtLink>
      </CardFooter>
    </Card>
  </div>
</template>
