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
    deleteKey = 46, // 删除
    eKey = 69 // 清空画布

export const keycodes = [66, 67, 68, 69, 71, 80, 83, 86, 88, 89, 90]

const map = {
    [vKey]: paste,
    [cKey]: copy,
    [xKey]: cut,
    [vKey]: paste,
    [yKey]: redo,
    [zKey]: undo,
    [gKey]: compose,
    [bKey]: decompose,
    [sKey]: save,
    [pKey]: preview,
    [dKey]: deleteComponent,
    [deleteKey]: deleteComponent,
    [eKey]: clearCanvas,
}

let isCtrlDown = false
// 全局监听按键操作并执行相应命令
export function listenGlobalKeyDown() {
    window.onkeydown = (e) => {
        if (e.keyCode == ctrlKey) {
            isCtrlDown = true
        } else if (e.keyCode == deleteKey && store.state.curComponent) {
            store.commit('deleteComponent')
            store.commit('recordSnapshot')
        } else if (isCtrlDown) {
            map[e.keyCode](e)
        }
    }

    window.onkeyup = (e) => {
        if (e.keyCode == ctrlKey) {
            isCtrlDown = false
        }
    }
}

function copy() {
    store.commit('copy')
}

function paste() {
    store.commit('paste')
    store.commit('recordSnapshot')
}

function cut() {
    store.commit('cut')
}

function redo(e) {
    store.commit('redo')
    e.preventDefault()
}

function undo() {
    store.commit('undo')
}

function compose(e) {
    if (store.state.areaData.components.length) {
        store.commit('compose')
        store.commit('recordSnapshot')
        e.preventDefault()
    }
}

function decompose(e) {
    const curComponent = store.state.curComponent
    if (curComponent && !curComponent.isLock && curComponent.component == 'Group') {
        store.commit('decompose')
        store.commit('recordSnapshot')
        e.preventDefault()
    }
}

function save(e) {
    eventBus.$emit('save')
    e.preventDefault()
}

function preview(e) {
    eventBus.$emit('preview')
    e.preventDefault()
}

function deleteComponent(e) {
    if (store.state.curComponent) {
        store.commit('deleteComponent')
        store.commit('recordSnapshot')
        e.preventDefault()
    }
}

function clearCanvas(e) {
    eventBus.$emit('clearCanvas')
    e.preventDefault()
}
