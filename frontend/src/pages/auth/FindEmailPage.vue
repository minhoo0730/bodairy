<template>
  <div class="w-full h-screen flex flex-col justify-center items-center gap-8">
    <form class="w-full flex flex-col justify-center items-center gap-6"  @submit.prevent @keyup.enter="onSubmits">
      <div class="w-full flex flex-col gap-3">
        <div class="w-full flex gap-3">
          <BaseInput
            class="w-full"
            label="이름"
            type="name"
            v-model="form.email"
            :arrayRule="nameRequiredRule"
            :backendError="backendError"
            id="name" />
          <BaseButton label="이메일 찾기" @click.prevent="onSubmit" class="w-4/12" :disabled="!checkNameValid" :class="{'button-disabled-base' : !checkNameValid}"></BaseButton>
        </div>
      </div>
    </form>

    <div class="flex justify-center link-pipe">
      <BaseLinkButton to="/auth">로그인</BaseLinkButton>
      <BaseLinkButton to="/auth/reset-password">비밀번호 재설정</BaseLinkButton>
      <BaseLinkButton to="/auth/register">회원가입</BaseLinkButton>
    </div>  

  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import api from '@/api/auth';
  import { useRouter } from 'vue-router';
  import { nameRequiredRule, checkRule } from '@/composables/validationRules';
  import BaseInput from '@/components/BaseInput.vue';
  import BaseButton from '@/components/BaseButton.vue';
  import BaseLinkButton from '@/components/BaseLinkButton.vue';

  const form = ref({
    name:'',
  })
  const backendError = ref(false);
  const checkNameValid = computed(() => {
    const nameValid = checkRule(nameRequiredRule, form.value.name);
    return nameValid
  })

    const onSubmit = async () => {
    const user = {
      name:form.value.name,
    }
    try{
      // const { data } = await api.register(user);
      // await router.push('/auth/login')
      backendError.value = false
      // doSomething(data.message, 'success')
    } catch(error){
      backendError.value = true;
      return error;
    }
  }
</script>

<style lang="postcss" scoped>

</style>