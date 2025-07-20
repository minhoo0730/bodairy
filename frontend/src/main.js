import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import ToastContainer from '@/components/ToastContainer.vue'

import '@/assets/css/style.css';
import 'flowbite';
import App from './App.vue'
import router from "./router";
const pinia = createPinia()
const app = createApp(App);

app.use(pinia)
app.use(router);
app.component('ToastContainer', ToastContainer)
app.mount("#app");

// // 전역 Toast 마운트
// const toastRoot = document.createElement('div')
// toastRoot.id = 'toastRoot'
// document.body.appendChild(toastRoot)

// createApp({ render: () => h(ToastContainer) }).mount('#toastRoot')