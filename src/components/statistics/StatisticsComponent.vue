<script lang="ts">
import {defineComponent} from 'vue'
import config from "@/config";
import {Chart, ChartConfiguration, registerables} from "chart.js";
Chart.register(...registerables);

interface soldProducts {
    name: string
    amount: number
    price: number
}

export default defineComponent({
    name: "StatisticsComponent",
    computed: {
        config() {
            return config
        }
    },
    props: {
        start: {
            type: Number,
            required: true
        },
        end: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            products: [] as soldProducts[],
            revenue: 0,
            start: this.$props.start,
            end: this.$props.end
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            fetch(config.baseUrl + "/statistic/" + this.start + "/" + this.end + "/products/sold")
                .then(response => response.json())
                .then(data => {
                    this.products = data
                    console.log(this.products)
                    this.products.forEach(product => {
                        this.revenue += product.amount * product.price
                    })
                    this.buildStatistic()
                })
        },
        buildStatistic() {
            const soldLabels = this.products.map(product => product.name)
            const soldData = {
                labels: soldLabels,
                datasets: [{
                    label: "Verkaufte Produkte",
                    data: this.products.map(product => product.amount),
                }]
            }
            const soldConfig = {
                type: 'doughnut',
                data: soldData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'left',
                        },
                        title: {
                            display: true,
                            text: 'Verkaufte Produkte'
                        }
                    }
                },
            };
            new Chart(
                document.getElementById("chart_sold_products") as HTMLCanvasElement,
                soldConfig as ChartConfiguration
            )

            const revenueLabels = this.products.map(product => product.name)
            const revenueData = {
                labels: revenueLabels,
                datasets: [{
                    label: "Umsatz",
                    data: this.products.map(product => (product.amount * product.price)/100),
                }]
            }
            const revenueConfig = {
                type: 'doughnut',
                data: revenueData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'left',
                        },
                        title: {
                            display: true,
                            text: 'Umsatz'
                        }
                    }
                },
            };
            new Chart(
                document.getElementById("chart_revenue") as HTMLCanvasElement,
                revenueConfig as ChartConfiguration
            )
        }
    },
})
</script>

<template>
    <h2>Produkte</h2>
    <!--suppress TypeScriptValidateTypes -->
    <h4>Von {{ new Date(this.start*1000).toLocaleString("de-DE", config.dateFormat) }} bis {{ new Date(this.end*1000).toLocaleString("de-DE", config.dateFormat) }}</h4>
    <div>
        Umsatz: {{ (revenue/100).toFixed(2) }} €
    </div>
    <div style="max-width: 500px">
        <canvas id="chart_sold_products"></canvas>
    </div>
    <div style="max-width: 500px">
        <canvas id="chart_revenue"></canvas>
    </div>
</template>

<style>
body {
    background-color: white;
    color: black;
}
</style>