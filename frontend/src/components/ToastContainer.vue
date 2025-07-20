<template>
  <div class="fixed flex flex-col justify-center items-center bottom-16 left-0 w-full">
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
  import BaseToast from '@/components/BaseToast.vue';

  // const toast = useToast();
</script>

<style lang="scss" scoped>

</style>