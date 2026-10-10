<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <NavbarComp />
    <main class="flex-1">
      <slot />
    </main>
    <FooterComp />
  </div>
</template>
