<template>
  <div class="w-full h-screen flex flex-col justify-center items-center gap-4">
    <form @submit.prevent class="w-full flex flex-col justify-center items-center gap-4">
      <div class="w-full flex flex-col gap-3">
        <div class="w-full flex gap-3">
          <BaseInput 
            class="w-8/12"
            label="이메일"
            type="email"
            v-model="form.email"
            :arrayRule="emailRequiredRule"
            id="email" />
          <BaseButton class="w-4/12" id="resetPassword" label="인증번호 받기" @click.prevent="onSubmit"></BaseButton>
        </div>
        <div class="w-full flex gap-3" v-if="(isOtpNumber && !isChangePassword) || isChangePassword">
          <BaseInput 
            class="w-8/12"
            label="OTP번호 입력"
            type="text"
            v-model="form.otpNumber"
            :arrayRule="otpNumberRequiredRule"
            id="otpNumber" />
          <BaseButton class="w-4/12" id="resetPassword" label="인증" @click.prevent="checkOtpNumber"></BaseButton>
        </div>
      </div>
      <div class="w-full flex flex-col gap-3" v-if="isChangePassword">
        <BaseInput 
          class="w-full"
          label="새 비밀번호 입력"
          type="password"
          v-model="form.newPassword"
          :arrayRule="passwordRule"
          id="newPassword">
        </BaseInput>
        <BaseInput 
          class="w-full"
          label="비밀번호 확인"
          type="password"
          v-model="form.newPasswordConfirm"
          :arrayRule="passwordRule"
          id="newPasswordConfirm">
        </BaseInput>
        <BaseButton label="비밀번호 변경" @click.prevent="changePassword"></BaseButton>
      </div>
    </form>
    <div class="w-full flex-col">
      <BaseButton label="로그인 페이지 이동" @click.prevent="pageToLogin"></BaseButton>
    </div>

  </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import auth from '@/api/auth';
    import BaseInput from '@/components/BaseInput.vue';
    import BaseButton from '@/components/BaseButton.vue';
    import { useToast } from '@/composables/useToast';
    import {emailRequiredRule, otpNumberRequiredRule, passwordRule, checkRule } from '@/composables/validationRules';

    const { show } = useToast();
    const router = useRouter();
    const isOtpNumber = ref(false);
    const isChangePassword = ref(false);
    const form = ref({
      email:'',
      otpNumber:'',
      newPassword:'',
      newPasswordConfirm:'',
    })

  const onSubmit = async () => {
    const formEmail = {
      email : form.value.email
    };
    try{
      await auth.requestOtp(formEmail);
      isOtpNumber.value = true;
      doSomething('OTP번호가 발송되었습니다!', 'success')
    } catch (error){
      return error
    }
  }

  const checkOtpNumber = async () => {
    const checkOtp = {};
    checkOtp.email = form.value.email;
    checkOtp.otp_code = form.value.otpNumber;
    try{
      const { data } = await auth.verifyOtp(checkOtp);
      isChangePassword.value = true;
      doSomething(`인증에 성공했습니다.
      재설정하실 비밀번호를 입력하세요.`, 'success'
    )
    } catch(error){
      return error
    }
  }

  const changePassword = async () => {
    const passwordForm = {};
    passwordForm.email = form.value.email;
    passwordForm.password = form.value.newPassword;
    passwordForm.password_confirmation = form.value.newPasswordConfirm;
    try {
      const {data} = await auth.resetPassword(passwordForm);
      doSomething('비밀번호가 재설정 되었습니다!', 'success')
      await router.push('/auth/login')
    } catch(error){
      return error
    }
  }

  const pageToLogin = () => {
    router.push('/auth/login')
  }

const doSomething = (message, type) => {
  show(message, type)
}


</script>

<style lang="scss" scoped>

</style>