<template>
  <div class="relative">
    <div class="flex items-center mb-4">
      <input
        :id="props.id"
        :value="props.modelValue"
         @input="$emit('update:modelValue', $event.target.value)"
        type="checkbox"
        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
      <label :for="props.id" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ props.label }}</label>
    </div>
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
    id:{
      type:String,
    },
  })
</script>

<style lang="scss" scoped>

</style>