import Vue from 'vue'
import Vuex from 'vuex'
import { deepCopy, swap } from '@/utils/utils'
import toast from '@/utils/toast'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        editMode: 'edit', // 编辑器模式 edit read
        canvasStyleData: { // 页面全局数据
            width: 1200,
            height: 740,
        },
        componentData: [],
        curComponent: null,
        curComponentZIndex: null,
        snapshotData: [], // 编辑器快照数据
        snapshotIndex: -1, // 快照索引
        menuTop: 0,
        menuLeft: 0,
        menuShow: false,
    },
    mutations: {
        setEditMode(state, mode) {
            state.editMode = mode
        },

        setCanvasStyle(state, style) {
            state.canvasStyleData = style
        },

        addComponent(state, component) {
            state.componentData.push(component)
        },

        setCurComponent(state, { component, zIndex }) {
            state.curComponent = component
            state.curComponentZIndex = zIndex
        },
        
        setShapeStyle({ curComponent }, { top, left, width, height, rotate }) {
            if (top) curComponent.style.top = top
            if (left) curComponent.style.left = left
            if (width) curComponent.style.width = width
            if (height) curComponent.style.height = height
            if (rotate) curComponent.style.rotate = rotate
        },

        setShapePosStyle({ curComponent }, { key, value }) {
            curComponent.style[key] = value
        },

        undo(state) {
            if (state.snapshotIndex >= 0) {
                state.snapshotIndex--
                store.commit('setComponentData', deepCopy(state.snapshotData[state.snapshotIndex]))
            }
        },

        redo(state) {
            if (state.snapshotIndex < state.snapshotData.length - 1) {
                state.snapshotIndex++
                store.commit('setComponentData', deepCopy(state.snapshotData[state.snapshotIndex]))
            }
        },

        setComponentData(state, componentData = []) {
            Vue.set(state, 'componentData', componentData)
        },

        recordSnapshot(state) {
            // 添加新的快照
            state.snapshotData[++state.snapshotIndex] = deepCopy(state.componentData)
            // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
            if (state.snapshotIndex < state.snapshotData.length - 1) {
                state.snapshotData = state.snapshotData.slice(0, state.snapshotIndex + 1)
            }
        },

        showContexeMenu(state, { top, left }) {
            state.menuShow = true
            state.menuTop = top
            state.menuLeft = left
        },

        hideContexeMenu(state) {
            state.menuShow = false
        },

        deleteComponent(state) {
            state.componentData.splice(state.curComponentZIndex, 1)
        },

        upComponent({ componentData, curComponentZIndex }) {
            // 上移图层 zIndex，表示元素在数组中越往后
            if (curComponentZIndex < componentData.length - 1) {
                swap(componentData, curComponentZIndex, curComponentZIndex + 1)
            } else {
                toast('已经到顶了', 'error')
            }
        },

        downComponent({ componentData, curComponentZIndex }) {
            // 下移图层 zIndex，表示元素在数组中越往前
            if (curComponentZIndex > 0) {
                swap(componentData, curComponentZIndex, curComponentZIndex - 1)
            } else {
                toast('已经到底了', 'error')
            }
        },

        topComponent({ componentData, curComponentZIndex }) {
            // 置顶
            if (curComponentZIndex < componentData.length - 1) {
                swap(componentData, curComponentZIndex, componentData.length - 1)
            } else {
                toast('已经到顶了', 'error')
            }
        },

        bottomComponent({ componentData, curComponentZIndex }) {
            // 置底
            if (curComponentZIndex > 0) {
                swap(componentData, curComponentZIndex, 0)
            } else {
                toast('已经到底了', 'error')
            }
        },

        addAnimation({ curComponent }, animation) {
            curComponent.animations.push(animation)
        },

        removeAnimation({ curComponent }, index) {
            curComponent.animations.splice(index, 1)
        },

        addEvent({ curComponent }, { event, param }) {
            curComponent.events[event] = param
        },

        removeEvent({ curComponent }, event) {
            delete curComponent.events[event]
        },
    },
})

export default store