<template>
    <div class="ace">
        <el-col :span="18">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    更换风格<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <div
                        @click="updateEditorTheme('ace/theme/github')">
                        <el-dropdown-item>GitHub</el-dropdown-item>
                    </div>
                    <div 
                        @click="updateEditorTheme('ace/theme/kuroir')">
                        <el-dropdown-item>Kuroir</el-dropdown-item>
                    </div>
                    <div
                        @click="updateEditorTheme('ace/theme/one_dark')">
                        <el-dropdown-item>Dark</el-dropdown-item>
                    </div>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
        <el-button
            @click="openSearchBox"
            style="margin-left: 80px;"
        >查找</el-button>
        <div ref="ace" class="ace-editor"/>
        <el-button
            type="primary"
            style="margin-left: 360px;"
            @click="setCode"
        >更新代码</el-button>
        <el-button
            type="success"
            style="margin-left: 20px;"
            @click="getCode"
        >保存提交</el-button>
    </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/src-min-noconflict/theme-github'
import 'ace-builds/src-min-noconflict/theme-one_dark'
import 'ace-builds/src-min-noconflict/theme-kuroir'
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
            maxLines: 36,
            minLines: 36,
            fontSize: 14,
            theme: 'ace/theme/github',
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
    },
}
</script>

<style scoped>
.ace {
    position: absolute;
    height: calc(100% - 80px);
    width: 550px;
    top: 63px;
    background-color: #E0F2F1;
    border: 1px solid #ddd;
    z-index: 100;
}
</style>
