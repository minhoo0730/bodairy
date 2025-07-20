<template>
  <div class="w-full h-screen flex flex-col justify-center items-center gap-4">
    <form @submit.prevent class="w-full flex flex-col justify-center items-center gap-4">
      <BaseInput 
        class="w-full"
        label="이메일"
        type="email"
        v-model="form.email"
        :arrayRule="emailRequiredRule"
        id="email" />
      <BaseInput 
        class="w-full"
        label="비밀번호"
        type="password"
        v-model="form.password"
        :arrayRule="passwordRule"
        id="password" />
    </form>
    <div class="w-full flex flex-col gap-3">
      <BaseButton label="로그인" @click.prevent="onSubmit" :disabled="!checkRule(emailRequiredRule, form.email)"></BaseButton>
      <BaseButton label="비밀번호 재설정" @click.prevent="resetPassword"></BaseButton>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  import {emailRequiredRule, passwordRule, checkRule } from '@/composables/validationRules';
  import BaseInput from '@/components/BaseInput.vue';
  import BaseButton from '@/components/BaseButton.vue';

  const router = useRouter();
  const auth = useAuthStore();
  const form = ref({
    email:'',
    password:'',
  })

  const onSubmit = async () => {
    try{
      return await auth.login(form.value)
    } catch(error){
      return;
    }
  }

  const resetPassword = () => {
    router.push('/auth/reset-password')
  }

// const validityCheckRule = (rules, value) => {
//   const result = checkRule(rules, value);
// }

  
</script>

<style lang="postcss" scoped>

</style>