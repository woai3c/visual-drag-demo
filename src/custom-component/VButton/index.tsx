import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import s from './index.module.scss';

@Component
export default class Picture extends Vue {
    @Prop({ type: String, default: ''}) propValue;

    render() {
        return <button class={s['v-button']}>{ this.propValue }</button>
    }
}   

