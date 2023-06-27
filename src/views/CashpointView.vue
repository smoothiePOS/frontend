<script lang="ts">
import config from "@/config";
import {defineComponent} from "vue";

interface product {
    id: string,
    name: string,
    price: number,
    available: boolean
}

class Product {
    public name: string;
    public price: number;
    public available: boolean;

    constructor(name: string, price: number, available: boolean) {
        this.name = name;
        this.price = price;
        this.available = available;
    }
}

export default defineComponent({
    name: 'CashpointView',
    data() {
        return {
            products: {} as { [key: string]: Product },
            orders: {} as { [key: string]: number },
            timer: -1
        }
    },
    mounted() {
        this.update()
        setInterval(() => {
            this.update()
        }, 5000);
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        addProduct(product: string) {
            if (this.products[product].available) {
                this.orders[product] = (this.orders[product] ?? 0) + 1;
            }
        },
        removeProduct(product: string) {
            this.orders[product] = (this.orders[product] ?? 1) - 1 > 0 ? (this.orders[product] ?? 1) - 1 : 0;
        },
        clearProduct(product: string) {
            this.orders[product] = 0;
        },
        update() {
            fetch(config.baseUrl + "/cashpoint/products")
                .then(response => response.json())
                .then(data => {
                    data.forEach((product: product) => {
                        this.products[product.id] = new Product(product.name, product.price, product.available)
                        if (!product.available) {
                            this.orders[product.id] = 0;
                        }
                    })
                    console.log(data);
                });
        }
    }
})
</script>

<template>
    <div class="cashpoint">
        <div class="product_buttons">
            <h1>Products</h1>
            <div>
                <div v-for="product in Object.keys(products)" :key="product">
                    <div class="product_button" :class="(!products[product].available) ? 'unavailable' : ''"
                         @click="addProduct(product)">
                        <span class="name">{{ products[product].name }}</span>
                        <span class="price">{{ (products[product].price / 100).toFixed(2) }}€</span>
                        <span>Menge: {{ orders[product] ?? 0 }}</span>
                        <span class="product_button_action" @click.stop="removeProduct(product)">-</span>
                        <span class="product_button_action" @click.stop="clearProduct(product)">CL</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="order">
            <h2>Order</h2>
            <table>
                <tr>
                    <th>Produkt</th>
                    <th>Anzahl</th>
                    <th>Preis</th>
                </tr>
            <tr v-for="order in Object.keys(this.orders)" :key="order">
                <td>{{ products[order].name }} (je {{ (products[order].price / 100).toFixed(2) }}€)</td>
                <td>{{ orders[order] }}</td>
                <td>{{ (products[order].price * orders[order] / 100).toFixed(2) }}€</td>
            </tr>
            </table>
            <div class="options">
                <div style="background: forestgreen">OK</div>
                <div style="background: indianred" @click="this.orders = {}">CL</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cashpoint {
    display: flex;
}

.product_buttons {
    display: block;
    user-select: none;
    width: 66vw;
    min-height: 100vh;
    border-right: 2pt solid black;
}

.product_buttons div:first-of-type {
    display: flex;
}

.product_button {
    overflow: hidden;
    display: block !important;
    width: 150pt;
    height: 150pt;
    margin: 3pt;
    border: 1pt solid white;
    border-radius: 20pt;
    background: orange;
    color: white;
    font-size: 20pt;
    padding-top: 5pt
}

.product_button * {
    padding: 0 10pt;
    display: block;
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
}

.product_button .remove {
    padding: 0;
    bottom: 0;
}

.product_button_action {
    font-size: 30pt;
}

.product_button .remove span {
    display: block;
}

.product_button .remove span:hover {
    background: #fff;
}

.unavailable {
    background: #666 !important;
}

.order {
    margin-left: 5pt;
}

.options {
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-content: center;
    text-align: center;
}

.options div {
    color: white;
    display: flex;
    vertical-align: center;
    justify-content: center;
    align-content: center;
    text-align: center;
    line-height: 80px;
    border-radius: 20px;
    margin: 5pt;
    width: calc(33vw / 2 - 10pt);
    background: gray;
    height: 80px;
}
</style>