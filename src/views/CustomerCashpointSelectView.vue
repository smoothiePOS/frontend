<script lang="ts">
import {defineComponent} from "vue";
import config from "@/config";

interface cashpoint {
    name: string,
    id: string | undefined,
    available: boolean
}

export default defineComponent({
    name: 'CustomerCashpointSelectView',
    data() {
        return {
            cashpoints: {} as { [key: string]: cashpoint },
        }
    },
    mounted() {
        this.getCashpoints()
    },
    methods: {
        getCashpoints() {
            fetch(config.baseUrl + "/cashpoints")
                .then(response => response.json())
                .then(data => {
                    this.cashpoints = data.cashpoints;
                });
        },
    }
});
</script>

<template>
    <div v-if="this.cashpoint !== undefined"></div>
    <div v-else>
        <h1>Select cashpoint</h1>
        <ul>
            <li v-for="cashpoint in Object.keys(this.cashpoints)" :key="cashpoint">
                <router-link :to="'/cashpoint/customer/' + cashpoint">{{ cashpoints[cashpoint].name }}</router-link>
            </li>
        </ul>
    </div>
</template>

<style scoped>
a {
    color: white;
}
</style>