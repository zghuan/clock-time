import Vue from 'vue'
import Router from 'vue-router'
import clock from '@/components/clock.vue'
import second from '@/components/second.vue'
import timer from '@/components/timer.vue'
import my from '@/components/my.vue'
import addclock from '@/components/addclock.vue'
import editclock from '@/components/editclock.vue'
import sound from '@/components/sound.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/clock'
    },
    { 
      path:'/clock',
      name: '闹钟',
      component: clock,
      meta:{navShow:true}
    },
    {
      path:'/addclock',
      name:'添加闹钟',
      component:addclock,
      meta:{navShow:false}
    },
    {
      path:'/editclock',
      name:'编辑闹钟',
      component:editclock,
      meta:{navShow:false}
    },
    {
      path: '/second',
      name: '秒表',
      component: second,
      meta:{navShow:true}
    },
    {
      path: '/timer',
      name: '计时器',
      component: timer,
      meta:{navShow:true}
    },
    {
      path: '/sound',
      name: '铃声',
      component: sound,
      meta:{navShow:false}
    },
    {
      path: '/my',
      name: '世界时钟',
      component: my,
      meta:{navShow:true}
    }
  ],
  //linkActiveClass:'yd-active'
})
