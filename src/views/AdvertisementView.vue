<script lang="ts">

import {defineComponent} from "vue";
import config from "@/config";
import {isFunction} from "@vue/shared";

interface product {
    id: number
    name: string
    price: number
    description: string
    image: string
    available: boolean
}

export default defineComponent({
    name: 'AdvertisementView',
    data() {
        return {
            products: [] as product[]
        }
    },
    methods: {
        isFunction,
        update() {
            fetch(config.baseUrl + "/advertisement/product")
                .then(response => response.json())
                .then(data => {
                    this.products = data;
                    console.log(this.products)
                })
                .catch(error => console.error(error));
        }
    },
    mounted() {
        setInterval(() => {
            this.update();
        }, 1000);
    }
})
</script>

<template>
    <div id="content">
        <h1 style="font-size: 70px; font-family: 'Brixton Outline Lt',cursive; text-align: center; padding: 0; margin: 10px">Unser
            Angebot</h1>
        <div id="products">
            <div v-for="product in this.products" :key="product" :class="!product.available ? 'disabled product' : 'product'">
                <img :src="product.image" alt="" class="product_image">
                <div style="margin-left: 10px">
                    <h2 style="font-family: 'Brixton Outline Lt', serif;">{{ product.name }}</h2>
                    <h3 style="font-family: 'Brixton Lt',serif">{{ (product.price / 100).toFixed(2) }} €</h3>
                    <p style="font-family: 'Brixton Lt',serif" class="product_description" v-html="product.available ? (product.description === null ? '&nbsp;' : product.description) : 'Kurzzeitig nicht verfügbar'"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#content {
    width: 1920px;
    background: tan;
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: space-evenly;
}

.disabled h3 {
    text-decoration: line-through;
}

.disabled > img {
    filter: saturate(0%);
}

#products {
    display: grid;
    column-gap: 50px;
    row-gap: 50px;
    margin: 10px;
    grid-template-columns: 33% 33% 33%;
}

.product_description {
    font-family: "Brixton Rg", serif;
    padding: 5px;
    border: 1px solid transparent;
    font-size: 20px;
    max-width: 350px;
}

.product_description b {
    font-family: "Brixton Outline Bld", serif;
}
.disabled .product_description {
    border: 1px solid gray;
    border-radius: 10px;
    rotate: 6deg;
}

.product {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    transition: .5s;
}

.product_image {
    width: 10vw;
    height: 10vw;
    object-fit: cover;
    border-radius: 10px;
}

h2 {
    font-size: 30px;
    font-family: 'Arial', cursive;
    margin: 0;
    padding: 0;
}

h3 {
    font-size: 20px;
    font-family: 'Arial', cursive;
    margin: 0;
    padding: 0;
}
</style>