<template>
  <q-toolbar
    class="justify-center"
    @drop="onDrop($event)"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="col col-auto" :class="{ 'q-pr-xs': appsOnBarItems.length > 0 }">
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
                <q-btn flat no-caps @click="onMenuAppClick(app)">
                  <q-img :src="app.icon" height="48px" width="48px" />
                  <div class="text-weight-light">{{ app.name }}</div>
                </q-btn>
              </div>
            </div>
          </q-scroll-area>
        </q-card>
      </q-slide-transition>
    </div>
    <div
      class="col-auto q-pl-xs"
      v-for="(item, index) in appsOnBarItems"
      :key="item.app.id"
    >
      <q-btn
        flat
        padding="sm"
        class="app-on-bar"
        @click="launchApp(item.app)"
        @mousedown="onAppBarItemMouseDown($event, index)"
      >
        <q-img :src="item.app.icon" height="32px" width="32px" />
        <div class="row app-on-bar__instances">
          <div
            class="col-auto app-on-bar__instances__item"
            v-for="index in item.runningInstancesCount"
            :key="`${item.app.id}_${index}`"
          ></div>
        </div>

        <q-menu
          :model-value="appOnBarIndexMenuVisible === index"
          no-parent-event
          anchor="top middle"
          self="bottom middle"
          :offset="[0, 10]"
          class="app-on-bar__menu"
          @hide="resetAppOnBarIndexMenuVisible()"
        >
          <q-list dense style="min-width: 100px">
            <q-item-label
              v-if="item.runningInstances.length > 0"
              header
              class="app-on-bar__menu__activities__title"
            >
              Activities
            </q-item-label>
            <q-item
              v-for="process in item.runningInstances"
              :key="process.id"
              clickable
              v-close-popup
            >
              <q-item-section> {{ process.application.name }} </q-item-section>
            </q-item>
            <q-separator v-if="item.runningInstances.length > 0" />
            <q-item clickable v-close-popup @click="launchApp(item.app)">
              <q-item-section> Launch {{ item.app.name }} </q-item-section>
            </q-item>
            <q-item clickable @click="removeAppOnBarAtIndex(index)">
              <q-item-section>Remove from applications bar</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </q-toolbar>
</template>

<script lang="ts">
import { Application } from 'src/models/app/Application';
import { Process } from 'src/models/processes/Process';
import { useApps } from 'src/store/app';
import { useDesktop } from 'src/store/desktop';
import { useProcesses } from 'src/store/processes';
import { computed, defineComponent, ref } from 'vue';

interface AppOnBarItem {
  app: Application;
  runningInstancesCount: number;
  runningInstances: Process[];
}

export default defineComponent({
  name: 'AppBar',
  setup() {
    const appsStore = useApps();
    const desktopStore = useDesktop();
    const processesStore = useProcesses();

    const isMenuVisible = ref(false);
    const ungroupedApps = computed(() =>
      appsStore.getters.apps.filter((app) => !app.groupId)
    );

    const appsOnBarItems = computed(() => {
      let appsOnBarItems: AppOnBarItem[] = [];

      // Add apps already on bar
      appsOnBarItems.push(
        ...(desktopStore.getters.appsOnBar
          .filter((appId) =>
            appsStore.getters.apps.find((app) => app.id === appId)
          )
          .map((appId) => ({
            app: appsStore.getters.apps.find((app) => app.id === appId),
            runningInstancesCount: Math.min(
              processesStore.getters.runningAppInstances(appId).length,
              3
            ),
            runningInstances: processesStore.getters.runningAppInstances(appId),
          })) as AppOnBarItem[])
      );

      // Add running apps not on bar
      const runningAppsMap: Map<string, AppOnBarItem> = new Map();

      processesStore.getters.processes
        // Remove the processes that are associated with an app
        // already on bar
        .filter(
          (process) =>
            !desktopStore.getters.appsOnBar.some(
              (appId) => process.application.id === appId
            )
        )
        .forEach((process) => {
          if (process.application.id) {
            if (runningAppsMap.has(process.application.id)) {
              const appOnBarItem = runningAppsMap.get(process.application.id);

              if (appOnBarItem) {
                appOnBarItem.runningInstancesCount = Math.min(
                  ++appOnBarItem.runningInstancesCount,
                  3
                );
                appOnBarItem.runningInstances.push(process);
              }
            } else {
              runningAppsMap.set(process.application.id, {
                app: process.application,
                runningInstancesCount: 1,
                runningInstances: [process],
              });
            }
          }
        });

      appsOnBarItems.push(...Array.from(runningAppsMap.values()));

      return appsOnBarItems;
    });
    const appOnBarIndexMenuVisible = ref<number | undefined>(undefined);

    const resetAppOnBarIndexMenuVisible = () => {
      appOnBarIndexMenuVisible.value = undefined;
    };

    const launchApp = async (app: Application) => {
      const newProcessId: string =
        await (processesStore.actions.addAppAsProcess(app) as Promise<string>);
      desktopStore.mutations.setWindowOnEvidence(newProcessId);
    };

    return {
      isMenuVisible,
      toggleMenu() {
        isMenuVisible.value = !isMenuVisible.value;
      },
      ungroupedApps,
      appsOnBarItems,
      appOnBarIndexMenuVisible,
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

          if (!desktopStore.getters.appsOnBar.includes(appId)) {
            desktopStore.mutations.addAppToBar(appId);
          }
        }
      },
      launchApp,
      onAppBarItemMouseDown(event: MouseEvent, appBarItemIndex: number) {
        if (event.button === 2) {
          appOnBarIndexMenuVisible.value =
            appOnBarIndexMenuVisible.value === appBarItemIndex
              ? undefined
              : appBarItemIndex;
        }
      },
      resetAppOnBarIndexMenuVisible,
      removeAppOnBarAtIndex(appBarItemIndex: number) {
        desktopStore.mutations.removeAppFromBarAtIndex(appBarItemIndex);
        resetAppOnBarIndexMenuVisible();
      },
      async onMenuAppClick(app: Application) {
        await launchApp(app);
        isMenuVisible.value = false;
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

.app-on-bar {
  &__menu {
    &__activities {
      &__title {
        padding: 8px 16px;
      }
    }
  }

  &__instances {
    position: absolute;
    bottom: 8px;
    gap: 4px;

    &__item {
      width: 4px !important;
      height: 4px !important;
      border-radius: 4px;
      background-color: #ffffff;
      border: thin solid #888888;
    }
  }
}
</style>
