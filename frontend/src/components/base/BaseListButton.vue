<template>
    <button class="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
      {{ props.label }}
    </button>
</template>

<script setup>
  const props = defineProps({
    label:{
      type:String,
      default:''
    },
    class:{
      type:String,
      default:'w-full',
    }
  })

</script>

<style lang="postcss" scoped>

</style>