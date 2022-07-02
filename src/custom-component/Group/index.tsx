import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import style from './index.module.scss';

@Component
export default class Group extends Vue {
    @Prop({ type: Array, default: () => []}) propValue;
    @Prop({ type: Object, default: () => {}}) element;

    render() {
        return <div class={style.group}>
            <div>
                {this.propValue.map(item =>
                    <component
                        is={item.component}
                        id={`component${item.id}`}                
                        key={item.id}
                        class={style.component}
                        prop-value={item.propValue}
                        element={item}
                    />
                )}
            </div>
        </div>
    }
}   

