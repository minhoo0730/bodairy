<template>
  <div class=" dark:bg-gray-900">
    <div class="flex flex-col min-h-screen w-full max-w-[1024px] m-auto  focus:ring-2">
    <TheHeader></TheHeader>
    <main class="flex-1 relative">
      <RouterView></RouterView>
      <div class="fixed right-12 bottom-32 flex flex-col justify-center items-center">
          <p class="text-[1.4rem] bg-blue-600 text-white mb-4 rounded-full px-4">오운완!</p>
        <BaseButton class="!rounded-full !px-4 w-[50px] h-[50px] flex justify-center items-center">
          <BaseIcon :icon="PencilIcon" size="xxs" color="white"/>
        </BaseButton>
      </div>
    </main>
    <TheFooter></TheFooter>
    </div>
  </div>
</template>

<script setup>
  import {onMounted} from 'vue';
  import TheHeader from '@/layout/TheHeader.vue';
  import TheFooter from '@/layout/TheFooter.vue';
  import { useAuthStore } from '../stores/auth';
  import BaseIcon from '@/components/base/BaseIcon.vue';
import { PencilIcon } from '@heroicons/vue/24/outline'
import BaseButton from '@/components/base/BaseButton.vue';

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