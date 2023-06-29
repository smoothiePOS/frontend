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
    display: block;
    justify-content: center;
    align-content: center;
}

.options .product_button_action {
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

<script lang="ts">
import config from "@/config";
import {defineComponent} from "vue";

interface product {
    id: string,
    name: string,
    price: number,
    deposit: number,
    available: boolean
}

interface cashpoint {
    name: string,
    id: string | undefined,
    available: boolean
}

class Product {
    public name: string;
    public price: number;
    public available: boolean;
    public deposit: number;

    constructor(name: string, price: number, deposit:number, available: boolean) {
        this.name = name;
        this.price = price;
        this.deposit = deposit;
        this.available = available;
    }
}

export default defineComponent({
    name: 'CashpointView',
    data() {
        return {
            products: {} as { [key: string]: Product },
            orders: {} as { [key: string]: number },
            timer: -1,
            lastOrderId: "",
            debug: config.debug,
            cashpoints: {} as { [key: string]: cashpoint },
            cashpoint: undefined as cashpoint | undefined
        }
    },
    mounted() {
        this.getCashpoints()
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        getCashpoints() {
            fetch(config.baseUrl + "/cashpoints")
                .then(response => response.json())
                .then(data => {
                    this.cashpoints = data.cashpoints;
                });
        },
        changeProduct(product: string, amount: number | undefined) {
            if (this.products[product].available) {
                fetch(config.baseUrl + "/cashpoint/" + this.cashpoint?.id + "/order/rt", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        productId: product,
                        amount: amount ?? null
                    })
                }).then(response => response.text())
                    .then(data => {
                        this.orders[product] = parseInt(data);
                        if (this.orders[product] == 0) {
                            delete this.orders[product];
                        }
                    })
            }
        },
        update() {
            fetch(config.baseUrl + "/cashpoint/products")
                .then(response => response.json())
                .then(data => {
                    data.forEach((product: product) => {
                        this.products[product.id] = new Product(product.name, product.price, product.deposit, product.available)
                        if (!product.available) {
                            this.orders[product.id] = 0;
                        }
                    })
                    console.log(data);
                });
        },
        placeOrder() {
            if (this.orders.length == 0) {
                return;
            }
            fetch(config.baseUrl + "/cashpoint/" + this.cashpoint?.id + "/order/rt/confirm")
                .then(response => response.text())
                .then(data => {
                    if (data === "OK") {
                        this.orders = {};
                    }
                })
        },
        fullscreen() {
            document.body.requestFullscreen()
        },
        setup(selectedCashpoint: string) {
            this.cashpoint = this.cashpoints[selectedCashpoint]
            this.cashpoint.id = selectedCashpoint;
            this.timer = setInterval(() => {
                this.update()
            }, 1000);
        },
        clearOrder() {
            if (confirm("Diese Bestellung wirklich löschen?")) {
                fetch(config.baseUrl + "/cashpoint/" + this.cashpoint?.id + "/order/rt/clear")
                    .then(response => response.text())
                    .then(data => {
                        if (data === "OK") this.orders = {};
                    })
            }
        }
    }
})
</script>

<template>
    <div class="cashpoint" v-if="this.cashpoint !== undefined">
        <div style="position:absolute; top: 0; z-index: 20" v-show="lastOrderId !== '' && this.debug">Last Order Id:
            {{ this.lastOrderId }}
        </div>
        <div class="product_buttons">
            <h1 @click="fullscreen()">Cashpoint {{ this.cashpoint.name }}</h1>
            <div>
                <div v-for="product in Object.keys(products)" :key="product">
                    <div class="product_button" :class="(!products[product].available) ? 'unavailable' : ''"
                         @click="changeProduct(product, 1)">
                        <span class="name">{{ products[product].name }}</span>
                        <span class="price">{{ (products[product].price / 100).toFixed(2) }}€</span>
                        <span>Menge: {{ orders[product] ?? 0 }}</span>
                        <span class="product_button_action" @click.stop="changeProduct(product, -1)">-</span>
                        <span class="product_button_action" @click.stop="changeProduct(product, undefined)">CL</span>
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
                <div style="display: block;font-size: 20pt">
                    <table>
                        <tr>
                            <td>Zwischen</td>
                            <td>{{ (Object.keys(this.orders).length > 0) ? ((Object.keys(this.orders).map((product) => {
                                return products[product].price * orders[product]
                            }).reduce((a, b) => a + b) / 100).toFixed(2)) : 0 }}€</td>
                        </tr>
                        <tr>
                            <td>Pfand</td>
                            <td>{{ (Object.keys(this.orders).length > 0) ? ((Object.keys(this.orders).map((product) => {
                            return products[product].deposit * orders[product]
                        }).reduce((a, b) => a + b) / 100).toFixed(2)) : 0 }}€</td>
                        </tr>
                        <tr>
                            <td><b>Total</b></td>
                            <td><b>{{ (Object.keys(this.orders).length > 0) ? ((Object.keys(this.orders).map((product) => {
                                return products[product].price * orders[product]
                            }).reduce((a, b) => a + b) / 100 + Object.keys(this.orders).map((product) => {
                                return products[product].deposit * orders[product]
                            }).reduce((a, b) => a + b) / 100).toFixed(2)) : 0 }}€</b></td>
                        </tr>
                    </table>
                </div>
                <div style="display: flex">
                    <div style="background: forestgreen" @click="placeOrder" class="product_button_action">OK</div>
                    <div style="background: indianred" @click="clearOrder" class="product_button_action">CL</div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <h1>Select cashpoint</h1>
        <select>
            <option v-for="cashpoint in Object.keys(cashpoints)" :key="cashpoint" @click="setup(cashpoint)">
                {{ cashpoints[cashpoint].name }}
            </option>
        </select>
    </div>
</template>