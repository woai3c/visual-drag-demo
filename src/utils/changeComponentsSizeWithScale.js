import { deepCopy } from '@/utils/utils'
import store from '@/store'
import { divide, multiply } from 'mathjs'

const needToChangeAttrs = ['top', 'left', 'width', 'height', 'fontSize']
export default function changeComponentsSizeWithScale(scale) {
    const componentData = deepCopy(store.state.componentData)
    componentData.forEach(component => {
        Object.keys(component.style).forEach(key => {
            if (needToChangeAttrs.includes(key)) {
                if (key === 'fontSize' && component.style[key] === '') return

                // 根据原来的比例获取样式原来的尺寸
                // 再用原来的尺寸 * 现在的比例得出新的尺寸
                component.style[key] = format(getOriginStyle(component.style[key], store.state.canvasStyleData.scale), scale)
            }
        })
    })

    store.commit('setComponentData', componentData)
    // 更新画布数组后，需要重新设置当前组件，否则在改变比例后，直接拖动圆点改变组件大小不会生效 https://github.com/woai3c/visual-drag-demo/issues/74
    store.commit('setCurComponent', { component: componentData[store.state.curComponentIndex], index: store.state.curComponentIndex })
    store.commit('setCanvasStyle', {
        ...store.state.canvasStyleData,
        scale,
    })
}

const needToChangeAttrs2 = ['width', 'height', 'fontSize']
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
