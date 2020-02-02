import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: require('@/views/Home').default
  },
  {
    path: '/movies',
    name: 'movies',
    component: require('@/views/Movies').default,
    meta: {
      type: 'movie',
      title: 'Movies'
    }
  },
  {
    path: '/movies/:id',
    name: 'movie',
    component: require('@/views/Media').default,
    meta: {
      type: 'movie',
      title: 'Movies'
    }
  },
  {
    path: '/tv-shows',
    name: 'tv-shows',
    component: require('@/views/TVShows').default,
    meta: {
      type: 'tv',
      title: 'TV'
    }
  },
  {
    path: '/tv-shows/:id',
    name: 'tv',
    component: require('@/views/Media').default,
    meta: {
      type: 'tv',
      title: 'TV'
    }
  },
  {
    path: '/tv-shows/:id/season/:season',
    name: 'season',
    component: require('@/views/Season').default,
    meta: {
      type: 'tv',
      title: 'TV'
    }
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

export default router
