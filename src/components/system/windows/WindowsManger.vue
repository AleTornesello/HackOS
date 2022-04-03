<template>
  <div id="windows-container">
    <process-window
      v-for="process in processes"
      :key="process.id"
      :process="process"
    >
      aaaa
    </process-window>
  </div>
</template>

<script lang="ts">
import { InteractEvent, ResizeEvent } from '@interactjs/types';
import interact from 'interactjs';
import { useProcesses } from 'src/store/processes';
import { computed, defineComponent } from 'vue';
import ProcessWindow from 'src/components/system/windows/ProcessWindow.vue';

export default defineComponent({
  name: 'WindowsManager',
  components: { ProcessWindow },
  setup() {
    const processesStore = useProcesses();
    const processes = computed(() => processesStore.getters.processes);
    const dragMoveListener = (event: InteractEvent) => {
      const target = event.target;
      // keep the dragged position in the data-x/data-y attributes
      const x = parseFloat(target.getAttribute('data-x') || '0') + event.dx;
      const y = parseFloat(target.getAttribute('data-y') || '0') + event.dy;
      target.style.transform = `translate(${x}px, ${y}px)`;
      // update the posiion attributes
      target.setAttribute('data-x', x.toString(10));
      target.setAttribute('data-y', y.toString(10));
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
    };
    return {
      processes,
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
            min: { width: 200, height: 150 },
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
}
</style>
