<template>
  <div class="w-full h-screen flex flex-col justify-center items-center gap-8">
    <form class="w-full flex flex-col justify-center items-center gap-6"  @submit.prevent @keyup.enter="onSubmit">
      <BaseInput
        class="w-full"
        label="이름"
        type="name"
        v-model="form.name"
        :arrayRule="nameRequiredRule"
        :backendError="backendError"
        id="name" />
      <BaseInput
        class="w-full"
        label="휴대전화번호"
        type="text"
        v-model="form.phone"
        placeholder="예) 01012341234"
        :arrayRule="phoneRule"
        :backendError="backendError"
        id="phone" />
      </form>
      <div class="w-full flex flex-col gap-3">
        <BaseButton label="이메일 찾기" @click.prevent="onSubmit" class="w-full" :disabled="!checkFindEmailValidation" :class="{'button-disabled-base' : !checkFindEmailValidation}"></BaseButton>
        <div class="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700" v-if="findEmailResult">
          <h5 class="text-2xl font-bold text-gray-900 dark:text-gray-400">{{form.name}}님이 가입하신 이메일은<br>
          <span class="text-gray-500 dark:text-white">{{ findEmailResult }} </span> 입니다.</h5>
        </div>
      </div>

    <div class="flex justify-center link-pipe">
      <BaseLinkButton to="/auth">로그인 페이지 이동</BaseLinkButton>
      <!-- <BaseLinkButton to="/auth/reset-password">비밀번호 재설정</BaseLinkButton>
      <BaseLinkButton to="/auth/register">회원가입</BaseLinkButton> -->
    </div>  

  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import api from '@/api/auth';
  import { useRouter } from 'vue-router';
  import { useToast } from '@/composables/useToast';
  import { nameRequiredRule, phoneRule, checkRule } from '@/composables/validationRules';
  import BaseInput from '@/components/base/BaseInput.vue';
  import BaseButton from '@/components/base/BaseButton.vue';
  import BaseLinkButton from '@/components/base/BaseLinkButton.vue';

  const { show } = useToast();
  const doSomething = (message, type) => {
    show(message, type)
  }

  const form = ref({
    name:'',
    phone:'',
  })

  const findEmailResult = ref('');

  const backendError = ref(false);

  const checkNameValid = computed(() => {
    const nameValid = checkRule(nameRequiredRule, form.value.name);
    return nameValid
  })
  const checkPhoneValid = computed(() => {
    const phoneValid = checkRule(phoneRule, form.value.phone);
    return phoneValid
  })

  const checkFindEmailValidation = computed(() => {
    const nameValid = checkRule(nameRequiredRule, form.value.name);
    const phoneValid = checkRule(phoneRule, form.value.phone);
    return nameValid.valid && phoneValid.valid
  })

    const onSubmit = async () => {
    const user = {
      name:form.value.name,
      phone:form.value.phone
    }
    try{
      const { data } = await api.findEmail(user);
      findEmailResult.value = data.email_masked;
      backendError.value = false;
      doSomething(data.message, 'success')
    } catch(error){
      backendError.value = true;
      return error;
    }
  }
</script>

<style lang="postcss" scoped>

</style>