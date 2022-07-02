import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import './index.scss';

@Component
export default class RectShape extends Vue {
    @Prop({ type: Object, default:() => ({}) }) element: object;
    @Prop({ type: String, default: () => ({}) }) propValue: string;

    render() {
        return <div class="rect-shape">
            <v-text prop-value={this.propValue} element={this.element} />
        </div>
    }
}
