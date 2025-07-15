<template>
  <div class="w-full h-screen flex flex-col justify-center items-center gap-4">
    <form @submit.prevent class="w-full flex flex-col justify-center items-center gap-4">
      <BaseInput 
        class="w-full"
        label="이메일"
        type="email"
        v-model="form.email"
        id="email">
      </BaseInput>
      <BaseInput 
        class="w-full"
        label="비밀번호"
        type="password"
        v-model="form.password"
        id="password">
      </BaseInput>
    </form>
    <div class="w-full flex-col">
      <BaseButton label="로그인" @click.prevent="onSubmit"></BaseButton>
      <BaseButton id="resetPassword" label="비밀번호 재설정" @click.prevent="resetPassword"></BaseButton>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  import BaseInput from '@/components/BaseInput.vue';
  import BaseCheckbox from '@/components/BaseCheckbox.vue';
  import BaseButton from '@/components/BaseButton.vue';

  const router = useRouter();
  const auth = useAuthStore();
  const form = ref({
    email:'',
    password:'',
  })

  const onSubmit = async () => {
    await auth.login(form.value)
  }

  const resetPassword = () => {
    router.push('/auth/reset-password')
  }
</script>

<style lang="postcss" scoped>

</style>