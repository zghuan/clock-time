<template>
    <div id="app">
      <!-- 头部导航 -->
      <yd-navbar :title="this.$route.name" bgcolor="rgb(22,29,21)" color="#fff" fontsize="0.35rem" v-show="isNavShow">
        <!-- 添加闹钟 -->
            <router-link to="/addclock" slot="right" v-show="showMore">
                <yd-icon name="feedback" color='#fff'></yd-icon>
            </router-link>
            <router-link to="/clock" slot="left" v-show="showCancel" @click.native="begin_clock_data">
                <yd-icon name="error" color="#fff"></yd-icon>
            </router-link>
            <router-link to="/clock" slot="right" v-show="showCancel" @click.native="add_clock_data">
                <yd-icon name="checkoff" color="#fff"></yd-icon>
            </router-link>
        <!-- 编辑闹钟 -->
            <router-link to="/clock" slot="left" v-show="showEditCancel">
                <span style="color:#fff">取消</span>
            </router-link>
            <router-link to="/clock" slot="right" v-show="showEditSure">
                <span style="color:#fff">完成</span>
            </router-link>
        <!-- 倒计时 -->
            <router-link to="/timer" slot="left" v-show="showCancels" @click.native="cancel">
                <span style="color:#fff">{{cancelOrBack}}</span>
            </router-link>
            <router-link to="" slot="right" v-show="showConfrim">
                <span style="color:#fff" @click="toBeSure">确定</span>
            </router-link>
            <router-link to="/sound" slot="right" v-show="showSound" >
                <span style="color:#fff" @click="goLocal">铃声</span>
            </router-link>
      </yd-navbar>


      <!-- 渲染的组件 -->
    <transition :name="transitionName">
        <keep-alive  exclude="addclock,clock">
            <router-view class="child-view"></router-view>
        </keep-alive>
    </transition>
     

      <!-- 尾部导航 -->
    <yd-tabbar :fixed="position" activeColor='#999' v-show="$route.meta.navShow">
        <yd-tabbar-item title="闹钟" link="/clock" :active="abc">
            <yd-icon name="clock" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="秒表" link="/second" :active="abc">
            <yd-icon name="discover" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="计时器" link="/timer" :active="abc" :dot="isDot">
            <yd-icon name="time" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
        <yd-tabbar-item title="世界时钟" link="/my" :active="abc">
            <!-- <img src="./../static/image/earth.svg"> -->
            <yd-icon name="ucenter" slot="icon" size="0.54rem"></yd-icon>
        </yd-tabbar-item>
    </yd-tabbar>
    </div>
</template>
<style scoped lang="less">
@import "assets/baseColor.less";
@import "assets/app.css";

</style>
<script>
import bus from './components/common/bus.js';
export default {
  name: 'App',
  data(){
    return{
        showEditCancel:false,
        showEditSure:false,
        transitionName:'',
        isNavShow:true,
        showMore:false,
        showSound:false,
        showCancel:false,
        showCancels:false,
        abc:true,
        showConfrim:false,
        isDot:false,
        search:false,
        names:'',
        a:'',
        position:true,
        cancelOrBack:'取消',
        picked:'', //选中状态
        urled:'' ,//清空歌曲路径,
    }
  },
  
  methods:{
//取消添加闹钟
    begin_clock_data(){
        console.log('取消')
      },


//添加闹钟
    add_clock_data(){ 
        const obj = {
            time:this.$store.state.clock_time,
            second:this.$store.state.clock_second,
            day:this.$store.state.clock_day,
            note:this.$store.state.clock_note,
            mark:this.$store.state.clock_mark,
            name:this.$store.state.clock_play_sound,
        },
        zghSecond = {
            zgh:this.$store.state.zgh
        }
//把闹钟数据存入localstorage
    this.$store.state.arrays.push(obj)
    this.$store.state.zgharr.push(zghSecond)
     const ls_clock = JSON.stringify(this.$store.state.arrays);
     localStorage.setItem('ls_clock', ls_clock);
     const zgh = JSON.stringify(this.$store.state.zgharr);
     localStorage.setItem('zgh', zgh);
},



    cancel(){
        this.showConfrim = false
        bus.$emit("urled",this.urled);
      },
//防止刷新浏览器按钮状态消失
    loading(){
        this.showNaving(this.$route.path)
      },
    showNaving(path){
        if(path == '/clock'){
            this.showMore = true
        }else{
            this.showMore = false
        }
        if(path == '/timer'){
            this.showSound = true
        }else{
            this.showSound = false
        }
        if(path == '/addclock'){
            this.showCancel = true
        }else{
            this.showCancel = false
        }
        if(path == '/my'){
            this.isNavShow = false
        }else{
            this.isNavShow = true
        }
    },
//获取歌名传给页面播放
    goLocal(){
        const changeMusicName = localStorage.getItem('strMusic') ||'[]';
        const musicContent = JSON.parse(changeMusicName);
        this.picked = musicContent.picked
        bus.$emit("pickeds",this.picked);
        //console.log(this.picked)
    },
//切换铃声存localstorage
    toBeSure(){
        this.addAudioName(this.names,this.a)
        this.cancelOrBack = '返回'
    },
    addAudioName(musicName,index){
          const obj = {
              musicName:musicName,
              picked:index
          };
          const strMusic = JSON.stringify(obj);
          localStorage.setItem('strMusic', strMusic);
  },
},
mounted(){
        const _this = this
		bus.$on('msg',function(zgh){
            _this.showConfrim = zgh;
        }),
        bus.$on('mes',function(zgh){
            _this.isDot = zgh
        }),
        bus.$on("msg_localStorage",function(names,a){
            _this.names = names,
            _this.a = a
        });
      window.addEventListener('load',this.loading) //刷新页面保持头部导航隐藏
  },
  watch:{
      $route(to,from){
          if(to.path == '/clock'){
              this.showMore = true
          }else{
              this.showMore = false
          }
          if(to.path == '/timer'){
              this.showSound = true
          }else{
              this.showSound = false
          }
           if(to.path == '/my'){
              this.isNavShow = false
          }else{
              this.isNavShow = true
          }
          if(from.path=='/clock' && to.path == '/addclock'){
              this.showCancel = true
          }else{
              this.showCancel = false
          }
          if(from.path=='/clock' && to.path == '/editclock'){
              this.showEditCancel = true
              this.showEditSure = true
          }else{
              this.showEditCancel = false
              this.showEditSure = false
          }
          if(from.path == '/timer' && to.path == '/sound'){
              this.showCancels = true
          }else{
              this.showCancels = false
          }
          if(from.path == '/clock' && ( to.path == '/second'|| to.path == '/timer'|| to.path == '/my'||to.path == '/addclock'||to.path == '/editclock')){
              this.transitionName = 'slide-left'
          }
          else if(from.path == '/second' && ( to.path == '/timer'|| to.path == '/my')){
              this.transitionName = 'slide-left'
          }
          else if(from.path == '/timer' &&  (to.path == '/my'|| to.path == '/sound')){
              this.transitionName = 'slide-left'
          }else{
              this.transitionName = 'slide-right'
          }
          
    },
  }


}
</script>


