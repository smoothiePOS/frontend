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


.payment {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .8);
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    vertical-align: center;
}

.payment > div {
    vertical-align: center;
    background: #050505;
    padding: 10px;
}

#payment_keypad {
    display: flex;
}

#payment_keypad td {
    width: 80px;
    height: 80px;
    font-size: 40px;
    text-align: center;
    vertical-align: center;
    background: orange;
    outline: 1pt solid #050505;
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

class Product {
    public name: string;
    public price: number;
    public available: boolean;
    public deposit: number;

    constructor(name: string, price: number, deposit: number, available: boolean) {
        this.name = name;
        this.price = price;
        this.deposit = deposit;
        this.available = available;
    }
}

export default defineComponent({
    name: 'CashpointView',
    props: ["id"],
    data() {
        return {
            products: {} as { [key: string]: Product },
            orders: {} as { [key: string]: number },
            timer: -1,
            lastOrderId: "",
            debug: config.debug,
            enteredAmount: "0",
            showKeypad: false,
            id: this.$props.id
        }
    },
    mounted() {
        this.update();
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        changeProduct(product: string, amount: number | undefined) {
            if (this.products[product].available) {
                fetch(config.baseUrl + "/cashpoint/" + this.id + "/order/rt", {
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
                            delete this.orders[product.id];
                        }
                    })
                    console.log(data);
                });
        },
        openKeypad() {
            if (Object.keys(this.orders).length > 0) {
                this.enteredAmount = "0";
                this.showKeypad = true;
            }
        },
        placeOrder() {
            fetch(config.baseUrl + "/cashpoint/" + this.id + "/order/rt/confirm")
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
        setup() {
            this.timer = setInterval(() => {
                this.update()
            }, 1000);
        },
        clearOrder() {
            if (confirm("Diese Bestellung wirklich löschen?")) {
                fetch(config.baseUrl + "/cashpoint/" + this.id + "/order/rt/clear")
                    .then(response => response.text())
                    .then(data => {
                        if (data === "OK") this.orders = {};
                    })
            }
        },
        addEnteredAmount(char: string) {
            if (char == "," && this.enteredAmount.includes(",")) {
                return;
            }
            if (this.enteredAmount.includes(",") && this.enteredAmount.split(",")[1].length >= 2) {
                return;
            }
            if (char == "0" && this.enteredAmount == "0") {
                return;
            }
            if (this.enteredAmount == "0") {
                if (char == ",") {
                    this.enteredAmount += char;
                } else {
                    this.enteredAmount = char;
                }
            } else {
                this.enteredAmount += char;
            }
        },
        removeEnteredAmount() {
            this.enteredAmount = this.enteredAmount.substring(0, this.enteredAmount.length - 1);
            if (this.enteredAmount == "") {
                this.enteredAmount = "0";
            }
        },
    }
})
</script>

<template>
    <div class="cashpoint">
        <div style="position:absolute; top: 0; z-index: 20" v-show="lastOrderId !== '' && this.debug">Last Order Id:
            {{ this.lastOrderId }}
        </div>
        <div class="product_buttons">
            <h1 @click="fullscreen()">Cashpoint</h1>
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
                            <td>{{
                                    (Object.keys(this.orders).length > 0) ? ((Object.keys(this.orders).map((product) => {
                                        return products[product].price * orders[product]
                                    }).reduce((a, b) => a + b) / 100).toFixed(2)) : 0
                                }}€
                            </td>
                        </tr>
                        <tr>
                            <td>Pfand</td>
                            <td>{{
                                    (Object.keys(this.orders).length > 0) ? ((Object.keys(this.orders).map((product) => {
                                        return products[product].deposit * orders[product]
                                    }).reduce((a, b) => a + b) / 100).toFixed(2)) : 0
                                }}€
                            </td>
                        </tr>
                        <tr>
                            <td><b>Total</b></td>
                            <td><b>{{
                                    (Object.keys(this.orders).length > 0) ? ((Object.keys(this.orders).map((product) => {
                                        return products[product].price * orders[product]
                                    }).reduce((a, b) => a + b) / 100 + Object.keys(this.orders).map((product) => {
                                        return products[product].deposit * orders[product]
                                    }).reduce((a, b) => a + b) / 100).toFixed(2)) : 0
                                }}€</b></td>
                        </tr>
                    </table>
                </div>
                <div style="display: flex">
                    <div style="background: forestgreen; user-select: none" @click="openKeypad()"
                         class="product_button_action">OK
                    </div>
                    <div style="background: indianred" @click="clearOrder" class="product_button_action">CL</div>
                </div>
            </div>
        </div>
    </div>

    <div class="payment" v-show="this.showKeypad">
        <div>
            <h1>Payment</h1>
            <div id="payment_entered" style="font-size: 40px; outline: 1pt solid gray">{{ enteredAmount }}€</div>
            <div id="payment_keypad">
                <table style="user-select: none; border-collapse: collapse">
                    <tr>
                        <td @click="addEnteredAmount('9')">9</td>
                        <td @click="addEnteredAmount('8')">8</td>
                        <td @click="addEnteredAmount('7')">7</td>
                        <td rowspan="2" style="background: green" @click="placeOrder(); this.showKeypad = false">OK</td>
                    </tr>
                    <tr>
                        <td @click="addEnteredAmount('6')">6</td>
                        <td @click="addEnteredAmount('5')">5</td>
                        <td @click="addEnteredAmount('4')">4</td>
                    </tr>
                    <tr>
                        <td @click="addEnteredAmount('3')">3</td>
                        <td @click="addEnteredAmount('2')">2</td>
                        <td @click="addEnteredAmount('1')">1</td>
                        <td @click="this.showKeypad = false" style="background: indianred">X</td>
                    </tr>
                    <tr>
                        <td @click="addEnteredAmount('0')" colspan="2">0</td>
                        <td @click="addEnteredAmount(',')">,</td>
                        <td @click="removeEnteredAmount()">&lt;</td>
                    </tr>
                </table>
                <div style="margin-left: 5px">
                    <h2>Zu zahlen: {{
                            (Object.keys(this.orders).length > 0) ? ((Object.keys(this.orders).map((product) => {
                                return products[product].price * orders[product]
                            }).reduce((a, b) => a + b) / 100 + Object.keys(this.orders).map((product) => {
                                return products[product].deposit * orders[product]
                            }).reduce((a, b) => a + b) / 100).toFixed(2)) : 0
                        }}€</h2>
                    <h2>Gegeben: {{ parseFloat(this.enteredAmount.replace(",", ".")).toFixed(2) }}€</h2>
                    <h2>Rückgeld: {{
                            (parseFloat(this.enteredAmount.replace(",", ".")).toFixed(2) - ((Object.keys(this.orders).length > 0) ? ((Object.keys(this.orders).map((product) => {
                                return products[product].price * orders[product]
                            }).reduce((a, b) => a + b) / 100 + Object.keys(this.orders).map((product) => {
                                return products[product].deposit * orders[product]
                            }).reduce((a, b) => a + b) / 100).toFixed(2)) : 0)).toFixed(2)
                        }}€</h2>
                </div>
            </div>
        </div>
    </div>
</template>