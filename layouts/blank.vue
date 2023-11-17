<script setup lang="ts">
import { RouterView } from "vue-router";

const title = ref("Mold management");

useHead({
  meta: [{ content: title }],
  titleTemplate: () => {
    return "Mold management login";
  },
});
</script>
<template>
  <v-app>
    <RouterView />
  </v-app>
</template>
