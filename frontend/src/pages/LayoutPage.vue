<template>
  <div class=" dark:bg-gray-900 focus:ring-2">
    <div class="h-screen w-full px-8 max-w-[1024px] m-auto">
      <TheHeader></TheHeader>
      <RouterView></RouterView>
      <TheFooter></TheFooter>
      </div>
  </div>
</template>

<script setup>
  import TheHeader from '@/layout/TheHeader.vue';
  import TheFooter from '@/layout/TheFooter.vue';
  import {onMounted} from 'vue';
  import { useAuthStore } from '../stores/auth';

  const auth = useAuthStore();
//   onMounted(() => {
//     getUsers();
//   })

//   const getUsers = async () => {
//     await auth.fetchUser();
//   }
</script>

<style lang="postcss" scoped>

</style>