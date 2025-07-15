<template>
  <div>
    <button @click.prevent="auth.logout()">로그아웃</button>
      <RouterView></RouterView>
  </div>
</template>

<script setup>
  import {onMounted} from 'vue';
  import { useAuthStore } from '../stores/auth';

  const auth = useAuthStore();

//   onMounted(() => {
//     getUsers();
//   })

//   const getUsers = async () => {
//     await auth.fetchUser();
//   }
// </script>

<style lang="scss" scoped>

</style>