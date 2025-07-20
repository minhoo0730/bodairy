<template>
  <div>
  <div class="relative">
    <input
      :type="props.type"
      :id="props.id"
      placeholder=" "
      :value="props.modelValue"
      :autocomplete="props.autocomplete ?? (props.type === 'password' ? 'current-password' : 'on')"

      @focus="onFocus"
      @blur="onBlur"
      @input="$emit('update:modelValue', $event.target.value)"
      class="input-base peer"
      :class="[hasError &&  formFocus ? 'error-input-base':'', validate.valid ? 'success-input-base':'']"
      />
    <label
      :for="props.id"
      :class="[hasError &&  formFocus ? 'error-label-base':'', validate.valid ? 'success-label-base':'']"
      class="label-base"
      >
      {{ props.label }}
    </label>
  </div>
  <p @blur="!validate" class="mt-2 text-xs  dark:mt-2 text-xs text-red-600 dark:text-red-400" v-if="hasError">{{ inputError }}</p>
</div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { checkRule } from '@/composables/validationRules';

  const props = defineProps ({
    modelValue: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    id:{
      type:String,
    },
    arrayRule:{
      type:Array,
      default: () => [],
    }
  })

const formFocus = ref(false);
const inputError = ref('');

const hasError = computed(() => formFocus.value && inputError.value !== '');
const validate = computed(() => {
  return checkRule(props.arrayRule, props.modelValue);
});

const onFocus = () => {
  if (!formFocus.value) formFocus.value = true;
};

const onBlur = () => {
  if (formFocus.value) updateError();
}

const updateError = () => {
  const { valid, message } = checkRule(props.arrayRule, props.modelValue);
  inputError.value = valid ? '' : message;
};


</script>

<style lang="postcss" scoped>
  input:-webkit-autofill {
    box-shadow: 0 0 0 1000px rgb(17 24 39 / var(--tw-bg-opacity, 1)) inset; /* Tailwind gray-900 */
    -webkit-text-fill-color: #f3f4f6;       /* Tailwind gray-100 */
    caret-color: white;
    transition: background-color 9999s ease-in-out 0s;
  }

/* 다크 모드 대응 */
@media (prefers-color-scheme: dark) {
  input:-webkit-autofill {
    -webkit-text-fill-color: #fff !important; 
    /* box-shadow: 0 0 0px 1000px #1f2937 inset;  */
  }
}

/* WebKit 및 Blink 기반 브라우저 */
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>