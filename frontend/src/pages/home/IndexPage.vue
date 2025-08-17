<template>
  <div class="p-8">
    <div class="flex flex-col justify-center items-center">
      <div class="inline-flex rounded-md shadow-xs flex w-full" role="group">
        <BaseLinkButton to="/home/workout-summary" class="button-group text-center">
          운동요약
        </BaseLinkButton>
        <BaseLinkButton to="/home/workout-chart" class="button-group text-center">
          목표달성률
        </BaseLinkButton>
      </div>
      <div class="w-full flex justify-start">
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseLinkButton from '@/components/base/BaseLinkButton.vue';
import { RouterView } from 'vue-router';


</script>

<style lang="scss" scoped></style>