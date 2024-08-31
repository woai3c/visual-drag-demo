<template>
  <div class="ace">
    <div class="header">
      <el-button class="btn" icon="el-icon-search" @click="openSearchBox"> 查找 </el-button>
      <el-button class="btn" icon="el-icon-close" @click="closeEditor"> 关闭 </el-button>
    </div>
    <div class="ace-editor">
      <div ref="ace" class="editor" />
    </div>
    <div class="footer">
      <el-button type="primary" @click="setCode"> 重置代码 </el-button>
      <el-button type="success" @click="getCode"> 保存提交 </el-button>
    </div>
  </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/theme-one_dark'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/mode-json5'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import { mapState } from 'vuex'

export default {
  name: 'AceEditor',
  data() {
    return {
      editor: null,
      obj: null,
    }
  },
  computed: mapState(['canvasStyleData', 'curComponent']),
  watch: {
    curComponent() {
      this.setCode()
    },
    canvasStyleData() {
      this.setCode()
    },
  },
  mounted() {
    ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/')
    this.editor = ace.edit(this.$refs.ace, {
      maxLines: 40,
      minLines: 40,
      fontSize: 14,
      theme: 'ace/theme/one_dark',
      mode: 'ace/mode/json5',
      tabSize: 4,
      readOnly: false,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
    })

    this.obj = this.curComponent || this.canvasStyleData
    this.editor.setValue(JSON.stringify(this.obj, null, 4))
  },
  methods: {
    setCode() {
      this.obj = this.curComponent || this.canvasStyleData
      this.editor.setValue(JSON.stringify(this.obj, null, 4))
    },

    getCode() {
      let str = this.editor.getValue()
      if (!this.curComponent) {
        this.$store.commit('aceSetCanvasData', JSON.parse(str))
      } else {
        this.$store.commit('aceSetcurComponent', JSON.parse(str))
      }
    },

    updateEditorTheme(theme) {
      this.editor.setTheme(theme)
    },

    openSearchBox() {
      this.editor.execCommand('find')
    },

    closeEditor() {
      this.$emit('closeEditor')
    },
  },
}
</script>

<style lang="scss" scoped>
.ace {
  position: absolute;
  height: calc(100% - 80px);
  width: 550px;
  top: 63px;
  background-color: #fff;
  border: 1px solid #ddd;
  z-index: 100;
  padding: 10px;

  .header,
  .footer {
    display: flex;
    justify-content: flex-end;
  }

  .ace-editor {
    height: calc(100% - 80px);
    overflow: auto;
  }
}

.editor {
  margin: 10px 0;
}
</style>
