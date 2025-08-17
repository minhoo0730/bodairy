<!-- components/BaseIcon.vue -->
<template>
  <component
    :is="icon"
    :class="[
      'inline-block',
      sizeClass,
      colorClass,
      customClass
    ]"
    :aria-label="ariaLabel"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: [Object, Function],
    required: true,
  },
  size: {
    type: String,
    default: 'md', // xs | sm | md | lg
  },
  color: {
    type: String,
    default: 'gray',
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  customClass: {
    type: String,
    default: '',
  },
})

const sizeClass = computed(() => {
  return {
    xxs: 'w-10 h-10',
    xs: 'w-12 h-12',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }[props.size]
})

const colorClass = computed(() => {
  return {
    gray: 'text-gray-500',
    primary: 'text-blue-600',
    danger: 'text-red-600',
    success: 'text-green-600',
  }[props.color]
})
</script>
