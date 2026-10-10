<script setup lang="ts">
import { PackageIcon, RocketIcon, SparklesIcon, ZapIcon } from '@lucide/vue'

const steps = [
  {
    title: 'Choose Your Template',
    description: 'Browse through our collection of ready-to-use templates.',
  },
  {
    title: 'Customize It',
    description: 'Adjust the template to your needs with minimal effort.',
  },
  {
    title: 'Launch',
    description: 'Deploy and launch your project in no time.',
  },
]

const features = [
  {
    icon: SparklesIcon,
    title: 'Open Source',
    description: 'Use it for free and contribute to the project.',
  },
  {
    icon: PackageIcon,
    title: 'Free',
    description: 'Use even for commercial projects, no cost at all.',
  },
  {
    icon: ZapIcon,
    title: 'Simplicity First',
    description: 'No experience needed. Just plug and play.',
  },
  {
    icon: RocketIcon,
    title: 'Fast Launch',
    description: 'Get projects off the ground with one command.',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="border-b bg-muted/30 px-6 py-24">
      <div class="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <div
          class="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
        >
          <RocketIcon class="size-8" />
        </div>
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Welcome to CLIuno Templates</h1>
        <p class="max-w-xl text-lg text-muted-foreground">
          The ultimate tool to make your journey in web development less painful.
        </p>
        <Button size="lg" as-child>
          <NuxtLink to="/register">Get Started</NuxtLink>
        </Button>
      </div>
    </section>

    <!-- Steps -->
    <section class="px-6 py-20">
      <div class="mx-auto max-w-5xl">
        <div class="mb-12 text-center">
          <h2 class="text-3xl font-bold">Reset Your Development Journey</h2>
          <p class="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Forget the confusion and complexity—use our templates to start your next project without
            the hassle.
          </p>
        </div>
        <div class="grid gap-6 sm:grid-cols-3">
          <Card v-for="(step, index) in steps" :key="step.title">
            <CardHeader>
              <span class="text-sm font-medium text-muted-foreground">Step {{ index + 1 }}</span>
              <CardTitle>{{ step.title }}</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground">{{ step.description }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="border-t px-6 py-20">
      <div class="mx-auto max-w-5xl">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card v-for="feature in features" :key="feature.title">
            <CardHeader>
              <component :is="feature.icon" class="size-8 text-primary" />
              <CardTitle class="mt-2 text-base">{{ feature.title }}</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-sm text-muted-foreground">{{ feature.description }}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>
