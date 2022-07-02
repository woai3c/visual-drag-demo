import Vue from 'vue'
import Component from "vue-class-component";
import '@/App.scss';

@Component
export default class App extends Vue {

    render() {
        return <router-view />
    }
}
