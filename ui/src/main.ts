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

const useCustomErrorHandle = false
if (useCustomErrorHandle){
    const errorStore = useErrorStore()
    app.config.errorHandler = (err, vm, info) => {
        errorStore.add(`Vue Error: ${err}\n \n details: ${info}`)
    }
}


app.mount('#app')
