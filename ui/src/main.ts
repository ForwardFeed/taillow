// We need to use the triple-slash directive to ensure that ts-node uses the
// reset.d.ts file. It's not possible to import the file directly because it
// is not included in the build (it's a dev dependency).
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./utils/reset.d.ts" />

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useErrorStore } from './stores/errors'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

const errorStore = useErrorStore()
app.config.errorHandler = (err, vm, info) => {
    errorStore.add(`Vue Error: ${err}\n \n details: ${info}`)
}

app.mount('#app')
