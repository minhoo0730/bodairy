<template>
  <div class="fixed flex flex-col justify-center items-center bottom-32 left-0 w-full z-[999]">
    <div id="toastContainer" v-if="toasts.length" class="">
      <BaseToast
        v-for="t in toasts"
        :key="t.id"
        :id="t.id"
        :message="t.message"
        :type="t.type"
      />
    </div>
  </div>
</template>

<script setup>
  import { toasts, useToast } from '@/composables/useToast';
  import BaseToast from '@/components/base/BaseToast.vue';

  // const toast = useToast();
</script>

<style lang="postcss" scoped>

</style>