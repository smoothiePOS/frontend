<script lang="ts">
import {defineComponent} from "vue";
import config from "@/config";

interface Cashpoint {
    id: number,
    name: string
}

export default defineComponent({
    name: 'CashpointSelectView',
    data() {
        return {
            cashpoints: [] as Cashpoint[]
        }
    },
    mounted() {
        fetch(config.baseUrl + "/cashpoints")
            .then(response => response.json())
            .then(data => {
                console.log(data.cashpoints)
                this.cashpoints = data.cashpoints
            });
    }
})
</script>

<template>
<h2>Cashpoints - STAFF</h2>
    <ul>
        <li v-for="cashpoint in Object.keys(cashpoints)" :key="cashpoint"><router-link :to="'/cashpoint/staff/' + cashpoint">{{ cashpoints[cashpoint].name }}</router-link></li>
    </ul>
</template>

<style scoped>

</style>