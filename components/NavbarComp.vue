<script setup lang="ts">
import { Icon } from '@iconify/vue'

const isDark = ref(false)
const showMenu = ref(false)
const isLoggedIn = computed(() => (import.meta.client ? !!localStorage.getItem('token') : false))

const navButtons = [
  { label: 'Docs', link: 'https://github.com/CLIuno', style: 'secondary' },
  { label: 'Donate', link: 'https://ko-fi.com/ru44y', style: 'accent' },
  { label: 'Star', link: 'https://github.com/CLIuno', style: 'info' },
]

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
})

function onThemeChange(e: Event) {
  isDark.value = (e.target as HTMLInputElement).checked
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme
  localStorage.setItem('theme', theme)
}

function toggleNavbar() {
  showMenu.value = !showMenu.value
}
</script>

<template>
  <header class="tw:bg-base-100 tw:shadow-sm tw:px-4 sm:tw:px-6 tw:py-3">
    <nav class="tw:flex tw:items-center tw:justify-between tw:container tw:mx-auto">
      <!-- Logo -->
      <NuxtLink to="/" class="tw:flex tw:items-center tw:gap-2">
        <Icon icon="mdi:rocket-launch-outline" class="tw:w-6 tw:h-6 tw:text-primary" />
        <span class="tw:text-xl tw:font-bold tw:text-primary">CLIuno</span>
      </NuxtLink>

      <!-- Desktop Buttons -->
      <div class="tw:hidden tw:md:flex tw:items-center">
        <label class="tw:toggle tw:text-base-content">
          <input
            type="checkbox"
            :checked="isDark"
            value="dark"
            class="theme-controller"
            @change="onThemeChange"
          />
          <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </g>
          </svg>
          <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </g>
          </svg>
        </label>

        <a
          v-for="btn in navButtons"
          :key="btn.label"
          :href="btn.link"
          target="_blank"
          rel="noopener"
          class="tw:btn tw:btn-sm tw:ml-2"
          :class="`tw:btn-${btn.style}`"
        >
          {{ btn.label }}
        </a>

        <NuxtLink v-if="isLoggedIn" to="/todos" class="tw:btn tw:btn-sm tw:btn-primary tw:ml-2">
          <Icon icon="mdi:clipboard-check-outline" class="tw:w-4 tw:h-4" />
          Dashboard
        </NuxtLink>
        <template v-else>
          <NuxtLink to="/login" class="tw:btn tw:btn-sm tw:btn-success tw:ml-2"> Login </NuxtLink>
          <NuxtLink to="/register" class="tw:btn tw:btn-sm tw:btn-outline tw:btn-primary tw:ml-2">
            Register
          </NuxtLink>
        </template>
      </div>

      <!-- Hamburger -->
      <button
        class="tw:p-2 tw:rounded-md hover:tw:bg-base-200 tw:transition-colors tw:md:hidden"
        @click="toggleNavbar"
      >
        <Icon
          :icon="showMenu ? 'mdi:close' : 'mdi:menu'"
          class="tw:w-6 tw:h-6 tw:text-base-content"
        />
      </button>
    </nav>

    <!-- Mobile Menu -->
    <div
      class="tw:overflow-hidden tw:transition-all tw:duration-300 tw:ease-in-out tw:mx-auto tw:mt-1 tw:rounded-lg tw:bg-base-200 tw:shadow-md md:tw:hidden"
      :style="{ maxHeight: showMenu ? '500px' : '0px' }"
    >
      <div class="tw:p-3">
        <ul class="tw:flex tw:flex-col tw:gap-2">
          <li v-for="btn in navButtons" :key="btn.label">
            <a
              :href="btn.link"
              target="_blank"
              rel="noopener"
              class="tw:block tw:px-4 tw:py-2 tw:rounded-md tw:transition-colors hover:tw:bg-base-300"
            >
              {{ btn.label }}
            </a>
          </li>
          <li v-if="isLoggedIn">
            <NuxtLink
              to="/todos"
              class="tw:block tw:px-4 tw:py-2 tw:bg-primary tw:text-white tw:rounded-md"
            >
              Dashboard
            </NuxtLink>
          </li>
          <template v-else>
            <li>
              <NuxtLink
                to="/login"
                class="tw:block tw:px-4 tw:py-2 tw:bg-success tw:text-white tw:rounded-md"
              >
                Login
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/register"
                class="tw:block tw:px-4 tw:py-2 tw:bg-primary/10 tw:text-primary tw:rounded-md"
              >
                Register
              </NuxtLink>
            </li>
          </template>
          <li>
            <button
              class="tw:flex tw:items-center tw:gap-2 tw:w-full tw:text-left tw:px-4 tw:py-2 tw:rounded-md hover:tw:bg-base-300"
            >
              <label class="tw:toggle tw:text-base-content">
                <input
                  type="checkbox"
                  :checked="isDark"
                  value="dark"
                  class="theme-controller"
                  @change="onThemeChange"
                />
                <svg aria-label="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </g>
                </svg>
                <svg aria-label="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                  </g>
                </svg>
              </label>
              Toggle Theme
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
