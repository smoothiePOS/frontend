<script lang="ts">
import {defineComponent} from "vue";
import StatisticsComponent from "@/components/statistics/StatisticsComponent.vue";

export default defineComponent({
    name: 'StatisticsView',
    components: {StatisticsComponent},
    data() {
        return {
            start: 0,
            end: 0
        }
    },
    beforeMount() {
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        this.start = date.getTime()/1000

        date.setHours(23, 59, 59, 999)
        this.end = Math.floor(date.getTime()/1000)
    }
})
</script>

<template>
<h1>Statistics</h1>
    <StatisticsComponent :start="this.start" :end="this.end"></StatisticsComponent>
</template>

<style scoped>

</style>