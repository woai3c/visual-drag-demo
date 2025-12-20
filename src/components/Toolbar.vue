<template>
  <div>
    <div :class="isDarkMode ? 'dark toolbar' : 'toolbar'">
      <el-button @click="onAceEditorChange">JSON</el-button>
      <el-button @click="onImportJSON">导入</el-button>
      <el-dropdown @command="handleExportCommand">
        <el-button> 导出<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="json">导出JSON</el-dropdown-item>
          <el-dropdown-item command="html">导出HTML</el-dropdown-item>
          <el-dropdown-item command="vue">导出Vue文件</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button @click="undo">撤消</el-button>
      <el-button @click="redo">重做</el-button>
      <label for="input" class="insert">
        插入图片
        <input id="input" type="file" hidden @change="handleFileChange" />
      </label>

      <el-button style="margin-left: 10px" @click="preview(false)"> 预览 </el-button>
      <el-button @click="save">保存</el-button>
      <el-button @click="clearCanvas">清空画布</el-button>
      <el-button :disabled="!areaData.components.length" @click="compose"> 组合 </el-button>
      <el-button
        :disabled="!curComponent || curComponent.isLock || curComponent.component != 'Group'"
        @click="decompose"
      >
        拆分
      </el-button>

      <el-button :disabled="!curComponent || curComponent.isLock" @click="lock"> 锁定 </el-button>
      <el-button :disabled="!curComponent || !curComponent.isLock" @click="unlock"> 解锁 </el-button>
      <el-button @click="preview(true)">截图</el-button>

      <div class="canvas-config">
        <span>画布大小</span>
        <input v-model="canvasStyleData.width" />
        <span>*</span>
        <input v-model="canvasStyleData.height" />
      </div>
      <div class="canvas-config">
        <span>画布比例</span>
        <input v-model="scale" @input="handleScaleChange" />
        %
      </div>
      <el-switch
        v-model="switchValue"
        class="dark-mode-switch"
        active-icon-class="el-icon-sunny"
        inactive-icon-class="el-icon-moon"
        active-color="#000"
        @change="handleToggleDarkMode"
      ></el-switch>
      <el-dropdown
        v-if="showComponentAlign"
        :hide-on-click="false"
        class="align-dropdown"
        trigger="click"
        @command="handleComponentAlign"
      >
        <el-button type="primary">
          对齐方式
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in alignList"
            :key="item.value"
            :command="item.value"
            :disabled="item.isDisabled ? areaData.components.length < 3 : false"
          >
            {{ item.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 预览 -->
    <Preview v-if="isShowPreview" :is-screenshot="isScreenshot" @close="handlePreviewChange" />
    <AceEditor v-if="isShowAceEditor" @closeEditor="closeEditor" />

    <el-dialog
      :title="isExport ? '导出数据' : '导入数据'"
      :visible.sync="isShowDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="600"
    >
      <el-input v-model="jsonData" type="textarea" :rows="20" placeholder="请输入 JSON 数据"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-upload
          v-show="!isExport"
          action="/"
          :before-upload="beforeUpload"
          :show-file-list="false"
          accept="application/json"
        >
          <el-button type="primary">选择 JSON 文件</el-button>
        </el-upload>
        <el-button type="primary" @click="processJSON">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import generateID from '@/utils/generateID'
import toast from '@/utils/toast'
import { mapState } from 'vuex'
import Preview from '@/components/Editor/Preview'
import AceEditor from '@/components/Editor/AceEditor.vue'
import { commonStyle, commonAttr } from '@/custom-component/component-list'
import eventBus from '@/utils/eventBus'
import { $ } from '@/utils/utils'
import changeComponentsSizeWithScale, { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale'

import { getComponentRotatedStyle } from '@/utils/style'
import { generateHTML, generateVueComponent } from '@/utils/exportUtils'

export default {
  components: { Preview, AceEditor },
  data() {
    return {
      isShowPreview: false,
      isShowAceEditor: false,
      timer: null,
      isScreenshot: false,
      scale: 100,
      switchValue: false,
      isShowDialog: false,
      jsonData: '',
      isExport: false,
      alignList: [
        {
          label: '左对齐',
          value: 'leftAlign',
        },
        {
          label: '水平居中',
          value: 'centerAlign',
        },
        {
          label: '右对齐',
          value: 'rightAlign',
        },
        {
          label: '顶对齐',
          value: 'topAlign',
        },
        {
          label: '垂直居中',
          value: 'middleAlign',
        },
        {
          label: '底对齐',
          value: 'bottomAlign',
        },
        {
          label: '水平等间距',
          value: 'horizontalSpacing',
          isDisabled: true,
        },
        {
          label: '垂直等间距',
          value: 'verticalSpacing',
          isDisabled: true,
        },
      ],
    }
  },
  computed: {
    ...mapState(['componentData', 'canvasStyleData', 'areaData', 'curComponent', 'curComponentIndex', 'isDarkMode']),
    showComponentAlign() {
      return (this.curComponent && !this.curComponent.isLock) || this.areaData.components.length > 1
    },
  },
  created() {
    eventBus.$on('preview', this.preview)
    eventBus.$on('save', this.save)
    eventBus.$on('clearCanvas', this.clearCanvas)

    this.scale = this.canvasStyleData.scale
    const savedMode = JSON.parse(localStorage.getItem('isDarkMode'))
    if (savedMode) {
      this.handleToggleDarkMode(savedMode)
    }
  },
  methods: {
    handleComponentAlign(command) {
      this.$store.commit(command)
      // 每次对齐后记录一次快照
      this.$store.commit('recordSnapshot')
      // 如果是多组件对齐, 则需要重新计算选中区域的大小和位置
      let top = Infinity,
        left = Infinity
      let right = -Infinity,
        bottom = -Infinity
      if (this.areaData.components.length > 1) {
        this.areaData.components.forEach((component) => {
          let style = getComponentRotatedStyle(component.style)
          if (style.left < left) left = style.left
          if (style.top < top) top = style.top
          if (style.right > right) right = style.right
          if (style.bottom > bottom) bottom = style.bottom
        })
        this.$store.commit('setAreaData', {
          style: {
            left,
            top,
            width: right - left,
            height: bottom - top,
          },
          components: this.areaData.components,
        })
      }
    },
    handleToggleDarkMode(value) {
      if (value !== null) {
        this.$store.commit('toggleDarkMode', value)
        this.switchValue = value
      }
    },
    handleScaleChange() {
      clearTimeout(this.timer)
      this.$store.commit('setLastScale', this.scale)
      this.timer = setTimeout(() => {
        // 画布比例设一个最小值，不能为 0
        // eslint-disable-next-line no-bitwise
        this.scale = ~~this.scale || 1
        changeComponentsSizeWithScale(this.scale)
      }, 1000)
    },

    onAceEditorChange() {
      this.isShowAceEditor = !this.isShowAceEditor
    },

    closeEditor() {
      this.onAceEditorChange()
    },

    lock() {
      this.$store.commit('lock')
    },

    unlock() {
      this.$store.commit('unlock')
    },

    compose() {
      this.$store.commit('compose')
      this.$store.commit('recordSnapshot')
    },

    decompose() {
      this.$store.commit('decompose')
      this.$store.commit('recordSnapshot')
    },

    undo() {
      this.$store.commit('undo')
    },

    redo() {
      this.$store.commit('redo')
    },

    handleFileChange(e) {
      const file = e.target.files[0]
      if (!file.type.includes('image')) {
        toast('只能插入图片')
        return
      }

      const reader = new FileReader()
      reader.onload = (res) => {
        const fileResult = res.target.result
        const img = new Image()
        img.onload = () => {
          const component = {
            ...commonAttr,
            id: generateID(),
            component: 'Picture',
            label: '图片',
            icon: '',
            propValue: {
              url: fileResult,
              flip: {
                horizontal: false,
                vertical: false,
              },
            },
            style: {
              ...commonStyle,
              top: 0,
              left: 0,
              width: img.width,
              height: img.height,
            },
          }

          // 根据画面比例修改组件样式比例 https://github.com/woai3c/visual-drag-demo/issues/91
          changeComponentSizeWithScale(component)

          this.$store.commit('addComponent', { component })
          this.$store.commit('recordSnapshot')

          // 修复重复上传同一文件，@change 不触发的问题
          $('#input').setAttribute('type', 'text')
          $('#input').setAttribute('type', 'file')
        }

        img.src = fileResult
      }

      reader.readAsDataURL(file)
    },

    preview(isScreenshot) {
      this.isScreenshot = isScreenshot
      this.isShowPreview = true
      this.$store.commit('setEditMode', 'preview')
    },

    save() {
      localStorage.setItem('canvasData', JSON.stringify(this.componentData))
      localStorage.setItem('canvasStyle', JSON.stringify(this.canvasStyleData))
      this.$message.success('保存成功')
    },

    clearCanvas() {
      this.$store.commit('setCurComponent', {
        component: null,
        index: null,
      })
      this.$store.commit('setComponentData', [])
      this.$store.commit('recordSnapshot')
    },

    handlePreviewChange() {
      this.isShowPreview = false
      this.$store.commit('setEditMode', 'edit')
    },

    onImportJSON() {
      this.jsonData = ''
      this.isExport = false
      this.isShowDialog = true
    },

    processJSON() {
      try {
        const data = JSON.parse(this.jsonData)
        if (this.isExport) {
          this.downloadFileUtil(this.jsonData, 'application/json', 'data.json')
        } else if (data.componentData && data.canvasStyleData) {
          // 检查是否是新的数据格式（包含componentData和canvasStyleData）
          // 新的格式，同时包含组件数据和画布样式数据
          this.$store.commit('setComponentData', data.componentData)
          this.$store.commit('setCanvasStyle', data.canvasStyleData)
        } else if (Array.isArray(data)) {
          // 旧的格式，只有组件数据
          this.$store.commit('setComponentData', data)
        } else {
          this.$message.error('数据格式错误，请确保数据是组件数组或包含componentData和canvasStyleData的对象')
          return
        }

        this.isShowDialog = false
      } catch (error) {
        this.$message.error('数据格式错误，请传入合法的 JSON 格式数据')
      }
    },

    onExportJSON() {
      this.isShowDialog = true
      this.isExport = true
      // 创建一个包含组件数据和画布样式数据的完整数据对象
      const exportData = {
        componentData: this.componentData,
        canvasStyleData: this.canvasStyleData,
      }
      this.jsonData = JSON.stringify(exportData, null, 4)
    },

    onExportHTML() {
      try {
        const htmlContent = generateHTML(this.componentData, this.canvasStyleData)
        this.downloadFileUtil(htmlContent, 'text/html', 'exported-page.html')
        this.$message.success('HTML文件导出成功')
      } catch (error) {
        console.error('导出HTML失败:', error)
        this.$message.error('导出HTML文件失败，请检查控制台')
      }
    },

    onExportVue() {
      try {
        const vueContent = generateVueComponent(this.componentData, this.canvasStyleData)
        this.downloadFileUtil(vueContent, 'text/plain', 'ExportedPage.vue')
        this.$message.success('Vue文件导出成功')
      } catch (error) {
        console.error('导出Vue失败:', error)
        this.$message.error('导出Vue文件失败，请检查控制台')
      }
    },

    downloadFileUtil(data, type, fileName = '') {
      const url = window.URL.createObjectURL(new Blob([data], { type }))
      const link = document.createElement('a')

      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },

    handleExportCommand(command) {
      switch (command) {
        case 'json':
          this.onExportJSON()
          break
        case 'html':
          this.onExportHTML()
          break
        case 'vue':
          this.onExportVue()
          break
        default:
          this.onExportJSON()
      }
    },

    beforeUpload(e) {
      // 通过json文件导入
      const reader = new FileReader()
      reader.readAsText(e)
      const self = this
      reader.onload = function () {
        self.jsonData = this.result
        console.log(this.result)
      }

      return false
    },
  },
}
</script>

<style lang="scss" scoped>
.toolbar {
  padding: 15px 10px;
  white-space: nowrap;
  overflow-x: auto;
  background: var(--main-bg-color);
  border-color: var(--ace-bg-color);
  border-bottom: 1px solid var(--border-color);

  .align-dropdown {
    margin-left: 10px;
  }

  .canvas-config {
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    color: var(--text-color);

    input {
      width: 50px;
      margin-left: 4px;
      outline: none;
      padding: 0 5px;
      border: 1px solid var(--border-color);
      color: #606266;
    }

    span {
      margin-left: 10px;
    }
  }

  .el-button--small {
    background: var(--main-bg-color);
    border: 1px solid var(--toolbar-border-color);
    color: var(--button-text-color);
  }

  .el-button--small:hover {
    background: var(--button-active-text-color);
    border-color: var(--actived-bg-color);
    color: var(--main-bg-color);
  }

  .insert {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid var(--toolbar-border-color);
    color: var(--text-color);
    appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-left: 10px;
  }

  .insert {
    background: var(--main-bg-color);
    border: 1px solid var(--toolbar-border-color);
    color: var(--button-text-color);

    &:active {
      background: var(--button-active-text-color);
      border-color: var(--actived-bg-color);
      color: var(--main-bg-color);
    }

    &:hover {
      background: var(--button-active-text-color);
      border-color: var(--actived-bg-color);
      color: var(--main-bg-color);
    }
  }

  .el-button.is-disabled {
    color: var(--disable-text-color);
    border-color: var(--disable-border-color);
    background: var(--main-bg-color);

    &:hover {
      background: var(--main-bg-color);
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;

  & > * {
    margin-left: 10px;
  }
}
</style>
