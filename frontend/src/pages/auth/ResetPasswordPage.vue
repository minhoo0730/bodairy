<template>
  <div class="w-full h-screen flex flex-col justify-center items-center gap-8">
    <form @submit.prevent class="w-full flex flex-col justify-center items-center gap-6">
      <div class="w-full flex flex-col gap-3">
        <div class="w-full flex gap-3">
          <BaseInput 
            class="w-8/12"
            label="이메일"
            type="email"
            v-model="form.email"
            :backendError="emailCheckError"
            :arrayRule="emailRequiredRule"
            id="email" />
          <BaseButton class="w-4/12" id="getOtpBtn" label="인증번호 받기" @click.prevent="onSubmit" :disabled="!checkEmailValidation" :class="{'button-disabled-base' : !checkEmailValidation}"></BaseButton>
        </div>
        <div class="w-full flex gap-3" v-if="(isOtpNumber && !isChangePassword) || isChangePassword">
          <BaseInput 
            class="w-8/12"
            label="OTP번호 입력"
            :maxlength="6"
            pattern="[0-9]*"
            inputmode="numeric"
            v-model="form.otpNumber"
            :arrayRule="otpNumberRequiredRule"
            :backendError="otpNumberError"
            id="otpNumber" />
          <BaseButton class="w-4/12" id="checkOtpNumber" label="인증" @click.prevent="checkOtpNumber" :disabled="!checkOtpNumberValidation"  :class="{'button-disabled-base' : !checkOtpNumberValidation}"></BaseButton>
        </div>
      </div>
      <div class="w-full flex flex-col gap-3" v-if="isChangePassword">
        <BaseInput 
          class="w-full"
          label="새 비밀번호 입력"
          type="password"
          :arrayRule="passwordRule"
          :backendError="changePasswordError"
          v-model="form.newPassword"
          id="newPassword">
        </BaseInput>
        <BaseInput 
          class="w-full"
          label="비밀번호 확인"
          type="password"
          v-model="form.newPasswordConfirm"
          :backendError="changePasswordError"
          :arrayRule="confirmPasswordRule(form.newPassword)"
          id="newPasswordConfirm">
        </BaseInput>
        <BaseButton label="비밀번호 변경" @click.prevent="changePassword" :disabled="!checkPasswordRule" :class="{'button-disabled-base' : !checkPasswordRule}"></BaseButton>
      </div>
    </form>
    <div class="flex justify-center">
      <BaseLinkButton to="/auth">로그인 페이지 이동</BaseLinkButton>
    </div>

  </div>
</template>

<script setup>
    import { ref , computed} from 'vue';
    import { useRouter } from 'vue-router';
    import auth from '@/api/auth';
    import BaseInput from '@/components/BaseInput.vue';
    import BaseButton from '@/components/BaseButton.vue';
    import { useToast } from '@/composables/useToast';
    import {emailRequiredRule, otpNumberRequiredRule, passwordRule, confirmPasswordRule, checkRule } from '@/composables/validationRules';
    import BaseLinkButton from '@/components/BaseLinkButton.vue';
    
    const { show } = useToast();
    const router = useRouter();
    const isOtpNumber = ref(false);
    const isChangePassword = ref(false);
    const emailCheckError = ref(false);
    const otpNumberError = ref(false);
    const changePasswordError = ref(false);
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
      const { data } = await auth.requestOtp(formEmail);
      isOtpNumber.value = true;
      emailCheckError.value = false;
      doSomething(data.message, 'success')
    } catch (error){
      emailCheckError.value = false;
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
      otpNumberError.value = false; 
      doSomething(data.message, 'success')
    } catch(error){
      isChangePassword.value = false;
      otpNumberError.value = true;
      return error
    }
  }

  const changePassword = async () => {
    const passwordForm = {};
    passwordForm.email = form.value.email;
    passwordForm.password = form.value.newPassword;
    passwordForm.password_confirmation = form.value.newPasswordConfirm;
    try {
      const { data } = await auth.resetPassword(passwordForm);
      changePasswordError.value = false;
      await router.push('/auth/login')
      doSomething(data.message, 'success')
    } catch(error){
      changePasswordError.value = true;
      return error
    }
  }

  const pageToLogin = () => {
    router.push('/auth/login')
  }

const doSomething = (message, type) => {
  show(message, type)
}

const checkEmailValidation = computed(() => {
  const emailValid = checkRule(emailRequiredRule, form.value.email);
  return emailValid.valid
})

const checkOtpNumberValidation = computed(() => {
  const otpValid = checkRule(otpNumberRequiredRule, form.value.otpNumber);
  return otpValid.valid
})

const checkPasswordRule = computed(() => {
  const passwordValid = checkRule(passwordRule, form.value.newPassword);
  const newPasswordValid = checkRule(confirmPasswordRule, form.value.newPasswordConfirm);
  return passwordValid.valid && newPasswordValid.valid;
})


</script>

<style lang="postcss" scoped>

</style>