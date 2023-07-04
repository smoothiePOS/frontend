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
            cashpoints: [] as cashpoint[],
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
                    Object.keys(data).forEach(key => {
                        this.cashpoints.push({
                            name: data[key].name,
                            id: key,
                            available: data[key].available
                        })
                    })
                });
        },
    }
});
</script>

<template>
    <div>
        <h1>Select cashpoint</h1>
        <ul>
            <li v-for="cashpoint in this.cashpoints" :key="cashpoint">
                <router-link :to="'/cashpoint/customer/' + cashpoint.id">{{ cashpoint.name }}</router-link>
            </li>
        </ul>
    </div>
</template>

<style scoped>
a {
    color: white;
}
</style>