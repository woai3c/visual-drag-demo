import Vue from 'vue'

export default {
    mutations: {
        addEvent({ curComponent }, { event, param }) {
            curComponent.events[event] = param
        },

        removeEvent({ curComponent }, event) {
            Vue.delete(curComponent.events, event)
        },
    },
}
