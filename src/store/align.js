import { getComponentRotatedStyle } from '@/utils/style'

export default {
    mutations: {
        leftAlign(state) {
            // 左对齐
            if (state.areaData.components.length > 1) {
                // 找到所有组件旋转后最左的边界
                let minLeft = Math.min(
                    ...state.areaData.components.map(component => {
                        let rotatedStyle = getComponentRotatedStyle(component.style)
                        return rotatedStyle.left
                    }),
                )

                // 将所有组件的left值设置为minLeft，进行左对齐
                state.areaData.components.forEach(component => {
                    let rotatedStyle = getComponentRotatedStyle(component.style)
                    let diffX = rotatedStyle.left - minLeft
                    changeAlign(component, { left: component.style.left - diffX })
                })
            } else {
                let rotateLeft = getComponentRotatedStyle(state.curComponent.style)
                let newLeft = state.curComponent.style.left - rotateLeft.left
                changeAlign(state.curComponent, { left: newLeft })
            }
        },
        rightAlign(state) {
            if (state.areaData.components.length > 1) {
                // 找到所有组件旋转后最右的边界
                let maxRight = Math.max(
                    ...state.areaData.components.map(component => {
                        let rotatedStyle = getComponentRotatedStyle(component.style)
                        return rotatedStyle.right
                    }),
                )
        
                // 将所有组件的right值设置为maxRight，进行右对齐
                state.areaData.components.forEach(component => {
                    let rotatedStyle = getComponentRotatedStyle(component.style)
                    let diffX = maxRight - rotatedStyle.right
                    changeAlign(component, { left: component.style.left + diffX })
                })
            } else {
                let rotatedStyle = getComponentRotatedStyle(state.curComponent.style)
                let newLeft = state.curComponent.style.left - rotatedStyle.left
                let right = state.canvasStyleData.width + newLeft - rotatedStyle.width
                changeAlign(state.curComponent, { left: right })
            }
        },
        centerAlign(state) {
            if (state.areaData.components.length > 1) {
                // 找到所有组件旋转后最左和最右的边界
                let minLeft = Math.min(...state.areaData.components.map(component => getComponentRotatedStyle(component.style).left))
                let maxRight = Math.max(...state.areaData.components.map(component => getComponentRotatedStyle(component.style).right))
                let centerX = (minLeft + maxRight) / 2
        
                // 将所有组件水平居中对齐
                state.areaData.components.forEach(component => {
                    let rotatedStyle = getComponentRotatedStyle(component.style)
                    let componentCenterX = (rotatedStyle.left + rotatedStyle.right) / 2
                    let diffX = centerX - componentCenterX
                    changeAlign(component, { left: component.style.left + diffX })
                })
            } else {
                let rotatedStyle = getComponentRotatedStyle(state.curComponent.style)
                let canvasCenterX = state.canvasStyleData.width / 2
                let componentCenterX = (rotatedStyle.left + rotatedStyle.right) / 2
                let newLeft = state.curComponent.style.left + (canvasCenterX - componentCenterX)
                changeAlign(state.curComponent, { left: newLeft })
            }
        },
        topAlign(state) {
            if (state.areaData.components.length > 1) {
                // 找到所有组件旋转后最顶的边界
                let minTop = Math.min(
                    ...state.areaData.components.map(component => {
                        let rotatedStyle = getComponentRotatedStyle(component.style)
                        return rotatedStyle.top
                    }),
                )
                // 将所有组件的top值设置为minTop，进行顶部对齐
                state.areaData.components.forEach(component => {
                    let rotatedStyle = getComponentRotatedStyle(component.style)
                    let diffY = rotatedStyle.top - minTop
                    changeAlign(component, { top: component.style.top - diffY })
                })
            } else {
                let rotatedStyle = getComponentRotatedStyle(state.curComponent.style)
                let newTop = rotatedStyle.top
                changeAlign(state.curComponent, { top: newTop })
            }
        },
        bottomAlign(state) {
            if (state.areaData.components.length > 1) {
                // 找到所有组件旋转后最底的边界
                let maxBottom = Math.max(
                    ...state.areaData.components.map(component => {
                        let rotatedStyle = getComponentRotatedStyle(component.style)
                        return rotatedStyle.bottom
                    }),
                )
        
                // 将所有组件的top值调整，使其底部对齐到maxBottom
                state.areaData.components.forEach(component => {
                    let rotatedStyle = getComponentRotatedStyle(component.style)
                    let diffY = maxBottom - rotatedStyle.bottom
                    changeAlign(component, { top: component.style.top + diffY })
                })
            } else {
                let rotatedStyle = getComponentRotatedStyle(state.curComponent.style)
                let maxBottom = rotatedStyle.bottom // 定义 maxBottom
                let newTop = state.curComponent.style.top + (maxBottom - rotatedStyle.bottom)
                changeAlign(state.curComponent, { top: newTop })
            }
        },
        middleAlign(state) {
            if (state.areaData.components.length > 1) {
                // 找到所有组件旋转后最顶和最底的边界
                let minTop = Math.min(...state.areaData.components.map(component => getComponentRotatedStyle(component.style).top))
                let maxBottom = Math.max(...state.areaData.components.map(component => getComponentRotatedStyle(component.style).bottom))
                let centerY = (minTop + maxBottom) / 2
        
                // 将所有组件垂直居中对齐
                state.areaData.components.forEach(component => {
                    let rotatedStyle = getComponentRotatedStyle(component.style)
                    let componentCenterY = (rotatedStyle.top + rotatedStyle.bottom) / 2
                    let diffY = centerY - componentCenterY
                    changeAlign(component, { top: component.style.top + diffY })
                })
            } else {
                let rotatedStyle = getComponentRotatedStyle(state.curComponent.style)
                let canvasCenterY = state.canvasStyleData.height / 2
                let componentCenterY = (rotatedStyle.top + rotatedStyle.bottom) / 2
                let newTop = state.curComponent.style.top + (canvasCenterY - componentCenterY)
                changeAlign(state.curComponent, { top: newTop })
            }
        },
        verticalSpacing(state) {
            const { components } = state.areaData
        
            if (components.length > 2) {
                // 获取所有组件旋转后的最顶和最底边界
                let minTop = Math.min(...components.map(component => getComponentRotatedStyle(component.style).top))
                let maxBottom = Math.max(...components.map(component => getComponentRotatedStyle(component.style).bottom))
        
                // 计算总间距，并计算每个组件之间的平均间距
                let totalSpacing = maxBottom - minTop
                let totalHeight = components.reduce((sum, component) => {
                    let rotatedStyle = getComponentRotatedStyle(component.style)
                    return sum + (rotatedStyle.bottom - rotatedStyle.top)
                }, 0)
                let spacing = (totalSpacing - totalHeight) / (components.length - 1)
        
                // 按照顺序排列组件，并调整每个组件的位置
                let currentTop = minTop
                components.sort((a, b) => a.style.top - b.style.top)
                components.forEach((component, index) => {
                    if (index > 0) {
                        const prevRotatedStyle = getComponentRotatedStyle(components[index - 1].style)
                        currentTop += spacing + (prevRotatedStyle.bottom - prevRotatedStyle.top)
                    }
                    let rotatedStyle = getComponentRotatedStyle(component.style)
                    let diffY = rotatedStyle.top - currentTop
                    changeAlign(component, { top: component.style.top - diffY })
                })
            }
        },
        horizontalSpacing(state) {
            const { components } = state.areaData
        
            if (components.length > 2) {
                // 获取所有组件旋转后的最左和最右边界
                let minLeft = Math.min(...components.map(component => getComponentRotatedStyle(component.style).left))
                let maxRight = Math.max(...components.map(component => getComponentRotatedStyle(component.style).right))
        
                // 计算总间距，并计算每个组件之间的平均间距
                let totalSpacing = maxRight - minLeft
                let totalWidth = components.reduce((sum, component) => {
                    let rotatedStyle = getComponentRotatedStyle(component.style)
                    return sum + (rotatedStyle.right - rotatedStyle.left)
                }, 0)
                let spacing = (totalSpacing - totalWidth) / (components.length - 1)
        
                // 按照顺序排列组件，并调整每个组件的位置
                let currentLeft = minLeft
                components.sort((a, b) => a.style.left - b.style.left)
                components.forEach((component, index) => {
                    if (index > 0) {
                        const prevRotatedStyle = getComponentRotatedStyle(components[index - 1].style)
                        currentLeft += spacing + (prevRotatedStyle.right - prevRotatedStyle.left)
                    }
                    let rotatedStyle = getComponentRotatedStyle(component.style)
                    let diffX = rotatedStyle.left - currentLeft
                    changeAlign(component, { left: component.style.left - diffX })
                })
            }
        },
    },
}

function changeAlign(componentData, Align) {
    if (Array.isArray(componentData)) {
        componentData.forEach((item) => {
            changeAlign(item, Align)
        })
        return
    }
    for (let key in Align) {
        if (Align.hasOwnProperty(key)) {
            componentData.style[key] = Align[key]
        }
    }
}
