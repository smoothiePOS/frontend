<script lang="ts">
import {defineComponent} from "vue";
import StatisticsComponent from "@/components/statistics/StatisticsComponent.vue";

export default defineComponent({
    name: 'StatisticsView',
    components: {StatisticsComponent}
})
</script>

<template>
<h1>Statistics</h1>
    <StatisticsComponent to="0" from="0"></StatisticsComponent>
</template>

<style scoped>

</style>