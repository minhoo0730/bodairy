<template>
  <header class="w-full">
    <div class="flex justify-between items-center py-4 px-8">
      <div>내몸일기</div>
      <div class="flex justify-center items-center gap-4 relative">
        <button class="flex justify-center items-center gap-4">
          <!-- <span class="whitespace-nowrap">{{user?.name}}</span> -->
          <BaseIcon :icon="UserCircleIcon" size="sm" color="gray" :aria-label="user?.name" @click.prevent="toggleUser"/>
        </button>

        <!-- Dropdown menu -->
        <BaseList v-if="userListView" class="absolute top-16 right-0">
          <BaseListButton label="로그아웃" @click.prevent="auth.logout()" />
        </BaseList>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '../stores/auth';
  import { UserCircleIcon } from '@heroicons/vue/24/outline'
  import BaseIcon from '@/components/base/BaseIcon.vue'
  import BaseList from '@/components/base/BaseList.vue';
  import BaseListButton from '@/components/base/BaseListButton.vue';

  const { user } = storeToRefs(useAuthStore())
  const auth = useAuthStore();
  const userListView = ref(false)

  const toggleUser = () => {
    userListView.value = !userListView.value
  }
</script>

<style lang="postcss" scoped>

</style>