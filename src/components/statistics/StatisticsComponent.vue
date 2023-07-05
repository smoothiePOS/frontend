<script lang="ts">
import {defineComponent} from 'vue'
import config from "@/config";

interface statistic {
    products: {
        productId: string,
        amount: number
    }[]
}

export default defineComponent({
    name: "StatisticsComponent",
    props: {
        from: {
            type: Number,
            required: true
        },
        to: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            products: {} as { [key: string]: number}
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            fetch(config.baseUrl + "/statistic/" + this.from + "/" + this.to + "/orders")
                .then(response => response.json())
                .then(data => {
                    data.forEach((item: statistic) => {
                        item.products.forEach(product => {
                            if (this.products[product.productId]) {
                                this.products[product.productId] += product.amount
                            } else {
                                this.products[product.productId] = product.amount
                            }
                        })
                    })
                })
        }
    },
})
</script>

<template>
<h2>Produkte</h2>
    <table>
        <tr v-for="product in Object.keys(this.products)" :key="product">
            <td>{{ product }}</td>
            <td>{{ products[product] }}</td>
        </tr>
    </table>
</template>

<style scoped>

</style>