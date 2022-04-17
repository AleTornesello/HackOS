<template>
  <q-page id="desktop">
    <div
      id="desktop__apps"
      class="column q-pa-md"
      style="min-height: inherit; height: 600px"
    >
      <div
        id="desktop__apps__app"
        v-for="app in appsOnDesktop"
        :key="app.id"
        class="col-auto"
      >
        <q-btn flat no-caps @click="launchApp(app)">
          <div class="column items-center">
            <q-img :src="app.icon" height="48px" width="48px" />
            <div class="text-weight-light">{{ app.name }}</div>
          </div>

          <q-menu touch-position context-menu>
            <q-list dense>
              <q-item clickable v-close-popup @click="launchApp(app)">
                <div class="row items-center">
                  <q-icon :name="`img:${app.icon}`" size="xs" left />
                  <q-item-section>Launch {{ app.name }}</q-item-section>
                </div>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>

    <windows-manger></windows-manger>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useDesktop } from 'src/store/desktop';
import { useApps } from 'src/store/app';
import { Application } from 'src/models/app/Application';
import WindowsManger from 'src/components/system/windows/WindowsManger.vue';
import { useProcesses } from 'src/store/processes';

export default defineComponent({
  name: 'Desktop',
  components: { WindowsManger },
  setup() {
    const desktopStore = useDesktop();
    const appsStore = useApps();
    const processesStore = useProcesses();

    const appIdsOnDesktop = computed(() => desktopStore.getters.apps);
    const appsOnDesktop = computed(
      () =>
        appIdsOnDesktop.value.map((appId) =>
          appsStore.getters.apps.find((app) => app.id === appId)
        ) as Application[]
    );

    const launchApp = async (app: Application) => {
      const newProcessId: string =
        await (processesStore.actions.addAppAsProcess(app) as Promise<string>);
      desktopStore.mutations.setWindowOnEvidence(newProcessId);
    };

    return {
      appsOnDesktop,
      launchApp,
    };
  },
  created() {
    document.oncontextmenu = function (event) {
      if (event.preventDefault !== undefined) event.preventDefault();
      if (event.stopPropagation !== undefined) event.stopPropagation();
    };
  },
});
</script>

<style lang="scss">
#desktop {
  background-image: url('/wallpaper.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;

  &__apps {
    gap: 16px;
    align-content: flex-start;

    &__app {
      width: fit-content;
    }
  }

  .process-window {
    position: absolute;
    min-width: 300px;
    min-height: 200px;
  }
}
</style>
