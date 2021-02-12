import Vue from 'vue'
import Vuex from 'vuex'
import { deepCopy, swap, $ } from '@/utils/utils'
import toast from '@/utils/toast'
import generateID from '@/utils/generateID'
import { commonStyle, commonAttr } from '@/custom-component/component-list'
import eventBus from '@/utils/eventBus'
import { decomposeComponent } from '@/utils/style'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        editMode: 'edit', // 编辑器模式 edit read
        canvasStyleData: { // 页面全局数据
            width: 1200,
            height: 740,
            scale: 100,
        },
        componentData: [], // 画布组件数据
        curComponent: null,
        curComponentIndex: null,
        snapshotData: [], // 编辑器快照数据
        snapshotIndex: -1, // 快照索引
        menuTop: 0, // 右击菜单数据
        menuLeft: 0,
        menuShow: false,
        copyData: null, // 复制粘贴剪切
        areaData: {
            style: {
                top: 0,
                left: 0,
                width: 0,
                height: 0,
            },
            components: [],
        },
        editor: null,
        isCut: false,
    },
    mutations: {
        getEditor(state) {
            state.editor = $('#editor')
        },

        setAreaData(state, data) {
            state.areaData = data
        },

        compose({ componentData, areaData, editor }) {
            const components = []
            areaData.components.forEach(component => {
                if (component.component != 'Group') {
                    components.push(component)
                } else {
                    // 如果要组合的组件中，已经存在组合数据，则需要提前拆分
                    const parentStyle = { ...component.style }
                    const subComponents = component.propValue
                    const editorRect = editor.getBoundingClientRect()

                    store.commit('deleteComponent')
                    subComponents.forEach(component => {
                        decomposeComponent(component, editorRect, parentStyle)
                        store.commit('addComponent', { component })
                    })

                    components.push(...component.propValue)
                    store.commit('batchDeleteComponent', component.propValue)
                }
            })

            store.commit('addComponent', {
                component: {
                    id: generateID(),
                    component: 'Group',
                    ...commonAttr,
                    style: {
                        ...commonStyle,
                        ...areaData.style,
                    },
                    propValue: components,
                },
            })
            
            eventBus.$emit('hideArea')

            store.commit('batchDeleteComponent', areaData.components)
            store.commit('setCurComponent', { 
                component: componentData[componentData.length - 1],
                index: componentData.length - 1,
            })

            areaData.components = []
        },

        batchDeleteComponent({ componentData }, deleteData) {
            deleteData.forEach(component => {
                for (let i = 0, len = componentData.length; i < len; i++) {
                    if (component.id == componentData[i].id) {
                        componentData.splice(i, 1)
                        break
                    }
                }
            })
        },

        decompose({ curComponent, editor }) {
            const parentStyle = { ...curComponent.style }
            const components = curComponent.propValue
            const editorRect = editor.getBoundingClientRect()

            store.commit('deleteComponent')
            components.forEach(component => {
                decomposeComponent(component, editorRect, parentStyle)
                store.commit('addComponent', { component })
            })
        },

        copy(state) {
            state.copyData = {
                data: deepCopy(state.curComponent),
                index: state.curComponentIndex,
            }

            state.isCut = false
            console.log(1)
        },

        paste(state, isMouse) {
            if (!state.copyData) {
                toast('请选择组件')
                return
            }

            const data = state.copyData.data
            
            if (isMouse) {
                data.style.top = state.menuTop
                data.style.left = state.menuLeft
            } else {
                data.style.top += 10
                data.style.left += 10
            }
            
            data.id = generateID()
            store.commit('addComponent', { component: deepCopy(data) })
            if (state.isCut) {
                state.copyData = null
            }
        },

        cut(state) {
            if (!state.curComponent) {
                toast('请选择组件')
                return
            }
            
            if (state.copyData) {
                store.commit('addComponent', { component: state.copyData.data, index: state.copyData.index })
                if (state.curComponentIndex >= state.copyData.index) {
                    // 如果当前组件索引大于等于插入索引，需要加一，因为当前组件往后移了一位
                    state.curComponentIndex++
                }
            }

            store.commit('copy')
            store.commit('deleteComponent')
            state.isCut = true
        },

        setEditMode(state, mode) {
            state.editMode = mode
        },

        setCanvasStyle(state, style) {
            state.canvasStyleData = style
        },

        addComponent(state, { component, index }) {
            if (index !== undefined) {
                state.componentData.splice(index, 0, component)
            } else {
                state.componentData.push(component)
            }
        },

        setCurComponent(state, { component, index }) {
            state.curComponent = component
            state.curComponentIndex = index
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

        deleteComponent(state, index) {
            if (index === undefined) {
                index = state.curComponentIndex
            }

            state.componentData.splice(index, 1)
        },

        upComponent({ componentData, curComponentIndex }) {
            // 上移图层 index，表示元素在数组中越往后
            if (curComponentIndex < componentData.length - 1) {
                swap(componentData, curComponentIndex, curComponentIndex + 1)
            } else {
                toast('已经到顶了')
            }
        },

        downComponent({ componentData, curComponentIndex }) {
            // 下移图层 index，表示元素在数组中越往前
            if (curComponentIndex > 0) {
                swap(componentData, curComponentIndex, curComponentIndex - 1)
            } else {
                toast('已经到底了')
            }
        },

        topComponent({ componentData, curComponentIndex }) {
            // 置顶
            if (curComponentIndex < componentData.length - 1) {
                swap(componentData, curComponentIndex, componentData.length - 1)
            } else {
                toast('已经到顶了')
            }
        },

        bottomComponent({ componentData, curComponentIndex }) {
            // 置底
            if (curComponentIndex > 0) {
                swap(componentData, curComponentIndex, 0)
            } else {
                toast('已经到底了')
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