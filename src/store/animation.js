export default {
    mutations: {
        addAnimation({ curComponent }, animation) {
            curComponent.animations.push(animation)
        },

        removeAnimation({ curComponent }, index) {
            curComponent.animations.splice(index, 1)
        },

        alterAnimation({ curComponent }, { index, data = {} }) {
            if (typeof index === 'number') {
                const original = curComponent.animations[index]
                curComponent.animations[index] = { ...original, ...data }
            }
        },
    },
}