import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { settingsRoutes } from './settings'
import { ref } from 'vue'
import { dexRoutes } from './dex'

export const latestSettingsRoute = ref( '/settings/' + settingsRoutes[0].path)
export const latestDexRoute = ref( '/dex/' + (dexRoutes[0].noParamPath || dexRoutes[0].path) )

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/dex',
      name: 'dex',
      component: () => import('../views/DexView.vue'),
      children: dexRoutes,
      // Warning this cannot be the same keepAliveIdAsAnother one
      // If you do this will show up :
      //  Uncaught (in promise) TypeError: parentComponent.ctx.deactivate is not a function
      // also this needs to be paired in App.vue with the keep alive which really something that may me doubt using vue
      meta: { keepAlive: 1 },
      redirect: () => {
        return latestDexRoute.value
      }
    },
    {
      path: '/builder',
      name: 'builder',
      component: () => import('../views/BuilderView.vue'),
      children: [],
      meta: { keepAlive: 2 }
    },
    {
      path: '/calc',
      name: 'calc',
      component: () => import('../views/CalcView.vue'),
      children: [],
      meta: { keepAlive: 3 }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      children: settingsRoutes.map(x => {
        return {
          path: x.path,
          name: 'settings' + x.name,
          component: x.component
        }
      }),
      redirect: () => {
        return latestSettingsRoute.value
      }
    },
  ]
})

router.beforeEach((to)=>{
  if (to.fullPath.includes('/settings/')){
    latestSettingsRoute.value = to.fullPath
  }
  if (to.fullPath.includes('/dex/')){
    latestDexRoute.value = to.fullPath
  }
})

export default router
