<script lang="ts">
import {defineComponent} from "vue";
import config from "@/config";

interface product {
    product: string
    amount: number
}

interface order {
    id: string
    products: product[]
    date: number
}

interface thing {
    id: string
    name: string
    available: boolean
}

export default defineComponent({
    name: 'KitchenView',
    data() {
        return {
            orders: [] as order[],
            config: config,
            managementOpen: false,
            ingredients: [] as thing[],
            products: [] as thing[]
        }
    },
    mounted() {
        this.getOrders()
        setInterval(() => {
            this.getOrders();
        }, 1000);
    },
    methods: {
        getOrders() {
            fetch(config.baseUrl + '/kitchen/orders')
                .then(response => response.json())
                .then(data => {
                    this.orders = data;
                    console.log(this.orders)
                });
        },
        finishOrder(orderId: string) {
            fetch(config.baseUrl + "/kitchen/order/" + orderId + "/finish")
                .then(response => response.text())
                .then(_ => {
                    this.getOrders();
                });
        },
        getProducts() {
            fetch(config.baseUrl + "/product")
                .then(response => response.json())
                .then(data => {
                    this.products = data;
                });
            fetch(config.baseUrl + "/ingredient")
                .then(response => response.json())
                .then(data => {
                    this.ingredients = data;
                });
        },
        updateThing(uuid: string, product: boolean) {
            if (product) {
                fetch(config.baseUrl + "/product/" + uuid + "/availability/" + !this.products.find(product => product.id === uuid)!!.available)
                    .then(_ => {
                        this.getProducts();
                    });
            } else {
                fetch(config.baseUrl + "/ingredient/" + uuid + "/availability/" + !this.ingredients.find(ingredient => ingredient.id === uuid)!!.available)
                    .then(_ => {
                        this.getProducts();
                    });
            }
        },
        openManagement() {
            if (this.managementOpen) {
                document.getElementById("product_management_button_img")!!.style.rotate = "0deg";
                document.getElementById("product_management_button")!!.style.background = "#42a97c";
                document.getElementById("product_management")!!.style.bottom = "0";
                document.getElementById("product_management")!!.style.background = "rgba(20, 20, 20, .7)";
                document.getElementById("product_management_content")!!.style.height = "0";
                this.managementOpen = !this.managementOpen
            } else {
                this.getProducts();
                document.getElementById("product_management_button_img")!!.style.rotate = "180deg";
                document.getElementById("product_management_button")!!.style.background = "#a90f0f";
                document.getElementById("product_management")!!.style.background = "rgba(10, 10, 10, .7)";
                document.getElementById("product_management_content")!!.style.height = "calc(100vh - 50px)";
                this.managementOpen = !this.managementOpen
            }
        }
    },
});
</script>

<template>
    <h1>Bestellungen</h1>
    <div id="content">
        <div>
            <div class="order" v-for="order in orders" :key="order">
                <!--suppress TypeScriptValidateTypes -->
                <div class="order_header">{{ new Date(order.date).toLocaleString("de-DE", config.dateFormat) }}</div>
                <div class="order_header_done" @click="finishOrder(order.id)">Beenden</div>
                <table class="order_table">
                    <tr v-for="product in order.products" :key="product">
                        <td style="width: 30vw">{{ product.product }}</td>
                        <td style="width: 5vw;">{{ product.amount }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <div id="product_management">
        <div>Produktverwaltung</div>
        <div id="product_management_button" @click="openManagement">
            <img src="@/assets/arrow_up.svg" alt="Product-management" id="product_management_button_img">
        </div>
        <div id="product_management_content">
            <h2>Zutaten</h2>
            <div class="product_management_things">
                <div v-for="ingredient in ingredients" :key="ingredient" class="product_management_thing" :class="(ingredient.available) ? 'product_management_thing_true' : 'product_management_thing_false'" @click="updateThing(ingredient.id, false)">
                    <div>{{ ingredient.name }}</div>
                </div>
            </div>
            <h2>Produkte</h2>
            <div class="product_management_things">
                <div v-for="product in products" :key="product" class="product_management_thing" :class="(product.available) ? 'product_management_thing_true' : 'product_management_thing_false'" @click="updateThing(product.id, true)">
                    <div>{{ product.name }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

#content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.order {
    width: 95vw;
    border: 1px solid white;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
}

.order_header {
    height: 50px;
    font-size: 30px;
    padding-left: 10px;
    line-height: 50px;
}

.order_header_done {
    margin-left: auto;
    font-size: 22px;
    height: 25px;
    background: #42a97c;
    padding: 7px;
    border-bottom-left-radius: 10px;
    user-select: none;
}

.order_table {
    display: block;
    flex-basis: 100%;
    border-collapse: collapse;
    border: 1px solid white;
    margin-left: 20px;
    margin-top: 20px;
    font-size: 20px;
}

.order_table td {
    border: 1px solid white;
    padding: 5px;
}

#product_management > div:first-child {
    position: absolute;
    height: 50px;
    line-height: 50px;
    align-self: start;
    font-size: 20px;
    left: 30px;
}

#product_management {
    position: fixed;
    background: rgba(20, 20, 20, .7);
    transition: .5s;
    bottom: 0;
    z-index: 5;
    width: 100vw;
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;
}

#product_management_button {
    background: #42a97c;
    width: 50px;
    transition: .5s;
    border-radius: 8px;
}

#product_management_button > img {
    margin: 0;
    padding: 0;
    transition: .5s;
    user-select: none;
}

#product_management_content {
    display: block;
    flex-basis: 100%;
    overflow: scroll;
    transition: .5s;
    height: 0;
    margin-left: 10px;
    margin-right: 10px;
}

.product_management_things {
    display: flex;
}

.product_management_thing {
    padding: 10px;
    margin: 5px;
    border-radius: 7px;
}

.product_management_thing_true {
    background: #42a97c;
}

.product_management_thing_false {
    background: #a90f0f;
}
</style>