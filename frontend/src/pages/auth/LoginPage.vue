<template>
  <div class="w-full h-screen flex flex-col justify-center items-center gap-4">
    <form @submit.prevent class="w-full flex flex-col justify-center items-center gap-4">
      <BaseInput
        class="w-full"
        label="이메일"
        type="email"
        v-model="form.email"
        :arrayRule="emailRequiredRule"
        :backendError="backendError"
        id="email" />
      <BaseInput 
        class="w-full"
        label="비밀번호"
        type="password"
        v-model="form.password"
        :arrayRule="passwordRule"
        :backendError="backendError"
        id="password" />
    </form>
    <div class="w-full flex flex-col gap-3">
      <BaseButton label="로그인" @click.prevent="onSubmit" :disabled="!checkLoginValidation" :class="{'button-disabled-base' : !checkLoginValidation}"></BaseButton>
      <BaseButton label="비밀번호 재설정" @click.prevent="resetPassword"></BaseButton>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
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

  const backendError = ref(false);

  const onSubmit = async () => {
    try{
      return await auth.login(form.value)
    } catch(error){
      backendError.value = true;
      return error;
    }
  }

  const resetPassword = () => {
    router.push('/auth/reset-password')
  }

  const checkLoginValidation = computed(() => {
    const emailValid = checkRule(emailRequiredRule, form.value.email);
    const passwordValid = checkRule(passwordRule, form.value.password)
    return emailValid.valid && passwordValid.valid
  })

  
</script>

<style lang="postcss" scoped>

</style>