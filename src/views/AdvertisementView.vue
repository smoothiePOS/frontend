<script lang="ts">

import {defineComponent} from "vue";
import config from "@/config";

interface product {
    id: string
    name: string
    price: number
    description: string
    image: string
    available: boolean
}

export default defineComponent({
    name: 'AdvertisementView',
    computed: {
        config() {
            return config
        }
    },
    data() {
        return {
            products: [] as product[],
            fullscreenProductId: "",
            adOpacity: 0,
            firstRun: true,
            loadedImages: 0
        }
    },
    methods: {
        async update() {
            fetch(config.baseUrl + "/advertisement/product")
                .then(response => response.json())
                .then(data => {
                    this.products = data;
                    if (this.firstRun) {
                        this.products.forEach(product => {
                            let img = new Image();
                            img.src = product.image;
                            this.loadedImages++;
                        })
                        this.firstRun = false;
                    }
                })
                .catch(error => console.error(error));
        },
        async nextAd() {
            const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
            if (this.products.length == 0 || this.loadedImages < this.products.length - 1) {
                await sleep(1000);
                await this.nextAd();
                return;
            }
            this.nextAdUrl();
            await sleep(config.advertisement.adInterval);
            let currentProduct = this.products.find(product => product.id == this.fullscreenProductId) as product;
            if (!this.products.find(product => product.id == this.fullscreenProductId)!!.available)this.nextAdUrl();
            this.adOpacity = 0;
            await sleep(1000);
            this.adOpacity = 1;
            console.log("show ad " + currentProduct.name)
            await sleep(config.advertisement.adDuration)
            this.adOpacity = 0;
            console.log("hide ad " + currentProduct.name)
            await this.nextAd();
        },
        nextAdUrl() {
            if (this.fullscreenProductId == "") this.fullscreenProductId = this.products[0].id;
            else {
                while (true) {
                    let index = this.products.findIndex(product => product.id == this.fullscreenProductId);
                    if (index == this.products.length - 1) this.fullscreenProductId = this.products[0].id;
                    else this.fullscreenProductId = this.products[index + 1].id;
                    if (this.products.find(product => product.id == this.fullscreenProductId)?.available) break;
                }
            }
        }
    },
    async mounted() {
        window.document.title = "smoothiePOS - Advertisement";
        setInterval(() => {
            this.update();
        }, 1000);
        await this.nextAd()
    }
})
</script>

<template>
    <div id="content">
        <h1 style="font-size: 70px; font-family: 'Brixton Outline Lt',cursive; text-align: center; padding: 0; margin: 10px">
            {{ config.advertisement.title }}<span v-show="loadedImages < products.length-1">{{ loadedImages }} / {{ products.length }} Bilder geladen...</span></h1>
        <div id="products">
            <div v-for="product in this.products" :key="product"
                 :class="!product.available ? 'disabled product' : 'product'">
                <img :src="product.image" alt="" class="product_image">
                <div style="margin-left: 10px">
                    <h2 style="font-family: 'Brixton Outline Lt', serif;">{{ product.name }}</h2>
                    <h3 style="font-family: 'Brixton Lt',serif">{{ (product.price / 100).toFixed(2) }} €</h3>
                    <p style="font-family: 'Brixton Lt',serif" class="product_description"
                       v-html="product.available ? (product.description === null ? '&nbsp;' : product.description) : 'Kurzzeitig nicht verfügbar'"></p>
                </div>
            </div>
        </div>
    </div>
    <img :src="config.adFullSizeImageBaseUrl + this.fullscreenProductId + '.png'" alt="" id="product_fullscreen_ad">
</template>

<style scoped>
#content {
    width: 100vw;
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

#product_fullscreen_ad {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    opacity: v-bind(adOpacity);
    transition: opacity 1s;
    object-fit: fill;
}
</style>