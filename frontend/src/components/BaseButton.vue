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

<style lang="postcss" scoped>
  .sm{
    @apply h-8 px-3;
  }
  .md{
    @apply h-10 px-4;
  }
  .lg{  
    @apply h-12 px-5;
  }
</style>