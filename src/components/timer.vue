<template>
  <div class="re-time">
<!-- 时间选择器 -->
      <div class='showtime' v-show="isShowTime">
          <yd-datetime type="time" v-model="datetime" confirm-text="确定" ref="datetime" :callback="sure"></yd-datetime>  
      </div>
<!-- 倒计时开始 -->
      <div class="countDown" v-show="!isShowTime">
          <yd-countdown :time="secondCount" timetype="second" :callback="over">
            <span>{%h}<i>:</i></span>
            <span>{%m}<i>:</i></span>
            <span>{%s}<i></i></span>
          </yd-countdown>
      </div>
<!-- 时间选择按钮 -->
      <yd-button size="large" type="hollow" @click.native="opening" :disabled="disabled" :bgcolor="bgcolor" :color="color">
        选择时间
      </yd-button>
<!-- 倒计时功能键 -->
      <yd-flexbox>
          <yd-flexbox-item>
              <yd-button size="large" type="hollow" v-show="isGoing" @click.native="move" :bgcolor="bgcolor2" :color="color2">启动</yd-button>
              <yd-button size="large" type="hollow" v-show="!isGoing" @click.native="stop">暂停</yd-button>
          </yd-flexbox-item>
          <yd-flexbox-item>
            <yd-button size="large" type="hollow" @click.native="reseted" :bgcolor="bgcolor2" :color="color2">复位</yd-button>
          </yd-flexbox-item>
      </yd-flexbox>
      <audio :src="urling"  autoplay loop ref="audio"></audio>
      <!-- <h1>暂停功能无法完成,调用时间倒计时组件，没有暴露出暂停的api</h1> -->
  </div>
</template>
<style scoped>
  .showtime{width: 100%;height: 4rem;color: #000;font-size: 1.5rem;text-align: center}
  .countDown{font-size: 1.5rem;text-align: center;line-height: 4rem;}
  .yd-datetime-input{height: 4rem;line-height: 4rem;}
  .yd-btn-block{font-family: "Microsoft","微软雅黑";margin-top: 0}
</style>

<script>
import {CountDown} from 'vue-ydui/dist/lib.rem/countdown';
import {Alert} from 'vue-ydui/dist/lib.rem/dialog';
import bus from './common/bus.js';
export default {
  name: 'timer',
  data(){
    return{
      datetime: '',
      isShowTime:true,
      secondCount:0,
      isGoing:true,
      disabled:false,
      bgcolor2:'',
      bgcolor:"",
      color:'',
      color2:'',
      urling:'',
      name:'',
      paused:true,
      isHot:true,
      status:false,//状态
    }
  },
  methods:{
//打开时间选择器
    opening:function(){
       this.$refs.datetime.open()
     },
//选择确定后的回调函数
    sure(){
      const countHour = parseInt(this.$refs.datetime._props.currentHour)
      const countMinute =parseInt(this.$refs.datetime._props.currentMinute)
      const result = countHour*3600 + countMinute*60
      this.secondCount = result
     },
//启动计时器
    move:function(){
      this.status = true
      let zgh = this.$refs.datetime.currentValue
       if(zgh == '00:00'){
         this.$dialog.alert({ mes: '先选择时长再启动喔!' });
       }else{
         this.isShowTime = false//跳转到计时器页面
         this.isGoing = false   //按键变为暂停键
         this.disabled = true //选择时间按钮禁用
         this.bgcolor = ''
         this.color = ''
       }
     },
//暂停计时器
     stop(){
        this.isGoing = true
        console.log('111')
     },
//复位计时器
     reseted(){
       this.datetime = '' //清空时间值
       this.urling = '' //清空歌曲路径
       this.secondCount = 0  //清空自动播放time
       this.isShowTime = true //转回默认页面
       this.isGoing = true //按键变为启动键
       this.disabled = false//选择时间按钮解禁
       this.bgcolor ='' 
       this.color = ''
       this.$refs.audio.pause() //暂停铃声播放
       this.status = false //状态
     },
//倒计时结束后的回调
  over(){
    if(this.status){
    bus.$emit("mes",this.isHot);//角标传入导航栏
    const getMusicName = JSON.parse(localStorage.getItem('strMusic') ||'[]');//localstorage获取保存的歌名
      this.name = getMusicName.musicName 
      this.play(this.name) //启动铃声播放
      this.$dialog.alert({
        mes: '预定时间已到',
        callback:()=>{
          this.reseted() 
          bus.$emit("mes",!this.isHot);//角标传入导航栏
        }
      })
      }else{
        return false
      }
    },
//执行播放歌曲
     play(named){
       const url = '../../static/music/' + named +'.mp3'
       this.urling = url
     }
  }
}
</script>