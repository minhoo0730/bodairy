<template>
  <div class="flex flex-col justify-center items-center">
    <div class="w-full">
      <div class="flex flex-col gap-4 justify-center items-center">
        <TheDatePicker></TheDatePicker>
        <TheTimePicker></TheTimePicker>
      </div>
      <div class="mt-12">
        <div class="flex gap-8">
        <template v-for="list in items" :key="list">
            <div class="rounded-full h-[128px] w-[128px] flex-none flex justify-center items-center bg-slate-700">
              <p class="text-[1.6rem]">
                {{list}}
              </p>
            </div>
          </template>
        </div>
      </div>
      <div>
        <textarea class="w-full h-[150px]"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
  import TheDatePicker from '@/components/TheDatePicker.vue';
  import TheTimePicker from '@/components/TheTimePicker.vue';


  const items = ['헬스', '복싱', '축구', '야구', '런닝머신', '사이클']
</script>

<style lang="postcss" scoped>

</style>