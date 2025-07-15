<template>
  <button
    class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{{props.label}}</button>
</template>

<script setup>
  const props = defineProps({
    label:{
      type:String,
      default:''
    }
  })
</script>

<style lang="scss" scoped>

</style>