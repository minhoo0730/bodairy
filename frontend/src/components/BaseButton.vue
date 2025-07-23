<template>
  <button
  :class="props.class"
   class="button-base">{{props.label}}</button>
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

<style lang="scss" scoped>

</style>