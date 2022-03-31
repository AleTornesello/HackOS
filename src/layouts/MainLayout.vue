<template>
  <q-layout view="lHh Lpr lFf">
    <q-footer elevated class="bg-dark">
      <q-toolbar> </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',
});
</script>
