import { deepCopy, swap } from '@/utils/utils'
import toast from '@/utils/toast'

export default {
    mutations: {
        upComponent(state) {
            const { componentData, curComponentIndex } = state
            // 上移图层 index，表示元素在数组中越往后
            if (curComponentIndex < componentData.length - 1) {
                state.componentData = deepCopy(swap(componentData, curComponentIndex, curComponentIndex + 1))
            } else {
                toast('已经到顶了')
            }
        },

        downComponent(state) {
            const { componentData, curComponentIndex } = state
            // 下移图层 index，表示元素在数组中越往前
            if (curComponentIndex > 0) {
                state.componentData = deepCopy(swap(componentData, curComponentIndex, curComponentIndex - 1))
            } else {
                toast('已经到底了')
            }
        },

        topComponent(state) {
            const { componentData, curComponentIndex } = state
            // 置顶
            if (curComponentIndex < componentData.length - 1) {
                state.componentData = deepCopy(swap(componentData, curComponentIndex, componentData.length - 1))
            } else {
                toast('已经到顶了')
            }
        },

        bottomComponent(state) {
            const { componentData, curComponentIndex } = state
            // 置底
            if (curComponentIndex > 0) {
                state.componentData = deepCopy(swap(componentData, curComponentIndex, 0))
            } else {
                toast('已经到底了')
            }
        },
    },
}
