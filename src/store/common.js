export default {
    state: {
        os: '',
    },
    mutations: {
        setCurOS(state, { os }) {
            state.os = os
        },
    },
}
