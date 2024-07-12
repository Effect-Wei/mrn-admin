import { h, defineComponent, computed, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useMainStore } from '@/stores/useMainStore';

const ChartLine = defineComponent({
    name: 'ChartLine',
    setup() {
        const mainStore = useMainStore();
        const chartOptions = computed(() => {
            return {
                chart: {
                    id: 'vuechart-line',
                    type: 'line',
                    toolbar: {
                        show: false,
                    },
                },
                theme: {
                    mode: mainStore.theme, // light
                },
                grid: {
                    borderColor: 'transparent',
                },
                tooltip: {
                    x: {
                        // format: 'dd/MM/yy HH:mm',
                        show: false,
                    },
                    marker: {
                        show: false,
                    },
                },
                forecastDataPoints: {
                    count: 7,
                },
                stroke: {
                    width: 5,
                    curve: 'smooth',
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        '1/11/2000',
                        '2/11/2000',
                        '3/11/2000',
                        '4/11/2000',
                        '5/11/2000',
                        '6/11/2000',
                        '7/11/2000',
                        '8/11/2000',
                        '9/11/2000',
                        '10/11/2000',
                        '11/11/2000',
                        '12/11/2000',
                        '1/11/2001',
                        '2/11/2001',
                        '3/11/2001',
                        '4/11/2001',
                        '5/11/2001',
                        '6/11/2001',
                    ],
                    tickAmount: 10,
                    labels: {
                        formatter: function (value: any, timestamp: any, opts: any) {
                            return opts.dateFormatter(new Date(timestamp), 'dd MMM');
                        },
                    },
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'dark',
                        gradientToColors: ['#FDD835'],
                        shadeIntensity: 1,
                        type: 'horizontal',
                        opacityFrom: 1,
                        opacityTo: 1,
                        stops: [0, 100, 100, 100],
                    },
                },
                yaxis: {
                    min: -10,
                    max: 40,
                },
            };
        });
        const series = ref([
            {
                name: 'Sales',
                data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5],
            },
        ]);
        return () =>
            h(VueApexCharts, {
                height: '100%',
                type: 'line',
                // @ts-ignore
                options: chartOptions,
                series,
            });
    },
});
const _default = ChartLine;
export { _default as default };
