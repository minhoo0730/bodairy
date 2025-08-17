<template>
  <div class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 overflow-hidden" :class="props.class">
    <ul>
      <li>
        <slot></slot>
      </li>
    </ul>
  </div>
</template>

<script setup>

  const props = defineProps({
    label:{
      type:String,
      default:''
    },
    class:{
      type:String,
      default:'',
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