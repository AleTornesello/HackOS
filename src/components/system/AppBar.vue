<template>
  <q-toolbar
    class="justify-center"
    @drop="onDrop($event)"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="col col-auto" :class="{ 'q-pr-xs': appsOnBar.length > 0 }">
      <q-btn
        push
        color="primary"
        icon="memory"
        @click="toggleMenu()"
        padding="sm"
      >
      </q-btn>

      <q-slide-transition>
        <q-card v-show="isMenuVisible" id="apps-menu" class="bg-dark">
          <q-scroll-area style="height: 500px; width: 500px">
            <div class="row q-ma-sm">
              <div
                class="col col-3"
                v-for="app in ungroupedApps"
                :key="app.id"
                draggable="true"
                @dragstart="onDragStart($event, app)"
              >
                <q-btn flat>
                  <q-img :src="app.icon" height="48px" width="48px" />
                  <div class="text-weight-light">{{ app.name }}</div>
                </q-btn>
              </div>
            </div>
          </q-scroll-area>
        </q-card>
      </q-slide-transition>
    </div>
    <div class="col-auto q-pl-xs" v-for="app in appsOnBar" :key="app.id">
      <q-btn flat @click="launchApp(app)" padding="sm">
        <q-img :src="app.icon" height="32px" width="32px" />
      </q-btn>
    </div>
  </q-toolbar>
</template>

<script lang="ts">
import { Application } from 'src/models/app/Application';
import { useApps } from 'src/store/app';
import { useDesktop } from 'src/store/desktop';
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AppBar',
  setup() {
    const appsStore = useApps();
    const desktopStore = useDesktop();

    const isMenuVisible = ref(false);
    const ungroupedApps = computed(() =>
      appsStore.getters.apps.filter((app) => !app.groupId)
    );
    const appsOnBar = computed(
      () =>
        desktopStore.getters.appsOnBar.map((appId) =>
          appsStore.getters.apps.find((app) => app.id === appId)
        ) as Application[]
    );

    return {
      isMenuVisible,
      toggleMenu() {
        isMenuVisible.value = !isMenuVisible.value;
      },
      ungroupedApps,
      appsOnBar,
      onDragStart(event: DragEvent, app: Application) {
        if (event.dataTransfer && app.id) {
          event.dataTransfer.dropEffect = 'move';
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('appId', app.id);
        }
      },
      onDrop(event: DragEvent) {
        if (event.dataTransfer) {
          const appId = event.dataTransfer.getData('appId');
          desktopStore.mutations.addAppToBar(appId);
        }
      },
      launchApp(app: Application) {
        // TODO: Launch app
      },
    };
  },
});
</script>

<style lang="scss">
#apps-menu {
  position: fixed !important;
  display: inline-block;
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
