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
      <div class="w-full flex flex-col justify-start">
        <div class="mt-8">
          <BaseLinkButton class="!rounded-2xl !px-4 w-full flex justify-center items-center" to="/workouts/new">
            오늘의 운동을 입력하세요!
          </BaseLinkButton>
        </div>
        <RouterView/>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseLinkButton from '@/components/base/BaseLinkButton.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import { RouterView } from 'vue-router';


</script>

<style lang="scss" scoped></style>