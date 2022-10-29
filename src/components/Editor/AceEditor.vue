<template>
    <div class="ace">
        <el-button
            @click="openSearchBox"
            class="btn"
            style="margin-left: 380px;"
            icon="el-icon-search"
        >查找</el-button>
        <el-button 
            @click="closeEditor"
            class="btn"
            style="margin-left: 10px;"
            icon="el-icon-close"
        >关闭</el-button>
        <div class="ace-editor">
            <div ref="ace" class="editor"/>
        </div>
        <el-button
            type="primary"
            style="margin-left: 360px;"
            @click="setCode"
        >重置代码</el-button>
        <el-button
            type="success"
            style="margin-left: 20px;"
            @click="getCode"
        >保存提交</el-button>
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
    computed: mapState([
        'canvasStyleData',
        'curComponent',
    ]),
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
            maxLines: 35,
            minLines: 35,
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
                this.$store.commit('acesetCanvasData', JSON.parse(str))
            } else {
                this.$store.commit('acesetcurComponent', JSON.parse(str))
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

<style scoped>
.ace {
    position: absolute;
    height: calc(100% - 80px);
    width: 550px;
    top: 63px;
    background-color: #2D2D2D;
    border: 1px solid #ddd;
    z-index: 100;
}

.editor {
    margin: 4px;
}
.btn {
    margin-top:5px;
    background-color: #343434;
    color: #FFFFF5;
    border: 1px solid #151515;
}

.btn:hover {
    background-color: #5D5D5D;
}
</style>
