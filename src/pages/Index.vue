<template>
  <q-page id="desktop" class=""> </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Desktop',
});
</script>

<style lang="scss">
#desktop {
  background-image: url('/wallpaper.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
