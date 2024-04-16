import { deepCopy } from '@/utils/utils'
import store from '@/store'
import { divide, multiply } from 'mathjs'

const needToChangeAttrs = ['top', 'left', 'width', 'height', 'fontSize', 'padding']
// 函数changeComponentsSizeWithScale，用于根据比例缩放组件尺寸  
export default function changeComponentsSizeWithScale(scale, snapshotData = null) {  
    // 如果传入了snapshotData，则使用snapshotData，否则使用store中存储的componentData的深拷贝  
    const componentData = snapshotData || deepCopy(store.state.componentData)  
    // 遍历每个组件  
    componentData.forEach(component => {  
        // 遍历组件的style对象的每个属性  
        Object.keys(component.style).forEach(key => {  
            // 如果该属性在需要更改的属性列表中  
            if (needToChangeAttrs.includes(key)) {  
                let newKey  
                // 如果传入了snapshotData  
                if (snapshotData) {  
                    // 根据比例计算新的属性值，并保留四位小数  
                    newKey = ((component.style[key] / snapshotData[0].lastScale) * scale).toFixed(4) - 0 
                } else {  
                    // 否则根据当前画布的比例计算新的属性值，并保留四位小数  
                    newKey = ((component.style[key] / store.state.canvasStyleData.scale) * scale).toFixed(4) - 0
                }  
                // 如果属性是'top'或'left'，则直接更新属性值  
                if (key == 'top' || key == 'left') {  
                    component.style[key] = newKey
                } else {  
                    // 否则，如果新值为0，则更新为1，否则更新为新值  
                    component.style[key] = newKey == 0 ? 1 : newKey 
                }  
            }  
        })  
    })  
  
    // 如果传入了snapshotData，则返回处理后的组件数据  
    if (snapshotData) {  
        return componentData  
    }  
  
    // 否则，更新store中的组件数据  
    store.commit('setComponentData', componentData) 
  
    // 更新画布数组后，需要重新设置当前组件，否则在改变比例后，直接拖动圆点改变组件大小不会生效  
    // 设置当前组件为更新后的组件数据中的指定索引位置的组件  
    store.commit('setCurComponent', {   
        component: componentData[store.state.curComponentIndex],   
        index: store.state.curComponentIndex,  
    })
  
    // 更新画布的比例  
    store.commit('setCanvasStyle', {  
        ...store.state.canvasStyleData,  
        scale, // 更新后的比例  
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
