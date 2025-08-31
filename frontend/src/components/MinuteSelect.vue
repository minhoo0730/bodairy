<template>
  <div class="border border-gray-400 rounded-md relative w-[100px] text-center" ref="baseSelectBox">
    <div>
      <button class="bg-transparent p-4 h-[52px] w-full" @click.prevent="isOpen = !isOpen">{{ props.nowMinute }}</button>
    </div>
    <div>
      <ul class="border border-gray-400 rounded-md absolute top-[58px] left-0 w-full" v-if="isOpen">
        <li class="text-md border-b border-gray-400 [&:last-child]:border-b-0" v-for="(list, idx) in 60" :key="list">
          <button class="bg-transparent w-full  p-4 hover:bg-gray-400 hover:text-gray-900" @click.prevent="selected(list)">
            {{ idx < 10 ? '0' + idx : idx }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';

  const props = defineProps({
    nowMinute:{
      type:String,
    }
  })
  
  const emit = defineEmits(['selectMinute']);
  const selectMinute = ref(props.nowMinute !== null ? props.nowMinute : '분 선택');

  const isOpen = ref(false)
  const baseSelectBox = ref();

  const selected = (list) => {
    selectMinute.value = String(list);
    isOpen.value = false;
     emit('selectMinute', selectMinute.value)
  };


const handleOutsideClick = (event) => {
  if (baseSelectBox.value && !baseSelectBox.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});


</script>

<style lang="postcss" scoped>
</style>