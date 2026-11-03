import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/catalog', name: 'Catalog', component: () => import('@/pages/CatalogPage.vue') },
  { path: '/product/:id', name: 'Product', component: () => import('@/pages/ProductPage.vue') },
  { path: '/cart', name: 'Cart', component: () => import('@/pages/CartPage.vue') },
  { path: '/checkout', name: 'Checkout', component: () => import('@/pages/CheckoutPage.vue') },
  { path: '/order/:id', name: 'Order', component: () => import('@/pages/OrderPage.vue') },
  { path: '/favorites', name: 'Favorites', component: () => import('@/pages/FavoritesPage.vue') },
  { path: '/credits', name: 'Credits', component: () => import('@/pages/CreditsPage.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/NotFoundPage.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    // Footer links point at home-page sections; wait for the page transition to finish first.
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ el: to.hash, top: 88, behavior: 'smooth' }), from.path === to.path ? 0 : 400)
      })
    }
    // Filtering the catalogue only changes the query: keep the reader where they are.
    if (to.name === 'Catalog' && from.name === 'Catalog') return false
    return { top: 0 }
  },
})

export default router
