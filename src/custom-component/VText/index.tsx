import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import s from './index.module.scss'
import { keycodes } from '@/utils/shortcutKey.js'

interface ElementType {
    propValue: string
    isLock: boolean
    style: any
    id: number
}

@Component
export default class Picture extends Vue {
    @Prop({ type: String, default: '' }) propValue

    @Prop({ type: Object, default: () => ({}) }) element: ElementType

    canEdit = false

    ctrlKey = 17

    isCtrlDown = false

    get editMode() {
        return this.$store.state.editMode
    }

    handleInput(e) {
        this.$emit('input', this.element, e.target.innerHTML)
    }

    handleKeydown(e) {
        // 阻止冒泡，防止触发复制、粘贴组件操作
        this.canEdit && e.stopPropagation()
        if (e.keyCode == this.ctrlKey) {
            this.isCtrlDown = true
        } else if (this.isCtrlDown && this.canEdit && keycodes.includes(e.keyCode)) {
            e.stopPropagation()
        } else if (e.keyCode == 46) {
            // deleteKey
            e.stopPropagation()
        }
    }

    handleKeyup(e) {
        // 阻止冒泡，防止触发复制、粘贴组件操作
        this.canEdit && e.stopPropagation()
        if (e.keyCode == this.ctrlKey) {
            this.isCtrlDown = false
        }
    }

    handleMousedown(e) {
        if (this.canEdit) {
            e.stopPropagation()
        }
    }

    clearStyle(e) {
        e.preventDefault()
        const clp = e.clipboardData
        const text = clp.getData('text/plain') || ''
        if (text !== '') {
            document.execCommand('insertText', false, text)
        }

        this.$emit('input', this.element, e.target.innerHTML)
    }

    handleBlur(e) {
        this.element.propValue = e.target.innerHTML || '&nbsp;'
        const html = e.target.innerHTML
        if (html !== '') {
            this.element.propValue = e.target.innerHTML
        } else {
            this.element.propValue = ''
            this.$nextTick(() => {
                this.element.propValue = '&nbsp;'
            })
        }
        this.canEdit = false
    }

    setEdit() {
        if (this.element.isLock) return

        this.canEdit = true
        // 全选
        this.selectText(this.$refs.text)
    }

    selectText(element) {
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(element)
        selection.removeAllRanges()
        selection.addRange(range)
    }

    render() {
        return this.editMode == 'edit' ? (
            <div class={s['v-text']} onKeydown={this.handleKeydown} onKeyup={this.handleKeyup}>
                {/* tabindex >= 0 使得双击时聚焦该元素 */}
                <div
                    ref="text"
                    contenteditable={this.canEdit}
                    class={{ canEdit: this.canEdit }}
                    tabindex={this.element.id}
                    style={{ verticalAlign: this.element.style.verticalAlign }}
                    onDblclick={this.setEdit}
                    onPpaste={this.clearStyle}
                    onMousedown={this.handleMousedown}
                    onBlur={this.handleBlur}
                    onInput={this.handleInput}
                    domPropsInnerHTML={this.element.propValue}
                ></div>
            </div>
        ) : (
            <div class={[s['v-text'], s.preview]}>
                <div style={{ verticalAlign: this.element.style.verticalAlign }} domPropsInnerHTML={this.element.propValue}></div>
            </div>
        )
    }
}
