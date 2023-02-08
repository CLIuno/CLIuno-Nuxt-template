<template>
  <div class="overflow-hidden bg-white rounded shadow-md text-slate-500 shadow-slate-200">
    <div class="p-6">
      <h3 class="mb-4 text-xl font-medium text-slate-700">Something to remember</h3>
      <p>
        All components can be copied and pasted and easily implemented in your
        tailwind css projects. You can choose which language you want to copy
        the desired component and just hover and click on the component you need
        and paste it on your project.
        <button @click="increment"
          class="btn btn-outline btn-error">
          <span class="relative overflow-hidden cursor-pointer group hover:overflow-visible focus-visible:outline-none"
            aria-describedby="tooltip-01">
            Count is: {{ count }}
          </span>
        </button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  // Properties returned from data() become reactive state
  // and will be exposed on `this`.
  data() {
    return {
      count: 0
    }
  },

  // Methods are functions that mutate state and trigger updates.
  // They can be bound as event listeners in templates.
  methods: {
    increment() {
      this.count++
    }
  },

  // Lifecycle hooks are called at different stages
  // of a component's lifecycle.
  // This function will be called when the component is mounted.
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<style scoped>
button {
  font-weight: bold;
}
</style>
