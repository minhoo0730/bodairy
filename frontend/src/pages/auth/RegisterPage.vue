<template>
  <div class="w-full h-screen flex flex-col justify-center items-center gap-8">
    <form class="w-full flex flex-col justify-center items-center gap-6"  @submit.prevent @keyup.enter="onSubmit">
      <BaseInput
        class="w-full"
        label="이름"
        type="text"
        v-model="form.name"
        :arrayRule="nameRequiredRule"
        :backendError="backendError"
        id="name" />
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
        label="휴대전화번호"
        type="text"
        v-model="form.phone"
        :arrayRule="phoneRule"
        :backendError="backendError"
        id="pahone" />
      <BaseInput 
        class="w-full"
        label="비밀번호"
        type="password"
        v-model="form.password"
        :arrayRule="passwordRule"
        :backendError="backendError"
        id="password" />
      <BaseInput 
        class="w-full"
        label="비밀번호 확인"
        type="password"
        v-model="form.passwordConfirm"
        :arrayRule="confirmPasswordRule(form.password)"
        :backendError="backendError"
        id="passwordConfirm" />
    </form>

    <div class="w-full flex flex-col gap-4">
      <BaseButton label="회원가입" @click.prevent="onSubmit" :disabled="!checkLoginValidation" :class="{'button-disabled-base' : !checkLoginValidation}"></BaseButton>
    </div>
    <div class="flex justify-center">
      <BaseLinkButton to="/auth">로그인 페이지 이동</BaseLinkButton>
    </div>

  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import api from '@/api/auth';
  import { useRouter } from 'vue-router';
  import { nameRequiredRule, emailRequiredRule, passwordRule, phoneRule, confirmPasswordRule, checkRule } from '@/composables/validationRules';
  import { useToast } from '@/composables/useToast';
  import BaseInput from '@/components/BaseInput.vue';
  import BaseButton from '@/components/BaseButton.vue';
  import BaseLinkButton from '@/components/BaseLinkButton.vue';

  const { show } = useToast();
  const doSomething = (message, type) => {
    show(message, type)
  }

  const router = useRouter();
  const form = ref({
    name:'',
    email:'',
    phone:'',
    password:'',
    passwordConfirm:'',
  })

  const backendError = ref(false);

  const onSubmit = async () => {
    const user = {
      name:form.value.name,
      email:form.value.email,
      phone:form.value.phone,
      password:form.value.password,
    }
    try{
      const { data } = await api.register(user);
      await router.push('/auth/login')
      backendError.value = false
      doSomething(data.message, 'success')
    } catch(error){
      backendError.value = true;
      return error;
    }
  }

  const checkLoginValidation = computed(() => {
    const nameValid = checkRule(nameRequiredRule, form.value.name);
    const emailValid = checkRule(emailRequiredRule, form.value.email);
    const phoneValid = checkRule(phoneRule, form.value.phone);
    const passwordValid = checkRule(passwordRule, form.value.password);
    const confirmPasswordValid = checkPasswordRule.value;
    return emailValid.valid && passwordValid.valid && nameValid && phoneValid && confirmPasswordValid;
  })

  const checkPasswordRule = computed(() => {
    const passwordValid = checkRule(passwordRule, form.value.password);
    const confirmPasswordValid = checkRule(confirmPasswordRule(form.value.password), form.value.passwordConfirm);
    return passwordValid.valid && confirmPasswordValid.valid;
  })

</script>

<style lang="postcss" scoped>

</style>