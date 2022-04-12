<template>
  <div id="windows-container">
    <process-window
      v-for="process in processes"
      :key="process.id"
      :process="process"
      :data-app-id="process.application.id"
      :data-x="lastAppWindowPositionByAppId(process.application.id).x"
      :data-y="lastAppWindowPositionByAppId(process.application.id).y"
      :style="{
        transform: `translate(${
          lastAppWindowPositionByAppId(process.application.id).x
        }px, ${lastAppWindowPositionByAppId(process.application.id).y}px)`,
        width: `${lastAppWindowSizeByAppId(process.application.id).width}px`,
        height: `${lastAppWindowSizeByAppId(process.application.id).height}px`,
      }"
    >
    </process-window>
  </div>
</template>

<script lang="ts">
import { InteractEvent, ResizeEvent } from '@interactjs/types';
import interact from 'interactjs';
import { useProcesses } from 'src/store/processes';
import { computed, defineComponent } from 'vue';
import ProcessWindow from 'src/components/system/windows/ProcessWindow.vue';
import { useDesktop } from 'src/store/desktop';
import { Position } from 'src/models/common/Position';
import { Size } from 'src/models/common/Size';

export default defineComponent({
  name: 'WindowsManager',
  components: { ProcessWindow },
  setup() {
    const processesStore = useProcesses();
    const desktopStore = useDesktop();

    const processes = computed(() => processesStore.getters.processes);

    const lastAppWindowPositionByAppId = (appId: string): Position => {
      return (
        desktopStore.getters.lastAppWindowPositionByAppId(appId) || {
          x: 0,
          y: 0,
        }
      );
    };

    const lastAppWindowSizeByAppId = (appId: string): Size => {
      return (
        desktopStore.getters.lastAppWindowSizeByAppId(appId) || {
          width: 300,
          height: 250,
        }
      );
    };

    const dragMoveListener = (event: InteractEvent) => {
      const target = event.target;
      // keep the dragged position in the data-x/data-y attributes
      const x = parseFloat(target.getAttribute('data-x') || '0') + event.dx;
      const y = parseFloat(target.getAttribute('data-y') || '0') + event.dy;
      target.style.transform = `translate(${x}px, ${y}px)`;
      // update the posiion attributes
      target.setAttribute('data-x', x.toString(10));
      target.setAttribute('data-y', y.toString(10));
      // update the desktop store
      desktopStore.mutations.setWindowPosition({
        appId: target.getAttribute('data-app-id') as string,
        newPosition: { x, y },
      });
    };

    const resizeListener = (event: ResizeEvent) => {
      const target = event.target;
      let x = parseFloat(target.getAttribute('data-x') || '0');
      let y = parseFloat(target.getAttribute('data-y') || '0');
      // update the element's style
      target.style.width = `${event.rect.width}px`;
      target.style.height = `${event.rect.height}px`;
      // translate when resizing from top or left edges
      x += event.deltaRect?.left || 0;
      y += event.deltaRect?.top || 0;
      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute('data-x', x.toString(10));
      target.setAttribute('data-y', y.toString(10));
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
    };

    return {
      processes,
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
