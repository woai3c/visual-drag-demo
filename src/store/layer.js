import { swap } from '@/utils/utils'
import toast from '@/utils/toast'

export default {
    mutations: {
        upComponent(state) {
            const { componentData, curComponentIndex } = state
            // 上移图层 index，表示元素在数组中越往后
            if (curComponentIndex < componentData.length - 1) {
                swap(componentData, curComponentIndex, curComponentIndex + 1)
                state.curComponentIndex = curComponentIndex + 1
            } else {
                toast('已经到顶了')
            }
        },

        downComponent(state) {
            const { componentData, curComponentIndex } = state
            // 下移图层 index，表示元素在数组中越往前
            if (curComponentIndex > 0) {
                swap(componentData, curComponentIndex, curComponentIndex - 1)
                state.curComponentIndex = curComponentIndex - 1
            } else {
                toast('已经到底了')
            }
        },

        topComponent(state) {
            const { componentData, curComponentIndex, curComponent } = state
            // 置顶
            if (curComponentIndex < componentData.length - 1) {
                componentData.splice(curComponentIndex, 1)
                componentData.push(curComponent)
                state.curComponentIndex = componentData.length - 1
            } else {
                toast('已经到顶了')
            }
        },

        bottomComponent(state) {
            const { componentData, curComponentIndex, curComponent } = state
            // 置底
            if (curComponentIndex > 0) {
                componentData.splice(curComponentIndex, 1)
                componentData.unshift(curComponent)
                state.curComponentIndex = 0
            } else {
                toast('已经到底了')
            }
        },
    },
}
