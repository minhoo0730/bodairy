<template>
  <div>
    <div class="relative">
      <input
        :placeholder="props.placeholder"
        class="input-base peer"
        :class="inputClass"
        :type="props.type"
        :maxlength="props.maxlength"
        :id="props.id"
        :value="props.modelValue"
        :autocomplete="props.autocomplete ?? (props.type === 'password' ? 'current-password' : 'on')"
        :inputmode="props.inputmode"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        />
      <label
        :for="props.id"
        :class="labelClass"
        class="label-base"
        >
        {{ props.label }}
      </label>
    </div>
    <p @blur="!validate" class="mt-2  dark:mt-2 text-red-600 dark:text-red-400" v-if="hasError">{{ errorMessage }}</p>
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
    },
    backendError:{
      type:Boolean,
      default:false,
    },
    maxlength:{
      type:Number,
      default:null,
    },
    pattern:{
      type:String,
      default:null
    },
    inputmode:{
      type:String,
      default:null
    },
    placeholder:{
      type:String,
      default:'',
    }
  })

const emit = defineEmits(['update:modelValue', 'resetBackendError']);

const formFocus = ref(false);
const inputError = ref('');

const validate = computed(() => checkRule(props.arrayRule, props.modelValue));
const hasError = computed(() => {
  return formFocus.value && (!validate.value.valid);
});
const errorMessage = computed(() => {
  if (props.backendError) return null;
  return validate.value.message;
});

const onFocus = () => {
  if (!formFocus.value) formFocus.value = true;
};

const labelClass = computed(() => {
  if (props.backendError) return 'error-label-base';
  if (validate.value.valid) return 'success-label-base';
  return '';
});

const inputClass = computed(() => {
  if (props.backendError) return 'error-input-base';
  if (validate.value.valid) return 'success-input-base';
  return '';
});

const updateError = () => {
  const { valid, message } = checkRule(props.arrayRule, props.modelValue);
  inputError.value = valid ? '' : message;
};

const onBlur = () => {
  if (formFocus.value) updateError();
}
const onInput = (e) => {
  if(props.inputmode === 'numeric'){
     e.target.value =  e.target.value.replace(/[^0-9]/g, '')
  }
  emit('update:modelValue',  e.target.value)
  emit('resetBackendError');
}

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