<template>
  <div id="windows-container">
    <process-window
      v-for="window in windows"
      :key="window.process.id"
      :process="window.process"
      :data-process-id="window.process.id"
      :data-app-id="window.process.application.id"
      :data-x="window.position.x"
      :data-y="window.position.y"
      :style="{
        transform: `translate(${window.position.x}px, ${window.position.y}px)`,
        width: `${window.size.width}px`,
        height: `${window.size.height}px`,
      }"
    >
    </process-window>
  </div>
</template>

<script lang="ts">
import { InteractEvent, ResizeEvent } from '@interactjs/types';
import interact from 'interactjs';
import { useProcesses } from 'src/store/processes';
import { computed, defineComponent, ref, watch } from 'vue';
import ProcessWindow from 'src/components/system/windows/ProcessWindow.vue';
import { useDesktop } from 'src/store/desktop';
import { Position } from 'src/models/common/Position';
import { Size } from 'src/models/common/Size';
import { Process } from 'src/models/processes/Process';

interface WindowItem {
  process: Process;
  position: Position;
  size: Size;
}

export default defineComponent({
  name: 'WindowsManager',
  components: { ProcessWindow },
  setup() {
    const processesStore = useProcesses();
    const desktopStore = useDesktop();

    const processes = computed(() => processesStore.getters.processes);

    const windows = ref<WindowItem[]>([]);

    const lastAppWindowPositionByAppId = (appId: string): Position => {
      const position: Position | undefined =
        desktopStore.getters.lastAppWindowPositionByAppId(appId);
      return {
        x: position ? position.x : 0,
        y: position ? position.y : 0,
      };
    };

    const lastAppWindowSizeByAppId = (appId: string): Size => {
      return (
        desktopStore.getters.lastAppWindowSizeByAppId(appId) || {
          width: 300,
          height: 250,
        }
      );
    };

    watch(
      () => processes,
      (newProcesses) => {
        // Remove old windows
        windows.value = windows.value.filter((window) =>
          newProcesses.value.find((process) => process.id === window.process.id)
        );

        // Add new windows
        newProcesses.value.forEach((process) => {
          if (
            !windows.value.find((window) => window.process.id === process.id)
          ) {
            const position: Position = {
              x:
                process.application && process.application.id
                  ? lastAppWindowPositionByAppId(process.application.id).x + 30
                  : 20,
              y:
                process.application && process.application.id
                  ? lastAppWindowPositionByAppId(process.application.id).y + 30
                  : 20,
            };

            const size: Size = {
              width:
                process.application && process.application.id
                  ? lastAppWindowSizeByAppId(process.application.id).width
                  : 300,
              height:
                process.application && process.application.id
                  ? lastAppWindowSizeByAppId(process.application.id).height
                  : 200,
            };

            windows.value.push({
              process,
              position,
              size,
            });

            desktopStore.mutations.setWindowPosition({
              appId: process.application.id as string,
              newPosition: position,
            });
          }
        });
      },
      { immediate: true, deep: true }
    );

    const dragMoveListener = (event: InteractEvent) => {
      const target = event.target;
      // keep the dragged position in the data-x/data-y attributes
      const x = parseFloat(target.getAttribute('data-x') || '0') + event.dx;
      const y = parseFloat(target.getAttribute('data-y') || '0') + event.dy;
      const processId = target.getAttribute('data-process-id');

      if (processId) {
        const processWindow = windows.value.find(
          (window) => window.process.id === processId
        );

        if (processWindow) {
          processWindow.position.x = x;
          processWindow.position.y = y;
        }

        desktopStore.mutations.setWindowPosition({
          appId: target.getAttribute('data-app-id') as string,
          newPosition: { x, y },
        });
      }
    };

    const resizeListener = (event: ResizeEvent) => {
      const target = event.target;
      let x = parseFloat(target.getAttribute('data-x') || '0');
      let y = parseFloat(target.getAttribute('data-y') || '0');
      // translate when resizing from top or left edges
      x += event.deltaRect?.left || 0;
      y += event.deltaRect?.top || 0;

      const processId = target.getAttribute('data-process-id');

      if (processId) {
        const processWindow = windows.value.find(
          (window) => window.process.id === processId
        );

        if (processWindow) {
          processWindow.position.x = x;
          processWindow.position.y = y;
          processWindow.size.width = event.rect.width;
          processWindow.size.height = event.rect.height;
        }

        desktopStore.mutations.setWindowPosition({
          appId: target.getAttribute('data-app-id') as string,
          newPosition: { x, y },
        });
        desktopStore.mutations.setWindowSize({
          appId: target.getAttribute('data-app-id') as string,
          newSize: {
            width: event.rect.width,
            height: event.rect.height,
          },
        });
      }
    };

    return {
      processes,
      windows,
      lastAppWindowPositionByAppId,
      lastAppWindowSizeByAppId,
      dragMoveListener,
      resizeListener,
    };
  },
  mounted() {
    interact('.process-window')
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move: this.resizeListener,
        },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: 'parent',
          }),
          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 300, height: 200 },
          }),
        ],
        inertia: false,
      })
      .draggable({
        listeners: {
          move: this.dragMoveListener,
        },
        allowFrom: '.process-window__bar',
        inertia: false,
        modifiers: [
          interact.modifiers.restrictRect({
            endOnly: true,
          }),
        ],
      });
  },
});
</script>

<style lang="scss">
#windows-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: none !important;
  pointer-events: none;
}
</style>
