<template>
  <component
    :is="isExternal ? 'a' : RouterLink"
    v-bind="isExternal
      ? { href: to, target: '_blank', rel: 'noopener noreferrer' }
      : { to }"
    class=" text-blue-500 dark:text-gray-400">
    <slot></slot>
  </component>
</template>

<script setup>
  import { computed } from 'vue'
  import { RouterLink } from 'vue-router'

  const props = defineProps({ 
    to: String,
  })
  const isExternal = computed(() => /^https?:\/\//.test(props.to))
</script>

<style lang="postcss" scoped>

</style>