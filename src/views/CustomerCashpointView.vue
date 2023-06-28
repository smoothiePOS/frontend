<script lang="ts">
import {defineComponent} from "vue";
import config from "@/config";

interface orderDetail {
    productName: string,
    price: number,
    amount: number,
    deposit: number,
}

export default defineComponent({
    name: 'CustomerCashpointView',
    props: ['id'],
    data() {
        return {
            id: this.$props.id,
            dateString: "",
            INFOTEXT: "Herzlich willkommen!",
            infoText: "Herzlich willkommen!",
            problem: false,
            order: [] as orderDetail[],
            items: 0,
            deposit: 0
        }
    },
    mounted() {
        setInterval(() => {
            this.dateString = new Date().toLocaleString()
            this.getOrder()
        }, 500)
    },
    methods: {
        fullscreen() {
            //document.body.requestFullscreen()
        },
        getOrder() {
            fetch(config.baseUrl + "/cashpoint/" + this.id + "/order/rt/customer")
                .then(response => response.json())
                .then(data => {
                    this.order = []
                    this.items = 0
                    this.deposit = 0
                    data.forEach((item: orderDetail) => {
                        this.order.push(item)
                        this.items += item.amount
                        this.deposit += item.deposit * item.amount
                    })
                    this.infoText = this.INFOTEXT
                    this.problem = false
                })
                .catch(() => {
                    this.infoText = "Keine Serververbindung!"
                    this.problem = true
                })
        }
    }
});
</script>

<template>
    <div id="cashpoint_customer_root" @click="fullscreen">
        <div id="cashpoint_customer_data">
            <div v-if="this.order.length > 0">
                <table>
                    <tr v-for="orderDetail in order" :key="orderDetail">
                        <td>{{ orderDetail.productName }}</td>
                        <td>{{ orderDetail.amount }}</td>
                        <td>{{ (orderDetail.price*orderDetail.amount/100).toFixed(2) }}€</td>
                    </tr>
                    <tr v-if="deposit != 0">
                        <td>Pfand</td>
                        <td>{{ items }}</td>
                        <td>{{ (deposit/100).toFixed(2) }}€</td>
                    </tr>
                </table>
            </div>
        </div>
        <div id="cashpoint_customer_footer"><span id="cashpoint_customer_footer_sum"
                                                  v-if="false">Summe: 0,00€</span><span v-else :class="this.problem ? 'blinking' : '' ">{{
                this.infoText
            }}</span><span id="cashpoint_customer_footer_date">{{ this.dateString }}</span></div>
    </div>
</template>

<style scoped>
#cashpoint_customer_root {
    background-image: url("@/assets/background.jpg");
    background-size: cover;
    background-position: center;
    width: 100vw;
    height: 100vh;
    user-select: none;
}

#cashpoint_customer_data {
    position: fixed;
    display: flex;
    justify-content: center;
    padding-top: 20px;
    font-size: 40px;
    width: 100vw;
    background: rgba(0, 0, 0, 0.7);
    height: calc(100vh - 80px);
}

#cashpoint_customer_footer {
    position: fixed;
    bottom: 0;
    height: 60px;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    color: white;
    font-size: 40px;
    line-height: 60px;
    padding: 10px;
}

#cashpoint_customer_footer_date {
    float: right;
    font-size: 40px;
    line-height: 60px;
    padding-right: 20px;
}

.blinking {
    animation: blinkingText 1s infinite;
}

@keyframes blinkingText {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>