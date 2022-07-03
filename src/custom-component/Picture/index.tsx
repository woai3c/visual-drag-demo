import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import './index.module.scss'

@Component
export default class Picture extends Vue {
    @Prop({ type: String, default: '' }) propValue

    render() {
        return (
            <div style="overflow: hidden;">
                <img src={this.propValue} />
            </div>
        )
    }
}
