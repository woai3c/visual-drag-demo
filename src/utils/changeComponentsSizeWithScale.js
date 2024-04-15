import { deepCopy } from '@/utils/utils'
import store from '@/store'
import { divide, multiply } from 'mathjs'

const needToChangeAttrs = ['top', 'left', 'width', 'height', 'fontSize', 'padding']
export default function changeComponentsSizeWithScale(scale, snapshotData = null) {
    const componentData = snapshotData || deepCopy(store.state.componentData)
    console.log(componentData)
    componentData.forEach(component => {
        Object.keys(component.style).forEach(key => {
            if (needToChangeAttrs.includes(key)) {
                let newKey
                if (snapshotData) {
                    newKey = ((component.style[key] / snapshotData[0].lastScale) * scale).toFixed(4) - 0
                } else {
                    newKey = ((component.style[key] / store.state.canvasStyleData.scale) * scale).toFixed(4) - 0
                }
                if (key == 'top' || key == 'left') {
                    component.style[key] = newKey
                } else {
                    component.style[key] = newKey == 0 ? 1 : newKey
                }
            }
        })
    })
    if (snapshotData) {
        return componentData
    }
    store.commit('setComponentData', componentData)
    // 更新画布数组后，需要重新设置当前组件，否则在改变比例后，直接拖动圆点改变组件大小不会生效 https://github.com/woai3c/visual-drag-demo/issues/74
    store.commit('setCurComponent', { component: componentData[store.state.curComponentIndex], index: store.state.curComponentIndex })
    store.commit('setCanvasStyle', {
        ...store.state.canvasStyleData,
        scale,
    })
}

const needToChangeAttrs2 = ['width', 'height', 'fontSize', 'padding']
export function changeComponentSizeWithScale(component) {
    Object.keys(component.style).forEach(key => {
        if (needToChangeAttrs2.includes(key)) {
            if (key === 'fontSize' && component.style[key] === '') return

            component.style[key] = format(component.style[key], store.state.canvasStyleData.scale)
        }
    })
}

function format(value, scale) {
    return multiply(value, divide(parseFloat(scale), 100))
}

function getOriginStyle(value, scale) {
    return divide(value, divide(parseFloat(scale), 100))
}
