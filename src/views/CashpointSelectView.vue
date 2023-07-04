<script lang="ts">
import {defineComponent} from "vue";
import config from "@/config";

interface Cashpoint {
    id: string,
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
                console.log(data)
                Object.keys(data).forEach(key => {
                    this.cashpoints.push({
                        id: key,
                        name: data[key].name
                    })
                })
            });
    }
})
</script>

<template>
    <h2>Cashpoints - STAFF</h2>
    <ul>
        <li v-for="cashpoint in cashpoints" :key="cashpoint">
            <router-link :to="'/cashpoint/staff/' + cashpoint.id">{{ cashpoint.name }}</router-link>
        </li>
    </ul>
</template>