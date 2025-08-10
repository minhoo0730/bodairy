<template>
  <header class="w-full">
    <div class="flex justify-between items-center">
      <div>내몸일기</div>
      <div class="flex justify-center items-center gap-4">
        <p class="whitespace-nowrap">{{user?.name}}</p>
        <BaseButton @click.prevent="auth.logout()" label="로그아웃" />
      </div>
    </div>
  </header>
</template>

<script setup>
    import { storeToRefs } from 'pinia'
    import { useAuthStore } from '../stores/auth';
    import BaseButton from '@/components/BaseButton.vue';
    const { user } = storeToRefs(useAuthStore())
</script>

<style lang="postcss" scoped>

</style>