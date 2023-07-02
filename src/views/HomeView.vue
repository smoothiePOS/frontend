<template>
    <h1>Home</h1>
    <ul>
        <li><router-link to="/cashpoint/staff">Cashpoint View</router-link></li>
        <li><router-link to="/cashpoint/customer">Cashpoint Customer View</router-link></li>
        <li><router-link to="/kitchen">Kitchen View</router-link></li>
    </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

export default defineComponent({
  name: 'HomeView',
  components: {
    HelloWorld,
  },
});
</script>

<style>
a {
    color: white;
}
</style>