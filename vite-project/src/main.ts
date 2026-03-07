
import { createApp } from 'vue'
import './style/main.css'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import 'primeicons/primeicons.css'

const app = createApp(App)
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

app.component('DataTable', DataTable)
app.component('Column', Column)
app.use(PrimeVue,{
  theme:{
    preset:Aura
  }
})

app.mount('#app')