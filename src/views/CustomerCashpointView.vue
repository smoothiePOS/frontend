<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: 'CustomerCashpointView',
    props: ['id'],
    data() {
        return {
            id: this.$props.id,
            dateString: ""
        }
    },
    mounted() {
        setInterval(() => {
            this.dateString = new Date().toLocaleString()
        }, 1000)
    },
    methods: {
        fullscreen() {
            document.body.requestFullscreen()
        }
    }
});
</script>

<template>
    <div id="cashpoint_customer_root" @click="fullscreen">
        <div id="cashpoint_customer_footer"><span id="cashpoint_customer_footer_sum" v-if="true">Summe: 0,00€</span><span v-else>Herzlich willkommen</span><span id="cashpoint_customer_footer_date">{{ this.dateString }}</span></div>
    </div>
</template>

<style scoped>
#cashpoint_customer_root {
    background-image: url("@/assets/background.jpg");
    background-size: cover;
    background-position: center;
    width: 100vw;
    height: 100vh;
}

#cashpoint_customer_footer {
    position: fixed;
    bottom: 0;
    height: 60px;
    width: 100vw;
    background-color: rgba(0,0,0,0.7);
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
</style>