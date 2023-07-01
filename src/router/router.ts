import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CashpointView from "@/views/CashpointView.vue";
import CustomerCashpointView from "@/views/CustomerCashpointView.vue";
import CustomerCashpointSelectView from "@/views/CustomerCashpointSelectView.vue";
import KitchenView from "@/views/KitchenView.vue";
import CashpointSelectView from "@/views/CashpointSelectView.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/cashpoint/staff',
        name: 'cashpoint-staff',
        component: CashpointSelectView
    },
    {
        path: '/cashpoint/staff/:id',
        name: 'cashpoint-staff-id',
        component: CashpointView,
        props: true
    },
    {
        path: '/cashpoint/customer/:id',
        name: 'cashpoint-customer-id',
        component: CustomerCashpointView,
        props: true
    },
    {
        path: '/cashpoint/customer',
        name: 'cashpoint-customer',
        component: CustomerCashpointSelectView,
        props: false
    },
    {
        path: '/kitchen',
        name: 'kitchen',
        component: KitchenView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
