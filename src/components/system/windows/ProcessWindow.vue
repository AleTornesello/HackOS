<template>
  <q-card class="process-window shadow-2">
    <q-bar class="bg-primary text-white process-window__bar">
      <q-img :src="process.application.icon" height="24px" width="24px" />
      <div class="process-window__bar__title">
        {{ process.application.name }}
      </div>
      <q-space />
      <!-- <q-btn dense flat icon="minimize" />
      <q-btn dense flat icon="crop_square" /> -->
      <q-btn dense flat icon="close" />
    </q-bar>
  </q-card>
</template>

<script lang="ts">
import { Process } from 'src/models/processes/Process';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ProcessWindow',
  props: {
    process: {
      type: Object as PropType<Process>,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.process-window {
  &__bar {
    border-radius: 4px 4px 0 0 !important;

    &__title {
      font-size: 16px;
      font-weight: 500;
      line-height: 16px;
    }
  }
}
</style>
