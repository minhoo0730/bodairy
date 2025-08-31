<template>
  <div class="flex flex-col justify-center items-center">
    <div>
      <div class="flex gap-4 justify-center items-center">
        <div class="relative max-w-sm">
          <div class="absolute inset-y-0 start-0 flex items-center ps-8 pointer-events-none">
            <svg class="w-8 h-8 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
            </svg>
          </div>
          <input datepicker type="text" class="!pl-[56px] input-base" placeholder="날짜를 선택하세요">
        </div>
        <TimePicker></TimePicker>
      </div>
      <p>운동종목 선택</p>
      <p>메모</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import Datepicker from 'flowbite-datepicker/Datepicker';
  import TimePicker from '@/components/TimePicker.vue';

  const options = {
    autohide: true,
    format: 'yyyy년 mm월 dd일',
    todayHighlight:true,
  }

  onMounted(() => {
    const datepickerEl = document.querySelector('[datepicker]');
    const datepicker = new Datepicker(datepickerEl, options)
    datepicker.setDate(new Date()); 
  });


</script>

<style lang="postcss" scoped>
.datepicker-dropdown .datepicker-cell.focused {
  background-color: #22c55e;
  color: white;
}
</style>