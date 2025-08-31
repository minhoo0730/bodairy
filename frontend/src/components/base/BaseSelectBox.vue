<template>
  <div class="border border-gray-400 rounded-md relative w-[100px] text-center" ref="baseSelectBox">
    <div>
      <button class="bg-transparent p-4 h-[52px] w-full" @click.prevent="isOpen = !isOpen">{{ props.selected }}</button>
    </div>
    <div>
      <ul class="border border-gray-400 rounded-md absolute top-[58px] left-0 w-full" v-if="isOpen">
        <li class="text-md border-b border-gray-400 [&:last-child]:border-b-0" v-for="(item, idx) in items" :key="items">
          <button class="bg-transparent w-full  p-4 hover:bg-gray-400 hover:text-gray-900" @click.prevent="clickSelectList(item)">
            {{ item }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';

  const props = defineProps({
    items:{
      type:Array,
      default:[]
    },
    selected:{
      type:String,
      default: null
    }
  })
  const emit = defineEmits(['selectList']);

  const selectedItem = ref(props.selected !== null ? props.selected : '리스트 선택');

  // 부모 컴포넌트에서 selected prop이 변경될 때 내부 상태도 업데이트
  watch(() => props.selected, (value) => {
    selectedItem.value = value !== null ? value : '리스트 선택';
  });

  const isOpen = ref(false)
  const baseSelectBox = ref();

  const clickSelectList = (list) => {
    selectedItem.value = String(list);
    isOpen.value = false;
    emit('selectList', selectedItem.value)
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