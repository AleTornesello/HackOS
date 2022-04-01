<template>
  <q-layout view="lHh Lpr lFf">
    <q-footer elevated class="bg-dark">
      <app-bar></app-bar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppBar from 'src/components/system/AppBar.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { AppBar },
});
</script>
