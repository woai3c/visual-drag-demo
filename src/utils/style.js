import { sin, cos, mod360 } from '@/utils/translate'
import { $ } from '@/utils/utils'

export function getStyle(style, filter = []) {
    const needUnit = [
        'fontSize',
        'width',
        'height',
        'top',
        'left',
        'borderWidth',
        'letterSpacing',
        'borderRadius',
    ]

    const result = {}
    Object.keys(style).forEach(key => {
        if (!filter.includes(key)) {
            if (key != 'rotate') {
                result[key] = style[key]

                if (needUnit.includes(key)) {
                    result[key] += 'px'
                }
            } else {
                result.transform = key + '(' + style[key] + 'deg)'
            }
        }
    })

    return result
}

export function getComponentRotatedStyle(style) {
    style = { ...style }
    if (style.rotate != 0) {
        const newWidth = style.width * cos(style.rotate) + style.height * sin(style.rotate)
        const diffX = (style.width - newWidth) / 2 // 旋转后范围变小是正值，变大是负值
        style.left += diffX
        style.right = style.left + newWidth

        const newHeight = style.height * cos(style.rotate) + style.width * sin(style.rotate)
        const diffY = (newHeight - style.height) / 2 // 始终是正
        style.top -= diffY
        style.bottom = style.top + newHeight

        style.width = newWidth
        style.height = newHeight
    } else {
        style.bottom = style.top + style.height
        style.right = style.left + style.width
    }

    return style
}

export function decomposeComponent(component, editorRect, parentStyle) {
    const componentRect = $(`#component${component.id}`).getBoundingClientRect()
    // 获取元素的中心点坐标
    const center = {
        x: componentRect.left - editorRect.left + componentRect.width / 2,
        y: componentRect.top - editorRect.top + componentRect.height / 2,
    }

    component.style.rotate = mod360(component.style.rotate + parentStyle.rotate)
    component.style.width = parseFloat(component.groupStyle.width) / 100 * parentStyle.width
    component.style.height = parseFloat(component.groupStyle.height) / 100 * parentStyle.height
    // 计算出元素新的 top left 坐标
    component.style.left = center.x - component.style.width / 2
    component.style.top = center.y - component.style.height / 2
    component.groupStyle = {}
}