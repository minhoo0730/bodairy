<template>
  <div class=" dark:bg-gray-900 focus:ring-2">
    <div class="h-screen w-full px-8 max-w-3xl m-auto">
      <BaseButton @click.prevent="auth.logout()" label="로그아웃" />
      <RouterView></RouterView>
      </div>
  </div>
</template>

<script setup>
  import {onMounted} from 'vue';
  import { useAuthStore } from '../stores/auth';
  import BaseButton from '@/components/BaseButton.vue';

  const auth = useAuthStore();

//   onMounted(() => {
//     getUsers();
//   })

//   const getUsers = async () => {
//     await auth.fetchUser();
//   }
// </script>

<style lang="postcss" scoped>

</style>