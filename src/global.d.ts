declare module '*.scss'
declare module '*.vue' {
    import Vue from "vue"
    export default Vue
}

declare function h(): JSX.Element | JSX.ElementClass | JSX.IntrinsicElements;

declare namespace JSX {
    interface Element extends Vue.VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
        [ele: string]: any;
    }
}
  