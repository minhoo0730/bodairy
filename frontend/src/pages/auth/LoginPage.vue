<template>
  <div class="w-full h-screen flex flex-col justify-center items-center gap-8">
    <form class="w-full flex flex-col justify-center items-center gap-6"  @submit.prevent @keyup.enter="onSubmit">
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
    <div class="w-full flex flex-col gap-4">
      <BaseButton label="로그인" @click.prevent="onSubmit" :disabled="!checkLoginValidation" :class="{'button-disabled-base' : !checkLoginValidation}"></BaseButton>
    </div>
    <div class="flex justify-center link-pipe">
      <BaseLinkButton to="/auth/find-email">이메일 찾기</BaseLinkButton>
      <BaseLinkButton to="/auth/reset-password">비밀번호 재설정</BaseLinkButton>
      <BaseLinkButton to="/auth/register">회원가입</BaseLinkButton>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  import {emailRequiredRule, passwordRule, checkRule } from '@/composables/validationRules';
  import BaseInput from '@/components/base/BaseInput.vue';
  import BaseButton from '@/components/base/BaseButton.vue';
  import BaseLinkButton from '@/components/base/BaseLinkButton.vue';

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

  const checkLoginValidation = computed(() => {
    const emailValid = checkRule(emailRequiredRule, form.value.email);
    const passwordValid = checkRule(passwordRule, form.value.password)
    return emailValid.valid && passwordValid.valid
  })

  
</script>

<style lang="postcss" scoped>

</style>