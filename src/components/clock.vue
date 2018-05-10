<template>
  <div class="alarm-block">
    <yd-cell-group>
        <yd-cell-item @touchstart.native="removeItems(index)" @touchend.native="clearLoop(index)" v-for='(data,index) in dataList' :key="data.id" :class="{bring:isActive[index]}" class="chooseItem" @click.native="goToEditclock(index)">
          <yd-icon name="clock" slot="left"></yd-icon>
            <div slot="left" class="clock_data">
                <span style="font-size:0.5rem">{{data.time}}</span><br>
                <span style="font-size:0.2rem">{{data.day}}</span>
            </div>
          <yd-switch slot="right" v-model="ydswitch[index]" @click.stop.native="switchs(index)" style="color:#34679a"></yd-switch>
        </yd-cell-item>
        <yd-actionsheet :items="myItems" v-model="showItem"></yd-actionsheet>
    </yd-cell-group>
    <audio :src="url"  ref="audio" loop autoplay></audio>
  </div>
</template>


<script type="text/babel">
import bus from './common/bus.js';
import store from './../store/index.js'
export default {
  name: 'clock',
  data () {
    return {
      message:[],//mock数据
      ydswitch:[],//开关
      isActive:[],//开关开启后的样式
      dataList:[],//存放闹钟内容
      timer:null, //长按定时器
      timed:null, //闹钟提醒定时器
      indexing:null, //删除索引
      showItem:false,//下拉菜单控制
      oldtime:[],//需要监听的闹钟秒数
      url:'',      //播放地址
      musicName:[],
      myItems: [ 
                {
                    label:'确定要删除该闹钟吗?',
                    stay: true
                },    
                {
                  label: '删除',
                    callback:() => {
                        this.dataList.splice(this.indexing, 1); //删除闹钟节点数据
                        this.ydswitch.splice(this.indexing,1);//绑定的开关一起删除
                        this.oldtime.splice(this.indexing,1) //把监听的秒数一起删除
                        this.removeing(this.indexing)
                        this.$dialog.toast({
                          mes: '删除成功~',
                          timeout: 600,
                        });
                        if(this.$store.state.arrays.length == 0){
                          clearInterval(this.timed)
                        }
                    }
                },
                {
                    label:'取消',
                    callback:() => {
                      console.log('你点击了取消')
                    }
                }
              ],
    }
  },
  methods:{
//获取mock数据
    getMokeData(){
      const _this = this
      this.$axios.get("api/message").then(res =>{
          _this.message= res.data.clock_array[0]
          console.log(_this.message);
            }).catch(err=>{
                console.log(err)
      })
    },
//进入编辑
  goToEditclock(i){
    console.log(i)
    this.$router.push({path:'/editclock'})
  },
//长按弹出删除菜单
    removeItems(i){
     this.indexing = i //把当前索引传入数据模型
      const _this = this
       clearInterval(this.timer)
       this.timer = setTimeout(function(){
          _this.showItem = true
       },500) 
    },
//触摸结束停止定时器
    clearLoop(a){
       clearInterval(this.timer); 
    },
//删除localstorage中的闹钟数据
    removeing(i){
       this.$store.state.arrays.splice(i,1)
      localStorage.setItem('ls_clock',JSON.stringify(this.$store.state.arrays)) 
      this.$store.state.zgharr.splice(i,1)
      localStorage.setItem('zgh',JSON.stringify(this.$store.state.zgharr)) 
    },
//计算闹钟提醒到达时间
    remindTime(i){
      const date = new Date() 
      const nowSecond = parseInt(date.getHours()*3600) + parseInt(date.getMinutes()*60) //当前总秒数
      var result = parseInt(this.$store.state.arrays[i].second) - nowSecond
      result<0?result= 86400+result:result 
      var h = Math.floor((result/3600)%24);  //剩余小时
      var m = Math.floor(result/60%60); //剩余分钟
      this.$store.state.hour = h
      this.$store.state.minute = m
      this.$dialog.toast({
          mes: '剩余'+ this.$store.state.hour + '小时' + this.$store.state.minute +'分钟闹钟提醒~',
          timeout: 1000,
      });
    },
//开关控制逻辑 
    switchs(e){
        if(this.ydswitch[e] == false){
            this.$set(this.ydswitch, e, true)
            this.isActive[e] = false
            this.remindTime(e)//计算闹钟时间
            this.$set(this.oldtime,e,this.$store.state.arrays[e].second) //重启开启闹钟赋值秒数
          }else{
              this.$set(this.ydswitch, e, false)
              this.isActive[e] = true
              this.$set(this.oldtime,e,'')  //关闭就为空秒数
          }
          //让localstorage记住当前开关状态,再复写上去
          this.writeLocal(e)
         
    },
//控制的状态同步到localstorage
    writeLocal(e){
       this.$store.state.zgharr[e].zgh = this.oldtime[e] 
        this.$store.state.arrays[e].mark = this.ydswitch[e] //同步修改local上的状态
          localStorage.setItem('ls_clock',JSON.stringify(this.$store.state.arrays))
          localStorage.setItem('zgh',JSON.stringify(this.$store.state.zgharr))
    },
//添加闹钟节点
  zgh_clock(){
    const eText = JSON.parse(localStorage.getItem('ls_clock') ||'[]');
      eText.forEach((e,i) =>{
        this.musicName[i] = eText[i].name //歌曲名赋值给模型
        this.ydswitch[i] = eText[i].mark
        this.dataList.push({
        time:eText[i].time,
        day:eText[i].day + ',' + eText[i].note + ' '+ eText[i].name
      })
  //判断是否弹窗闹钟提醒数据
        if(this.ydswitch[i]==true){
          this.remindTime(i)
        }
         this.oldtime.push(this.$store.state.zgharr[i].zgh) //赋值给数据模型
         //console.log(this.musicName)
    })
  },
//播放铃声方法
  play(named){
      this.url = '../../static/music/' + named +'.mp3'
     },
  
//时钟执行定时器
  action(){
    const dates = new Date() 
    const zgh = parseInt(dates.getHours()*3600) + parseInt(dates.getMinutes()*60+parseInt(dates.getSeconds())) //当前总秒数
      console.log(zgh,this.oldtime)
      this.oldtime.forEach((e,i)=>{
          if(zgh == e){
            this.play(this.musicName[i]) //播放铃声
              this.$dialog.alert({
                mes: '闹钟时间到啦~~',
                callback:()=>{
                      this.$refs.audio.pause() //关闭铃声
                      this.$set(this.ydswitch,i,false)//关闭铃声后关闭开关
                      this.$set(this.oldtime,i,'')  //修改状态
                      this.writeLocal(i) //调用修改状态复写到localstorage方法
                    }
                })
            }
        })
      },
    },
  beforeDestroy(){
    clearInterval(this.timed) //离开页面就关闭定时器
  },
  created(){
    //this.getMokeData()
   this.zgh_clock()
   console.log(this.$store.state.arrays.length)
      if(this.$store.state.arrays.length !== 0){
          this.timed = setInterval(this.action,1000) //开启定时器
      }else{
          return false
      }
   
  },

}
</script>

<style scoped lang="less">
@import "../assets/baseColor.less";
.clock_data{margin: 10px;}
.bring{background: rgb(244,244,244)}
.yd-toast-none-icon{position: absolute;bottom:1.2rem;background: rgba(0,0,0,0.8)}
.alarm-block{height: 10rem;overflow: auto;}
.chooseItem:active{background: rgb(222,222,222);}
</style>
