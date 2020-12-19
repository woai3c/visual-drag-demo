import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import store from './store'
import router from './router'
import '@/custom-component' // 注册自定义组件

import '@/styles/animate.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/reset.css'

Vue.use(ElementUI, { size: 'small' })
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
})
