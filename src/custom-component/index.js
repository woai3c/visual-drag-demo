import Vue from 'vue'
import Picture from './Picture'
import VText from './VText'
import VButton from './VButton'

const components = {
    Picture,
    VText,
    VButton,
}

Object.keys(components).forEach(key => {
    Vue.component(key, components[key])
})