<template>
  <v-chart ref="chart" class="chart" :option="propValue.option" autoresize />
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart, BarChart, LineChart } from 'echarts/charts'
import OnEvent from '../common/OnEvent'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  LineChart,
])

export default {
  components: {
    VChart,
  },
  extends: OnEvent,
  props: {
    propValue: {
      type: Object,
      require: true,
      default: () => {},
    },
    element: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped>
.chart {
  height: 400px;
}
</style>
