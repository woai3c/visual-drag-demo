import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import s from './Area.scss'

@Component
export default class Area extends Vue {
    @Prop({ type: Object, default: () => {} }) start

    @Prop({ type: Number, default: 0 }) width

    @Prop({ type: Number, default: 0 }) height

    render() {
        return (
            <div
                style={{
                    left: this.start.x + 'px',
                    top: this.start.y + 'px',
                    width: this.width + 'px',
                    height: this.height + 'px',
                }}
                class={s.area}
            ></div>
        )
    }
}
