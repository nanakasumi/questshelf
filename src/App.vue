<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/TheNavbar.vue'

</script>

<template>
  <div class="app">
    <Navbar />

    <RouterView />
  </div>
</template>

<style scoped>
#app {
  /* min-height: 100vh; */
}

.app {
  /* min-height: 100vh; */
}
</style>
