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
    computed: {
        config() {
            return config
        }
    },
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
            deposit: 0,
            sum: 0,
            adUUID: ""
        }
    },
    mounted() {
        setInterval(() => {
            this.dateString = new Date().toLocaleString()
            this.getOrder()
        }, 500)
        this.getRandomAd()
        setInterval(() => {
            this.getRandomAd()
        }, 10000)
    },
    methods: {
        fullscreen() {
            document.body.requestFullscreen()
        },
        getOrder() {
            fetch(config.baseUrl + "/cashpoint/" + this.id + "/order/rt/customer")
                .then(response => response.json())
                .then(data => {
                    this.order = []
                    this.items = 0
                    this.deposit = 0
                    this.sum = 0
                    data.forEach((item: orderDetail) => {
                        this.order.push(item)
                        this.items += item.amount
                        this.deposit += item.deposit * item.amount
                        this.sum = this.sum + item.price * item.amount
                    })
                    this.infoText = this.INFOTEXT
                    this.problem = false
                })
                .catch(() => {
                    this.infoText = "Keine Serververbindung!"
                    this.problem = true
                })
        },
        getRandomAd() {
            let oldUUID = this.adUUID
            fetch(config.baseUrl + "/product/random/available")
                .then(response => response.text())
                .then(data => {
                    this.adUUID = data
                    if (oldUUID == this.adUUID) this.getRandomAd()
                })

        }
    }
});
</script>

<template>
    <div id="cashpoint_customer_root" @click="fullscreen">
        <div id="cashpoint_customer_data">
            <div v-if="this.order.length > 0">
                <table id="cashpoint_customer_data_table">
                    <tr v-for="orderDetail in order" :key="orderDetail">
                        <td>{{ orderDetail.productName }}</td>
                        <td>x{{ orderDetail.amount }}</td>
                        <td>{{ (orderDetail.price * orderDetail.amount / 100).toFixed(2) }}€</td>
                    </tr>
                    <tr v-if="deposit != 0">
                        <td>Pfand</td>
                        <td>x{{ items }}</td>
                        <td>{{ (deposit / 100).toFixed(2) }}€</td>
                    </tr>
                </table>
            </div>
            <div v-else id="cashpoint_customer_ad">
                <img id="cashpoint_customer_ad_img" v-show="this.adUUID != ''"
                     :src="config.advertisement.fullSizeImageBaseUrl + this.adUUID + config.advertisement.fullSizeImageExtension"
                     alt="">
            </div>
        </div>
        <div id="cashpoint_customer_footer"><span id="cashpoint_customer_footer_sum"
                                                  v-if="this.order.length > 0">Summe: {{
                ((sum + deposit) / 100).toFixed(2)
            }}€</span><span v-else :class="this.problem ? 'blinking' : '' ">{{
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

#cashpoint_customer_ad {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    max-height: calc(100vh - 80px);
}

#cashpoint_customer_ad_img {
    object-fit: contain;
    max-width: 90vw;
    max-height: calc(100vh - 150px);
    border-radius: 10px;
}

#cashpoint_customer_data {
    position: fixed;
    display: flex;
    justify-content: center;
    padding-top: 20px;
    font-size: 40px;
    width: 100vw;
    background: rgba(0, 0, 0, 0.3);
    height: calc(100vh - 80px);
}

#cashpoint_customer_footer {
    position: fixed;
    bottom: 0;
    height: 60px;
    width: 100vw;
    background-color: rgba(0, 0, 0, 0.9);
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

/*noinspection CssUnusedSymbol*/
.blinking {
    animation: blinkingText 1s infinite;
}

#cashpoint_customer_data_table {
    margin-top: 40px;
    border-collapse: collapse;
}

#cashpoint_customer_data_table td {
    border-bottom: 1pt solid white;
    margin: 5px;
}

#cashpoint_customer_data_table tr:last-child {
    padding-top: 5px;
    border-top: 1pt solid white;
    font-style: italic;
}

#cashpoint_customer_data_table tr td:nth-child(1) {
    width: 70vw;
}

#cashpoint_customer_data_table tr td:nth-child(2) {
    width: 10vw;
}

#cashpoint_customer_data_table tr td:nth-child(3) {
    width: 10vw;
    text-align: end;
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