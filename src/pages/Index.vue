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
        <q-btn flat no-caps>
          <div class="column items-center">
            <q-img :src="app.icon" height="48px" width="48px" />
            <div class="text-weight-light">{{ app.name }}</div>
          </div>
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useDesktop } from 'src/store/desktop';
import { useApps } from 'src/store/app';
import { Application } from 'src/models/app/Application';

export default defineComponent({
  name: 'Desktop',
  setup() {
    const desktopStore = useDesktop();
    const appsStore = useApps();

    const appIdsOnDesktop = computed(() => desktopStore.getters.apps);
    const appsOnDesktop = computed(
      () =>
        appIdsOnDesktop.value.map((appId) =>
          appsStore.getters.apps.find((app) => app.id === appId)
        ) as Application[]
    );

    return {
      appsOnDesktop,
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
}
</style>
