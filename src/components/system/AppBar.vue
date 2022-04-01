<template>
  <q-toolbar class="justify-center">
    <div class="col col-auto">
      <q-btn push color="primary" icon="memory" @click="toggleMenu()"> </q-btn>

      <q-slide-transition>
        <q-card v-show="isMenuVisible" id="apps-menu" class="bg-dark">
          <q-scroll-area style="height: 500px; width: 500px"> </q-scroll-area>
        </q-card>
      </q-slide-transition>
    </div>
  </q-toolbar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AppBar',
  setup() {
    const isMenuVisible = ref(false);
    return {
      isMenuVisible,
      toggleMenu() {
        isMenuVisible.value = !isMenuVisible.value;
      },
    };
  },
});
</script>

<style lang="scss">
#apps-menu {
  position: fixed !important;
  display: inline-block;
  background: rgb(255, 255, 255);
  border-radius: 4px;
  outline: 0px;
  z-index: 6000;
  height: 500px;
  width: 500px;
  max-width: 500px;
  visibility: visible;
  left: calc(50% - 250px);
  margin-top: var(--q-pe-top, 0) !important;
  margin-left: var(--q-pe-left, 0) !important;
  will-change: auto;
  bottom: 60px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
