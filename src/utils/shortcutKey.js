import store from '@/store'
import eventBus from '@/utils/eventBus'

const ctrlKey = 17, 
    vKey = 86, // 粘贴
    cKey = 67, // 复制
    xKey = 88, // 剪切

    yKey = 89, // 重做
    zKey = 90, // 撤销

    gKey = 71, // 组合
    bKey = 66, // 拆分

    sKey = 83, // 保存
    pKey = 80, // 预览
    dKey = 68, // 删除
    eKey = 69 // 清空画布

let isCtrlDown = false
export const keycodes = [66, 67, 68, 69, 71, 80, 83, 86, 88, 89, 90]

export function listenGlobalKeyDown() {
    window.onkeydown = (e) => {
        if (e.keyCode == ctrlKey) {
            isCtrlDown = true
        } else if (isCtrlDown && e.keyCode == cKey) {
            store.commit('copy')
        } else if (isCtrlDown && e.keyCode == vKey) {
            store.commit('paste')
            store.commit('recordSnapshot')
        } else if (isCtrlDown && e.keyCode == xKey) {
            store.commit('cut')
        } else if (isCtrlDown && e.keyCode == yKey) {
            store.commit('redo')
            e.preventDefault()
        } else if (isCtrlDown && e.keyCode == zKey) {
            store.commit('undo')
        } else if (isCtrlDown && e.keyCode == gKey && store.state.areaData.components.length) {
            store.commit('compose')
            store.commit('recordSnapshot')
            e.preventDefault()
        } else if (isCtrlDown && e.keyCode == bKey && store.state.curComponent && store.state.curComponent.component == 'Group') {
            store.commit('decompose')
            store.commit('recordSnapshot')
            e.preventDefault()
        } else if (isCtrlDown && e.keyCode == sKey) {
            eventBus.$emit('save')
            e.preventDefault()
        } else if (isCtrlDown && e.keyCode == pKey) {
            eventBus.$emit('preview')
            e.preventDefault()
        } else if (isCtrlDown && e.keyCode == dKey) {
            store.commit('deleteComponent')
            store.commit('recordSnapshot')
            e.preventDefault()
        } else if (isCtrlDown && e.keyCode == eKey) {
            eventBus.$emit('clearCanvas')
            e.preventDefault()
        }
    }

    window.onkeyup = (e) => {
        if (e.keyCode == ctrlKey) {
            isCtrlDown = false
        }
    }
}