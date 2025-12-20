/**
 * 高级导出工具 - 将低代码组件数据转换为HTML或Vue文件
 * 支持所有组件类型：VText, VButton, Picture, VTable, VChart, RectShape, CircleShape, LineShape, Group, SVG组件等
 */

/**
 * 将组件数据转换为HTML文件
 * @param {Array} componentData - 组件数据数组
 * @param {Object} canvasStyleData - 画布样式数据
 * @returns {String} 生成的HTML字符串
 */
export function generateHTML(componentData, canvasStyleData) {
  // 生成CSS样式
  const cssStyles = generateCSS(componentData, canvasStyleData)

  // 生成HTML结构
  const htmlElements = generateHTMLStructure(componentData)

  // 生成必要的JS代码
  const jsCode = generateHTMLJS(componentData)

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>导出的页面</title>
    <script src="https://lib.baomitu.com/echarts/5.4.2/echarts.min.js"></script>
    <style>
        ${cssStyles}
    </style>
</head>
<body>
    <div class="canvas-container">
        <div class="canvas" style="width: ${canvasStyleData.width}px; height: ${canvasStyleData.height}px; background-color: ${processColorValue(canvasStyleData.backgroundColor || canvasStyleData.background) || '#ffffff'};">
            ${htmlElements}
        </div>
    </div>
    
    <script>
        ${jsCode}
    </script>
</body>
</html>`
}

/**
 * 将组件数据转换为Vue单文件组件
 * @param {Array} componentData - 组件数据数组
 * @param {Object} canvasStyleData - 画布样式数据
 * @returns {String} 生成的Vue单文件组件字符串
 */
export function generateVueComponent(componentData, canvasStyleData) {
  // 生成Vue模板
  const template = generateVueTemplate(componentData)

  // 生成Vue脚本
  const script = generateVueScript(componentData, canvasStyleData)

  // 生成样式
  const style = generateVueStyle(componentData)

  return `<template>
${template}
</template>

<script>
${script}
</script>

<style scoped>
${style}
</style>`
}

/**
 * 生成HTML结构
 */
function generateHTMLStructure(componentData) {
  return componentData
    .map((component) => {
      return generateHTMLElement(component)
    })
    .join('\n')
}

/**
 * 处理图片URL，确保在导出文件中可以正常显示
 * @param {String} url - 原始URL
 * @returns {String} 处理后的URL
 */
function processImageUrl(url) {
  if (!url) return ''

  // 如果是绝对路径或data URL，直接返回
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url
  }

  // 尝试移除webpack生成的hash值 (如 .07a15c19.)
  // 匹配模式：.加8位hex字符.
  const hashRegex = /\.[a-f0-9]{8}\./
  if (hashRegex.test(url)) {
    url = url.replace(hashRegex, '.')
  }

  // 处理相对路径
  // 在Vue项目中，如果图片是在src/assets目录下，webpack会处理
  // 但在导出的HTML中，需要确保图片路径正确
  if (url.startsWith('img/')) {
    // 处理img/开头的路径，可能是title.jpg这类资源
    // 在导出的HTML中，需要从正确的位置加载图片
    // 检查是否是已知的资源文件
    if (url.includes('title.')) {
      // 特殊处理title图片，保持原有逻辑，使用相对路径
      return `./assets/${url.replace('img/', '')}`
    }
    return `./img/${url.substring(4)}`
  }

  // 移除开头的 / (如果是绝对路径转相对路径)
  if (url.startsWith('/')) {
    url = url.substring(1)
  }

  // 处理其他相对路径，加上 ./ 前缀
  if (!url.startsWith('./') && !url.startsWith('../')) {
    return `./${url}`
  }

  return url
}

/**
 * 处理颜色值，支持RGBA等格式
 * @param {String|Object} color - 颜色值
 * @returns {String} 处理后的颜色值
 */
function processColorValue(color) {
  if (!color) return ''

  // 如果是字符串，直接返回
  if (typeof color === 'string') {
    return color
  }

  // 如果是对象，尝试转换为字符串
  if (typeof color === 'object') {
    return JSON.stringify(color)
  }

  return String(color)
}

/**
 * 生成HTML所需的JavaScript代码
 */
function generateHTMLJS(componentData) {
  let jsCode = `
// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有图表
    initCharts();
    
    // 初始化动画
    initAnimations();
    
    // 添加按钮点击事件
    const buttons = document.querySelectorAll('.v-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('按钮被点击了:', this);
            // 这里可以添加更多自定义逻辑
        });
    });
    
    // 添加图片翻转功能
    initImageFlip();
});

// 初始化动画
function initAnimations() {
`

  // 为每个有动画的组件添加动画代码
  componentData.forEach((component) => {
    if (component.animations && component.animations.length > 0) {
      const animation = component.animations[0] // 获取第一个动画
      const elementId = `component-${component.id}`
      const animationTime = animation.animationTime || 1

      jsCode += `
    // 为组件 ${component.id} 添加动画: ${animation.value}
    const element${component.id} = document.getElementById('${elementId}');
    if (element${component.id}) {
        element${component.id}.classList.add('animated');
        element${component.id}.classList.add('${animation.value}');
        element${component.id}.style.animationDuration = '${animationTime}s';
        
        // 动画结束后保留动画结果
        element${component.id}.style.animationFillMode = 'both';
        
        // 如果需要循环播放
        // element${component.id}.classList.add('infinite');
    }
`
    }
  })

  jsCode += `
}

// 初始化所有图表
function initCharts() {
`

  // 为每个图表组件生成初始化代码
  componentData.forEach((component) => {
    if (component.component === 'VChart' && component.propValue && component.propValue.option) {
      const chartId = `chart-${component.id}`
      const chartOptions = JSON.stringify(component.propValue.option)
      jsCode += `
    // 初始化图表: ${chartId}
    const chart${component.id} = echarts.init(document.getElementById('${chartId}'));
    chart${component.id}.setOption(${chartOptions});
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart${component.id}.resize();
    });
`
    }
  })

  jsCode += `
}

// 初始化图片翻转功能
function initImageFlip() {
`

  // 为每个图片组件生成翻转处理代码
  componentData.forEach((component) => {
    if (component.component === 'Picture' && component.propValue.flip) {
      const imageId = `img-${component.id}`
      const flipVertical = component.propValue.flip.vertical
      const flipHorizontal = component.propValue.flip.horizontal

      if (flipVertical || flipHorizontal) {
        jsCode += `
    // 处理图片翻转: ${imageId}
    const img${component.id} = document.getElementById('${imageId}');
    if (img${component.id}) {
        const scaleX = ${flipHorizontal ? -1 : 1};
        const scaleY = ${flipVertical ? -1 : 1};
        img${component.id}.style.transform = 'scaleX(' + scaleX + ') scaleY(' + scaleY + ')';
    }
`
      }
    }
  })

  jsCode += `
}
`

  return jsCode
}

/**
 * 生成CSS样式
 */
function generateCSS(componentData, canvasStyleData) {
  // 基础样式
  let css = `
/* 画布容器样式 */
.canvas-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    background: #f5f5f5;
}

/* 画布样式 */
.canvas {
    position: relative;
    width: ${canvasStyleData.width}px;
    height: ${canvasStyleData.height}px;
    background-color: ${processColorValue(canvasStyleData.backgroundColor || canvasStyleData.background) || '#ffffff'};
    border: 1px solid #ddd;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    /* 同步编辑器默认属性 */
    font-size: ${canvasStyleData.fontSize}px;
    color: ${processColorValue(canvasStyleData.color) || '#000'};
    opacity: ${canvasStyleData.opacity};
    font-family: Inter, system-ui, -apple-system, sans-serif;
}

/* 组件通用样式 */
.component {
    position: absolute;
    box-sizing: border-box;
    overflow: hidden; /* 防止内容溢出导致重叠 */
}

/* 文本组件样式 */
.v-text {
    width: 100%;
    height: 100%;
    display: table;
    outline: none;
}

.v-text div {
    display: table-cell;
    width: 100%;
    height: 100%;
    outline: none;
    word-break: break-all;
    box-sizing: border-box;
    line-height: 1.5; /* 显式设置默认行高以防重叠 */
}

/* 按钮组件样式 */
.v-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    width: 100%;
    height: 100%;
    font-size: 14px;
    appearance: none;
    padding: 12px 20px;
}

.v-button:hover {
    background-color: #ecf5ff;
    color: #3a8ee6;
    border-color: #c6e2ff;
}

.v-button:active {
    color: #3a8ee6;
    border-color: #3a8ee6;
    outline: 0;
}

/* 图片组件样式 */
.picture-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.picture-container img {
    width: 100%;
    height: 100%;
}

/* 表格组件样式 */
.v-table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    word-break: break-all;
    word-wrap: break-word;
}

.v-table td {
    border: 1px solid #ebeef5;
    padding: 10px;
    height: 40px;
    width: 60px;
}

.v-table .bold {
    font-weight: bold;
}

.v-table .stripe {
    background-color: #fafafa;
}

/* 图表容器样式 */
.chart-container {
    width: 100%;
    height: 100%;
}

/* 形状组件样式 */
.rect-shape {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.circle-shape {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
}

.line-shape {
    width: 100%;
    height: 100%;
    background-color: #000;
}

/* SVG组件样式 */
.svg-shape {
    width: 100%;
    height: 100%;
}

/* 组合组件样式 */
.group-container {
    width: 100%;
    height: 100%;
}

.group-container > div {
    position: relative;
    width: 100%;
    height: 100%;
}

.group-component {
    position: absolute;
}

/* 动画通用类 */
.animated {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

.animated.infinite {
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
}

/* 渐显动画 */
@-webkit-keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.fadeIn {
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
}

/* 向右长距进入动画 */
@-webkit-keyframes fadeInRightBig {
    from {
        opacity: 0;
        -webkit-transform: translate3d(2000px, 0, 0);
        transform: translate3d(2000px, 0, 0);
    }
    to {
        opacity: 1;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}

@keyframes fadeInRightBig {
    from {
        opacity: 0;
        -webkit-transform: translate3d(2000px, 0, 0);
        transform: translate3d(2000px, 0, 0);
    }
    to {
        opacity: 1;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
}

.fadeInRightBig {
    -webkit-animation-name: fadeInRightBig;
    animation-name: fadeInRightBig;
}
`

  // 为每个组件生成特定样式
  componentData.forEach((component) => {
    const selector = `.component-${component.id}`
    const style = component.style

    // 构建组件样式字符串，避免嵌套模板字符串
    let componentStyle = `
/* 组件 ${component.id} 样式 */
${selector} {
    position: absolute;
    top: ${style.top}px;
    left: ${style.left}px;
    width: ${style.width}px;
    height: ${style.height}px;`

    if (style.fontSize) {
      componentStyle += `
    font-size: ${style.fontSize}px;`
    }

    if (style.fontWeight) {
      componentStyle += `
    font-weight: ${style.fontWeight};`
    }

    if (style.color) {
      componentStyle += `
    color: ${processColorValue(style.color)};`
    }

    if (style.backgroundColor) {
      componentStyle += `
    background-color: ${processColorValue(style.backgroundColor)};`
    }

    if (style.borderWidth) {
      componentStyle += `
    border: ${style.borderWidth}px solid ${style.borderColor || '#000'};`
    }

    if (style.borderRadius) {
      componentStyle += `
    border-radius: ${style.borderRadius}px;`
    }

    if (style.padding) {
      componentStyle += `
    padding: ${style.padding}px;`
    }

    if (style.textAlign) {
      componentStyle += `
    text-align: ${style.textAlign};`
    }

    if (style.rotate) {
      componentStyle += `
    transform: rotate(${style.rotate}deg);`
    }

    if (style.opacity) {
      componentStyle += `
    opacity: ${style.opacity};`
    }

    if (style.lineHeight) {
      componentStyle += `
    line-height: ${style.lineHeight};`
    }

    if (style.letterSpacing) {
      componentStyle += `
    letter-spacing: ${style.letterSpacing}px;`
    }

    if (style.verticalAlign) {
      componentStyle += `
    vertical-align: ${style.verticalAlign};`
    }

    componentStyle += `
    box-sizing: border-box;
}
`

    css += componentStyle

    // 为按钮组件添加特定样式
    if (component.component === 'VButton') {
      let buttonStyle = `
${selector} .v-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;`

      if (style.backgroundColor) {
        buttonStyle += `
  background: ${processColorValue(style.backgroundColor)};`
      } else {
        buttonStyle += `
  background: #fff;`
      }

      if (style.borderWidth) {
        buttonStyle += `
  border: ${style.borderWidth}px solid ${style.borderColor || '#000'};`
      } else {
        buttonStyle += `
  border: 1px solid #dcdfe6;`
      }

      if (style.color) {
        buttonStyle += `
  color: ${processColorValue(style.color)};`
      } else {
        buttonStyle += `
  color: #606266;`
      }

      buttonStyle += `
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;`

      if (style.fontWeight) {
        buttonStyle += `
  font-weight: ${style.fontWeight};`
      } else {
        buttonStyle += `
  font-weight: 500;`
      }

      buttonStyle += `
  width: 100%;
  height: 100%;`

      if (style.fontSize) {
        buttonStyle += `
  font-size: ${style.fontSize}px;`
      } else {
        buttonStyle += `
  font-size: 14px;`
      }

      buttonStyle += `
  appearance: none;
  padding: 12px 20px;`

      if (style.borderRadius) {
        buttonStyle += `
  border-radius: ${style.borderRadius}px;`
      }

      buttonStyle += `
}
`
      css += buttonStyle
    }
  })

  return css
}

/**
 * 生成单个组件的HTML元素
 */
function generateHTMLElement(component) {
  const id = component.id
  let htmlContent = ''

  switch (component.component) {
    case 'VText': {
      const padding = (component.style && component.style.padding) || 0
      const verticalAlign = (component.style && component.style.verticalAlign) || 'middle'
      htmlContent = `<div class="v-text">
            <div style="padding: ${padding}px; vertical-align: ${verticalAlign};">${component.propValue || ''}</div>
        </div>`
      break
    }

    case 'VButton':
      htmlContent = `<button class="v-button">${component.propValue || '按钮'}</button>`
      break

    case 'Picture': {
      // 使用处理后的图片URL，翻转由JS处理
      const imageUrl = processImageUrl(component.propValue.url || '')
      // 如果图片路径以img/开头，可能是相对路径，需要处理
      const finalImageUrl = imageUrl.startsWith('img/') && !imageUrl.startsWith('./img/') ? `./${imageUrl}` : imageUrl
      htmlContent = `<div class="picture-container">
            <img id="img-${id}" src="${finalImageUrl}" alt="图片" onerror="this.onerror=null;this.src='./assets/placeholder.png';" />
        </div>`
      break
    }

    case 'RectShape':
      htmlContent = `<div class="rect-shape">${component.propValue || ''}</div>`
      break

    case 'CircleShape':
      htmlContent = `<div class="circle-shape">${component.propValue || ''}</div>`
      break

    case 'LineShape':
      htmlContent = `<div class="line-shape">${component.propValue || ''}</div>`
      break

    case 'VTable':
      // 完整的表格结构
      if (component.propValue && component.propValue.data && Array.isArray(component.propValue.data)) {
        const tableData = component.propValue.data
        const tableRows = tableData
          .map((row, index) => {
            const isHeader = index === 0 && component.propValue.thBold
            const isStripe = component.propValue.stripe && index % 2 === 1
            const cells = row.map((cell) => `<td>${cell}</td>`).join('')
            return `<tr class="${isHeader ? 'bold' : ''} ${isStripe ? 'stripe' : ''}">${cells}</tr>`
          })
          .join('')

        htmlContent = `<table class="v-table">
            <tbody>${tableRows}</tbody>
        </table>`
      } else {
        // 如果没有数据，生成一个简单的表格
        htmlContent = `<table class="v-table">
            <tbody>
                <tr class="bold">
                    <td>表头1</td>
                    <td>表头2</td>
                </tr>
                <tr>
                    <td>数据1</td>
                    <td>数据2</td>
                </tr>
            </tbody>
        </table>`
      }
      break

    case 'VChart':
      htmlContent = `<div id="chart-${id}" class="chart-container"></div>`
      break

    case 'Group':
      // 处理组合组件
      if (component.propValue && Array.isArray(component.propValue)) {
        const groupComponents = component.propValue
          .map((child) =>
            generateHTMLElement({
              ...child,
              id: `${id}-${child.id}`, // 确保子组件ID唯一
            }),
          )
          .join('\n')

        htmlContent = `<div class="group-container">
            <div>${groupComponents}</div>
        </div>`
      } else {
        htmlContent = `<div class="group-container">
            <div></div>
        </div>`
      }
      break

    default:
      // 处理SVG组件
      if (component.component && component.component.startsWith('SVG')) {
        htmlContent = `<div class="svg-shape">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="${component.style ? component.style.backgroundColor || '#000' : '#000'}" />
            </svg>
        </div>`
      } else {
        htmlContent = `<div class="unknown-component">未知组件: ${component.component || ''}</div>`
      }
  }

  return `<div id="component-${id}" class="component component-${id}" data-component="${component.component}">${htmlContent}</div>`
}

/**
 * 生成Vue模板
 */
function generateVueTemplate(componentData) {
  const elements = componentData
    .map((component) => {
      return generateVueElement(component)
    })
    .join('\n        ')

  return `  <div class="canvas-container">
    <div 
      class="canvas" 
      :style="canvasStyle"
    >
        ${elements}
    </div>
  </div>`
}

/**
 * 生成Vue脚本
 */
function generateVueScript(componentData, canvasStyleData) {
  // 检查是否有图表组件
  const hasCharts = componentData.some((comp) => comp.component === 'VChart')

  // 基础脚本
  let script = hasCharts ? "import * as echarts from 'echarts'\n\n" : ''
  script += `  export default {
    name: 'GeneratedPage',
    data() {
      return {
        canvasStyle: {
          width: '${canvasStyleData.width}px',
          height: '${canvasStyleData.height}px',
          backgroundColor: '${processColorValue(canvasStyleData.backgroundColor || canvasStyleData.background) || '#ffffff'}'
        },
        charts: {}
      }
    },
    mounted() {
      // 初始化组件
      this.initComponents();
    },
    methods: {
      initComponents() {
        this.initCharts();
        this.initImageFlips();
        this.initAnimations();
      },
`

  // 添加图表初始化方法
  if (hasCharts) {
    script += `
      // 初始化图表
      initCharts() {
        this.$nextTick(() => {`

    componentData.forEach((component) => {
      if (component.component === 'VChart' && component.propValue && component.propValue.option) {
        script += `
          // 初始化图表: ${component.id}
          const chartDom = this.$refs['chart-${component.id}'];
          if (chartDom && typeof echarts !== 'undefined') {
            const chart = echarts.init(chartDom);
            chart.setOption(${JSON.stringify(component.propValue.option)});
            this.charts['${component.id}'] = chart;
            
            // 响应窗口大小变化
            window.addEventListener('resize', () => {
              chart.resize();
            });
          }`
      }
    })

    script += `
        });
      },`
  }

  // 添加图片翻转初始化方法
  script += `
      // 初始化图片翻转
      initImageFlips() {`

  componentData.forEach((component) => {
    if (component.component === 'Picture' && component.propValue.flip) {
      const flipVertical = component.propValue.flip.vertical
      const flipHorizontal = component.propValue.flip.horizontal

      if (flipVertical || flipHorizontal) {
        script += `
        // 处理图片翻转: ${component.id}
        this.$nextTick(() => {
          const img = this.$refs['img-${component.id}'];
          if (img) {
            const scaleX = ${flipHorizontal ? -1 : 1};
            const scaleY = ${flipVertical ? -1 : 1};
            img.style.transform = 'scaleX(' + scaleX + ') scaleY(' + scaleY + ')';
          }
        });`
      }
    }
  })

  script += `
      },
      
      // 初始化动画
      initAnimations() {`

  componentData.forEach((component) => {
    if (component.animations && component.animations.length > 0) {
      const animation = component.animations[0] // 获取第一个动画
      const animationTime = animation.animationTime || 1

      script += `
        // 为组件 ${component.id} 添加动画
        this.$nextTick(() => {
          const element = document.querySelector('.component-${component.id}');
          if (element) {
            element.classList.add('animated');
            element.classList.add('${animation.value}');
            element.style.animationDuration = '${animationTime}s';
            // 动画结束后保留动画结果
            element.style.animationFillMode = 'both';
          }
        });`
    }
  })

  script += `
      },
      
      // 按钮点击事件处理
      handleButtonClick(event, componentId) {
        console.log('按钮被点击:', componentId);
        // 这里可以添加更多自定义逻辑
      }
    }`

  // 如果有图表组件，添加beforeDestroy钩子来清理图表
  if (hasCharts) {
    script += `,
    beforeDestroy() {
      // 清理图表实例
      Object.keys(this.charts).forEach(key => {
        if (this.charts[key] && typeof this.charts[key].dispose === 'function') {
          this.charts[key].dispose();
        }
      });
      this.charts = {};
    }`
  }

  script += `
  }`

  return script
}

/**
 * 生成Vue样式
 */
function generateVueStyle(componentData) {
  let css = `/* 画布容器样式 */
.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background: #f5f5f5;
}

/* 画布样式 */
.canvas {
  position: relative;
  border: 1px solid #ddd;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 组件通用样式 */
.component {
  position: absolute;
  box-sizing: border-box;
}

/* 文本组件样式 */
.v-text {
  width: 100%;
  height: 100%;
  display: table;
  outline: none;
  word-break: break-all;
}

.v-text div {
  display: table-cell;
  width: 100%;
  height: 100%;
  outline: none;
}

/* 按钮组件样式 */
.v-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  width: 100%;
  height: 100%;
  font-size: 14px;
  appearance: none;
  padding: 12px 20px;
}

.v-button:hover {
  background-color: #ecf5ff;
  color: #3a8ee6;
  border-color: #c6e2ff;
}

.v-button:active {
  color: #3a8ee6;
  border-color: #3a8ee6;
  outline: 0;
}

/* 图片组件样式 */
.picture-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.picture-container img {
  width: 100%;
  height: 100%;
}

/* 表格组件样式 */
.v-table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  word-break: break-all;
  word-wrap: break-word;
}

.v-table td {
  border: 1px solid #ebeef5;
  padding: 10px;
  height: 40px;
  width: 60px;
}

.v-table .bold {
  font-weight: bold;
}

.v-table .stripe {
  background-color: #fafafa;
}

/* 图表容器样式 */
.chart-container {
  width: 100%;
  height: 100%;
}

/* 形状组件样式 */
.rect-shape {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circle-shape {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.line-shape {
  width: 100%;
  height: 100%;
  background-color: #000;
}

/* SVG组件样式 */
.svg-shape {
  width: 100%;
  height: 100%;
}

/* 组合组件样式 */
.group-container {
  width: 100%;
  height: 100%;
}

.group-container > div {
  position: relative;
  width: 100%;
  height: 100%;
}

.group-component {
  position: absolute;
}

/* 动画通用类 */
.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.animated.infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

/* 渐显动画 */
@-webkit-keyframes fadeIn {
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
}

@keyframes fadeIn {
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
}

.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}

/* 向右长距进入动画 */
@-webkit-keyframes fadeInRightBig {
  from {
      opacity: 0;
      -webkit-transform: translate3d(2000px, 0, 0);
      transform: translate3d(2000px, 0, 0);
  }
  to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
  }
}

@keyframes fadeInRightBig {
  from {
      opacity: 0;
      -webkit-transform: translate3d(2000px, 0, 0);
      transform: translate3d(2000px, 0, 0);
  }
  to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
  }
}

.fadeInRightBig {
  -webkit-animation-name: fadeInRightBig;
  animation-name: fadeInRightBig;
}
`

  // 为每个组件生成特定样式
  componentData.forEach((component) => {
    const selector = `.component-${component.id}`
    const style = component.style

    // 构建组件样式字符串，避免嵌套模板字符串
    let componentStyle = `
/* 组件 ${component.id} 样式 */
${selector} {
  position: absolute;
  top: ${style.top}px;
  left: ${style.left}px;
  width: ${style.width}px;
  height: ${style.height}px;`

    if (style.fontSize) {
      componentStyle += `
  font-size: ${style.fontSize}px;`
    }

    if (style.fontWeight) {
      componentStyle += `
  font-weight: ${style.fontWeight};`
    }

    if (style.color) {
      componentStyle += `
  color: ${processColorValue(style.color)};`
    }

    if (style.backgroundColor) {
      componentStyle += `
  background-color: ${processColorValue(style.backgroundColor)};`
    }

    if (style.borderWidth) {
      componentStyle += `
  border: ${style.borderWidth}px solid ${style.borderColor || '#000'};`
    }

    if (style.borderRadius) {
      componentStyle += `
  border-radius: ${style.borderRadius}px;`
    }

    if (style.padding) {
      componentStyle += `
  padding: ${style.padding}px;`
    }

    if (style.textAlign) {
      componentStyle += `
  text-align: ${style.textAlign};`
    }

    if (style.rotate) {
      componentStyle += `
  transform: rotate(${style.rotate}deg);`
    }

    if (style.opacity) {
      componentStyle += `
  opacity: ${style.opacity};`
    }

    if (style.lineHeight) {
      componentStyle += `
  line-height: ${style.lineHeight};`
    }

    if (style.letterSpacing) {
      componentStyle += `
  letter-spacing: ${style.letterSpacing}px;`
    }

    if (style.verticalAlign) {
      componentStyle += `
  vertical-align: ${style.verticalAlign};`
    }

    componentStyle += `
  box-sizing: border-box;
}
`

    css += componentStyle

    // 为按钮组件添加特定样式
    if (component.component === 'VButton') {
      let buttonStyle = `
${selector} .v-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;`

      if (style.backgroundColor) {
        buttonStyle += `
  background: ${processColorValue(style.backgroundColor)};`
      } else {
        buttonStyle += `
  background: #fff;`
      }

      if (style.borderWidth) {
        buttonStyle += `
  border: ${style.borderWidth}px solid ${style.borderColor || '#000'};`
      } else {
        buttonStyle += `
  border: 1px solid #dcdfe6;`
      }

      if (style.color) {
        buttonStyle += `
  color: ${processColorValue(style.color)};`
      } else {
        buttonStyle += `
  color: #606266;`
      }

      buttonStyle += `
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  transition: 0.1s;`

      if (style.fontWeight) {
        buttonStyle += `
  font-weight: ${style.fontWeight};`
      } else {
        buttonStyle += `
  font-weight: 500;`
      }

      buttonStyle += `
  width: 100%;
  height: 100%;`

      if (style.fontSize) {
        buttonStyle += `
  font-size: ${style.fontSize}px;`
      } else {
        buttonStyle += `
  font-size: 14px;`
      }

      buttonStyle += `
  appearance: none;
  padding: 12px 20px;`

      if (style.borderRadius) {
        buttonStyle += `
  border-radius: ${style.borderRadius}px;`
      }

      buttonStyle += `
}
`
      css += buttonStyle
    }
  })

  return css
}

/**
 * 生成单个组件的Vue元素
 */
function generateVueElement(component) {
  const id = component.id
  let elementContent = ''

  switch (component.component) {
    case 'VText': {
      const paddingValue = (component.style && component.style.padding) || 0
      const vAlignValue = (component.style && component.style.verticalAlign) || 'middle'
      elementContent = `<div class="v-text">
          <div style="padding: ${paddingValue}px; vertical-align: ${vAlignValue};">${component.propValue || ''}</div>
        </div>`
      break
    }

    case 'VButton':
      elementContent = `<button 
        class="v-button" 
        @click="handleButtonClick($event, '${id}')"
      >${component.propValue || '按钮'}</button>`
      break

    case 'Picture': {
      const imageUrl = processImageUrl(component.propValue.url || '')
      elementContent = `<div class="picture-container">
          <img ref="img-${id}" :src="'${imageUrl}'" alt="图片" @error="this.src='./assets/placeholder.png'" />
        </div>`
      break
    }

    case 'RectShape':
      elementContent = `<div class="rect-shape">${component.propValue || ''}</div>`
      break

    case 'CircleShape':
      elementContent = `<div class="circle-shape">${component.propValue || ''}</div>`
      break

    case 'LineShape':
      elementContent = `<div class="line-shape">${component.propValue || ''}</div>`
      break

    case 'VTable':
      // 完整的表格结构
      if (component.propValue && component.propValue.data && Array.isArray(component.propValue.data)) {
        const tableData = component.propValue.data
        const tableRows = tableData
          .map((row, index) => {
            const isHeader = index === 0 && component.propValue.thBold
            const isStripe = component.propValue.stripe && index % 2 === 1
            const cells = row.map((cell) => `<td>${cell}</td>`).join('')
            return `<tr class="${isHeader ? 'bold' : ''} ${isStripe ? 'stripe' : ''}">${cells}</tr>`
          })
          .join('')

        elementContent = `<table class="v-table">
            <tbody>${tableRows}</tbody>
        </table>`
      } else {
        elementContent = `<table class="v-table">
            <tbody>
                <tr class="bold">
                    <td>表头1</td>
                    <td>表头2</td>
                </tr>
                <tr>
                    <td>数据1</td>
                    <td>数据2</td>
                </tr>
            </tbody>
        </table>`
      }
      break

    case 'VChart':
      elementContent = `<div ref="chart-${id}" class="chart-container"></div>`
      break

    case 'Group':
      // 处理组合组件
      if (component.propValue && Array.isArray(component.propValue)) {
        const groupComponents = component.propValue
          .map((child) =>
            generateVueElement({
              ...child,
              id: `${id}-${child.id}`,
            }),
          )
          .join('\n')

        elementContent = `<div class="group-container">
            <div>${groupComponents}</div>
        </div>`
      } else {
        elementContent = `<div class="group-container">
            <div></div>
        </div>`
      }
      break

    default:
      // 处理SVG组件
      if (component.component && component.component.startsWith('SVG')) {
        elementContent = `<div class="svg-shape">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="${component.style ? component.style.backgroundColor || '#000' : '#000'}" />
            </svg>
        </div>`
      } else {
        elementContent = `<div class="unknown-component">未知组件: ${component.component || ''}</div>`
      }
  }

  return `<div class="component component-${id}" data-component="${component.component}">${elementContent}</div>`
}
