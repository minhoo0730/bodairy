<template>
  <div class="flex gap-4 justify-center items-center w-full">
    <!-- <BaseSelectBox :items="timeType" :selected=nowTimeType @selectList="setList"></BaseSelectBox>
    <HourSelect :nowHour="nowHour" @selectHour="setHour"></HourSelect>
    <p>:</p>
    <MinuteSelect :nowMinute="nowMinute" @selectMinute="setMinute"></MinuteSelect> -->

      <NewTimePicker></NewTimePicker>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  import BaseSelectBox from './base/BaseSelectBox.vue';
  import HourSelect from './HourSelect.vue';
  import MinuteSelect from './MinuteSelect.vue';

  import dayjs from 'dayjs'
  import 'dayjs/locale/ko';
  import NewTimePicker from './NewTimePicker.vue';

  dayjs.locale('ko');
  const timeType = ['오전', '오후']
  const now = ref(dayjs());
  const nowTimeType = ref(now.value.format('A'))
  const nowHour = ref(String(now.value.format('h')));
  const nowMinute = ref(String(now.value.format('mm')));
  const setHour = (value) => {
    nowHour.value = value
  }

  const setList = (value) => {
    nowTimeType.value = value
  }

  const setMinute = (value) => {
    nowMinute.value = value
  }

</script>

<style lang="postcss" scoped>

</style>