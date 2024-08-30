import Vue from 'vue'
import router from '@/router'
import App from './App'
import '@/assets/styles/normalize.scss'

const container = document.createElement("div")
document.body.appendChild(container)

new Vue({
    router,
    render: (h) => h(App),
}).$mount(container)
