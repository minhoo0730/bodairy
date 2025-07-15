<template>
  <div class="relative">
      <input
      :type="props.type"
      :id="props.id"
      placeholder=" "
      :value="props.modelValue"
      :autocomplete="props.type === 'password' ? 'current-password':''"
      @input="$emit('update:modelValue', $event.target.value)"
      class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      />
      <label
        :for="props.id"
        class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
        {{ props.label }}
      </label>
  </div>
</template>

<script setup>
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
  })
</script>

<style lang="postcss" scoped>
  input:-webkit-autofill {
    box-shadow: 0 0 0 1000px rgb(17 24 39 / var(--tw-bg-opacity, 1)) inset; /* Tailwind gray-900 */
    -webkit-text-fill-color: #f3f4f6;       /* Tailwind gray-100 */
    caret-color: white;
    transition: background-color 9999s ease-in-out 0s;
  }

/* WebKit 및 Blink 기반 브라우저 */
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

</style>