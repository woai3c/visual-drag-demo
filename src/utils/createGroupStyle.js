import { getStyle } from '@/utils/style'
import { toPercent } from '@/utils/translate'

export default function createGroupStyle(groupComponent) {
    const parentStyle = groupComponent.style
    groupComponent.propValue.forEach((component) => {
        // component.groupStyle 的 top left 是相对于 group 组件的位置
        // 如果已存在 component.groupStyle，说明已经计算过一次了。不需要再次计算
        if (!Object.keys(component.groupStyle).length) {
            const style = { ...component.style }
            component.groupStyle = getStyle(style)
            component.groupStyle.left = toPercent((style.left - parentStyle.left) / parentStyle.width)
            component.groupStyle.top = toPercent((style.top - parentStyle.top) / parentStyle.height)
            component.groupStyle.width = toPercent(style.width / parentStyle.width)
            component.groupStyle.height = toPercent(style.height / parentStyle.height)
        }
    })
}
