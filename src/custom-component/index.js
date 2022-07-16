import Vue from 'vue'

const components = [
    'CircleShape',
    'Picture',
    'VText',
    'VButton',
    'Group',
    'RectShape',
    'LineShape',
]

components.forEach(key => {
    Vue.component(key, () => import(`@/custom-component/${key}`))
})

const svgs = [
    'SVGStar',
    'SVGTriangle',
]

svgs.forEach(key => {
    Vue.component(key, () => import(`@/custom-component/svgs/${key}`))
})
