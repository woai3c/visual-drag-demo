import { getComponentRotatedStyle } from '@/utils/style'

export default {
  mutations: {
    leftAlign(state) {
      // 左对齐
      if (state.areaData.components.length > 1) {
        // 找到所有组件旋转后最左的边界
        let minLeft = Math.min(
          ...state.areaData.components.map((component) => {
            let rotatedStyle = getComponentRotatedStyle(component.style)
            return rotatedStyle.left
          }),
        )

        // 将所有组件的left值设置为minLeft，进行左对齐
        state.areaData.components.forEach((component) => {
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
          ...state.areaData.components.map((component) => {
            let rotatedStyle = getComponentRotatedStyle(component.style)
            return rotatedStyle.right
          }),
        )

        // 将所有组件的right值设置为maxRight，进行右对齐
        state.areaData.components.forEach((component) => {
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
        let minLeft = Math.min(
          ...state.areaData.components.map((component) => getComponentRotatedStyle(component.style).left),
        )
        let maxRight = Math.max(
          ...state.areaData.components.map((component) => getComponentRotatedStyle(component.style).right),
        )
        let centerX = (minLeft + maxRight) / 2

        // 将所有组件水平居中对齐
        state.areaData.components.forEach((component) => {
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
          ...state.areaData.components.map((component) => {
            let rotatedStyle = getComponentRotatedStyle(component.style)
            return rotatedStyle.top
          }),
        )
        // 将所有组件的top值设置为minTop，进行顶部对齐
        state.areaData.components.forEach((component) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          let diffY = rotatedStyle.top - minTop
          changeAlign(component, { top: component.style.top - diffY })
        })
      } else {
        let rotatedStyle = getComponentRotatedStyle(state.curComponent.style)
        let newTop = state.curComponent.style.top - rotatedStyle.top
        changeAlign(state.curComponent, { top: newTop })
      }
    },
    bottomAlign(state) {
      if (state.areaData.components.length > 1) {
        // 找到所有组件旋转后最底的边界
        let maxBottom = Math.max(
          ...state.areaData.components.map((component) => {
            let rotatedStyle = getComponentRotatedStyle(component.style)
            return rotatedStyle.bottom
          }),
        )

        // 将所有组件的top值调整，使其底部对齐到maxBottom
        state.areaData.components.forEach((component) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          let diffY = maxBottom - rotatedStyle.bottom
          changeAlign(component, { top: component.style.top + diffY })
        })
      } else {
        let rotatedStyle = getComponentRotatedStyle(state.curComponent.style)
        let newTop = state.curComponent.style.top - rotatedStyle.top
        let top = state.canvasStyleData.height + newTop - rotatedStyle.height
        changeAlign(state.curComponent, { top })
      }
    },
    middleAlign(state) {
      if (state.areaData.components.length > 1) {
        // 找到所有组件旋转后最顶和最底的边界
        let minTop = Math.min(
          ...state.areaData.components.map((component) => getComponentRotatedStyle(component.style).top),
        )
        let maxBottom = Math.max(
          ...state.areaData.components.map((component) => getComponentRotatedStyle(component.style).bottom),
        )
        let centerY = (minTop + maxBottom) / 2

        // 将所有组件垂直居中对齐
        state.areaData.components.forEach((component) => {
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
        // 获取最上面的组件的 top 值和最下面的组件的 bottom 值
        let totalHeight = 0
        components.forEach((component) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          totalHeight += rotatedStyle.height
        }) // 获取所有组件的高度总和

        const containerHeight = state.areaData.style.height // 获取容器高度
        const availableSpace = containerHeight - totalHeight // 获取可用高度
        const spacing = Math.floor(availableSpace / (components.length - 1)) // 去除小数点后取整

        components.sort((a, b) => getComponentRotatedStyle(a.style).top - getComponentRotatedStyle(b.style).top) // 按照 top 值排序

        let currentTop = 0
        components.forEach((component) => {
          changeAlign(component, { top: state.areaData.style.top + currentTop })
          currentTop += spacing + getComponentRotatedStyle(component.style).height
        })
      }
    },
    horizontalSpacing(state) {
      const { components } = state.areaData
      if (components.length > 2) {
        // 获取所有组件的宽度总和
        let totalWidth = 0
        components.forEach((component) => {
          let rotatedStyle = getComponentRotatedStyle(component.style)
          totalWidth += rotatedStyle.width
        })

        const containerWidth = state.areaData.style.width // 获取容器宽度
        const availableSpace = containerWidth - totalWidth // 获取可用宽度
        const spacing = Math.floor(availableSpace / (components.length - 1)) // 去除小数点后取整
        components.sort((a, b) => getComponentRotatedStyle(a.style).left - getComponentRotatedStyle(b.style).left) // 按照 left 值排序

        let currentLeft = 0
        components.forEach((component) => {
          component.style.left = state.areaData.style.left + currentLeft
          currentLeft += spacing + getComponentRotatedStyle(component.style).width
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
