import Vue from 'vue'

const components = [
    'Picture',
    'VText',
    'VButton',
    'Group',
]

components.forEach(key => {
    Vue.component(key, () => import(`@/custom-component/${key}`))
})