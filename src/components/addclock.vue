<template>
    <div class="addclock">
    <yd-cell-item arrow>
            <span slot="left">时间&nbsp;&nbsp;</span>
            <yd-datetime type="time" v-model="datetimes" ref="datetimes" slot="right" style="font-size:0.4rem;color:#34679a" :callback="getChangeTime"></yd-datetime>
    </yd-cell-item>
    <yd-cell-item arrow>
            <span slot="left">重复</span>
            <span slot="right">{{dayCount}}</span>
    </yd-cell-item>
    <yd-flexbox style="text-align:center" @click.native="getSubDay">
        <yd-flexbox-item v-for="(day,index) in dayList" :key="day.id" style="height:1rem;line-height: 1rem;" :class="{'currentday':isCurrent[index]}" :data-index="index">
           {{day.days}}
        </yd-flexbox-item>
    </yd-flexbox><hr>

    <yd-cell-item @click.native="show1 = true">
            <span slot="left">提醒方式</span>
            <span slot="right">{{this.pickeds}}</span>
    </yd-cell-item>
    <yd-cell-item arrow @click.native="show2 = true">
            <span slot="left">铃声</span>
            <span slot="right">{{this.$store.state.clock_play_sound}}</span>
    </yd-cell-item>
    <yd-cell-item type="label">
            <div slot="left">语音播报</div>
            <yd-switch slot="right" v-model="ydswitch1" style="color:#34679a;" @click.native="playSound"></yd-switch>
    </yd-cell-item>
    <yd-cell-item arrow @click.native="show3 = true">
            <span slot="left">贪睡</span>
            <span slot="right">{{sleep_time}}</span>
    </yd-cell-item>
    <yd-cell-item @click.native="show4 = true">
            <span slot="left">标签</span>
            <span slot="right">{{this.inputContent}}</span>
    </yd-cell-item>
    <!-- 提醒方式弹窗 -->
     <yd-popup v-model="show1" position="center" width="80%">
            <yd-cell-item type="radio">
                <yd-icon slot="icon" name="time" size=".42rem"></yd-icon>
                <span slot="left">响铃</span>
                <input slot="right" type="radio" value="响铃" v-model="pickeds"/>
            </yd-cell-item>
            <yd-cell-item type="radio">
                <yd-icon slot="icon" name="time" size=".42rem"></yd-icon>
                <span slot="left">响铃及振动</span>
                <input slot="right" type="radio" value="响铃及振动" v-model="pickeds"/>
            </yd-cell-item>
            <yd-cell-item type="radio">
                <yd-icon slot="icon" name="time" size=".42rem"></yd-icon>
                <span slot="left">振动</span>
                <input slot="right" type="radio" value="振动" v-model="pickeds"/>
            </yd-cell-item>
            <yd-button @click.native="remindSound" type="hollow" size="large">关闭</yd-button>
    </yd-popup>
    <!-- 选择铃声弹窗 -->
    <yd-popup v-model="show2" position="right" width="50%">
        <div class="chooseSound">系统铃声</div>
            <yd-radio-group v-model="radio4" color="#34679a" style="font-size:0.5rem" @click.native="systemMusic">
                <yd-radio :val="list.name" v-for="(list,index) in listData" :key="list.id" :data-index="index"></yd-radio>
            </yd-radio-group>
        <div class="chooseSound">自定义铃声</div>
    </yd-popup>
    <!-- 贪睡弹窗 -->
    <yd-popup v-model="show3" position="right" width="100%">
        <yd-button type="hollow" @click.native="show3 = false" size="large">关闭</yd-button>
        <yd-cell-item>
            <span slot="left">贪睡时间</span>
            <span slot="right">{{this.sleep_time}}</span>
        </yd-cell-item>
        <yd-cell-item type="label">
            <div slot="left">贪睡小助手</div>
            <yd-switch slot="right" v-model="ydswitch2" style="color:#34679a;" @click.native="loveSleep"></yd-switch>
        </yd-cell-item>
        <div class="tanshui">
            开启之后,再闹钟贪睡超过5次将自动发送信息给您指定的联系人
        </div>
        <yd-cell-item arrow>
            <span slot="left">联系人</span>
        </yd-cell-item>
        <yd-cell-item arrow>
            <span slot="left">信息内容</span>
        </yd-cell-item>
    </yd-popup>
    <!-- 标签弹窗 -->
    <yd-popup v-model="show4" position="center" width="80%" >
        <yd-cell-item>
            <span slot="left" style="text-align:center">标签:</span>
            <yd-input slot="right" v-model="inputContent" max="10" ></yd-input>
        </yd-cell-item>
        <yd-flexbox>
            <yd-flexbox-item>
                <yd-button @click.native="show4 = false" size="large">取消</yd-button>
            </yd-flexbox-item>
            <yd-flexbox-item>
                <yd-button @click.native="note_sure" size="large">确定</yd-button>
            </yd-flexbox-item>
        </yd-flexbox>
        
        
    </yd-popup>
    </div>
</template>
<style scoped>
@import "../assets/addclock.css";
</style>

<script>
export default {
  name: 'addclock',
  data(){
    return{
      datetimes:'08:00',
      allCount:'',
      show1:false,
      show2:false,
      show3:false,
      show4:false,
      inputContent:'',//标签内容
      pickeds:'响铃',
      radio4:'',
      ydswitch1:false,
      ydswitch2:false,
      isCurrent:[],
      dayCount:'无',
      sleep_time:'5分钟',
      dayList:[
        {days:'日',mark:false},
        {days:'一',mark:false},
        {days:'二',mark:false},
        {days:'三',mark:false},
        {days:'四',mark:false},
        {days:'五',mark:false},
        {days:'六',mark:false}
      ],
      listData:[
          {name:'绅士'},
          {name:'狐狸'},
          {name:'像风一样'},
          {name:'动物世界'},
          {name:'等你下课'},
      ],
    }
  },
  methods:{
//选择闹钟时间
      getChangeTime(){
        this.$store.state.clock_time = this.datetimes //把时间存入vuex
        this.$refs.datetimes._props.currentHour
        const countHour = parseInt(this.$refs.datetimes._props.currentHour)
        const countMinute =parseInt(this.$refs.datetimes._props.currentMinute)
        const result = countHour*3600 + countMinute*60
        this.allCount = result
        this.$store.state.clock_second = this.allCount //把总秒数存入vuex
        this.$store.state.zgh =  this.allCount //把总秒数单独存入vuex
      },
//选择执行天数
      getSubDay(e){
          if(e.target.nodeName.toLowerCase() === 'div'){
            let index = e.target.dataset.index
            let text = e.target.innerText
                this.doSomething(index,text)
            }
        },
      doSomething(i,t){
          if(this.isCurrent[i] == true){
             this.$set(this.isCurrent,i,false)
             this.dayList[i].mark = false
          }else{
              this.$set(this.isCurrent,i,true)
              this.dayList[i].mark = true
          }
          let arr = this.dayList
        //过滤不符合的信息
          arr = arr.filter(function(a){return a.mark})
          const zgh =[]
          arr.forEach((e,i) => {
              zgh.push('周'+ arr[i].days)
          });
        //输出天数值
          if(zgh == ''){
              this.dayCount = '无'
          }else{
              if(zgh.length == 7){
                  this.dayCount = '每天'
              }else{
                   this.dayCount = zgh.join()
              }
          }
           this.$store.state.clock_day = this.dayCount //把执行天数存入vuex
      },
//选择提醒方式
      remindSound(){
          this.show1 = false
          this.$store.state.clock_remind = this.pickeds //把提醒方式存入vux
      },
//选择铃声
      systemMusic(e){
         if(e.target.nodeName.toLowerCase() === 'label'){
             let index = e.target.dataset.index
             this.doMusic(index)
         }
     },
     doMusic(i){
         this.$store.state.clock_play_sound = this.listData[i].name //铃声名存入vuex
     },
//开启语音播报
      playSound(){
          if(this.ydswitch1 == false){
              this.ydswitch1 = true
              this.$dialog.toast({
                mes: '已开启语音播报提醒~',
                timeout: 1000,
              });
          }else{
              this.ydswitch1 = false
          }
          this.$store.state.clock_play_noise = this.ydswitch1 //是否语音播报存入vuex
      },
//选择贪睡
      loveSleep(){
          if(this.ydswitch2 == false){
              this.ydswitch2 = true
              
          }else{
              this.ydswitch2 = false
          }
          this.$store.state.clock_sleep_mark = this.ydswitch2 //贪睡状态--vuex
          this.$store.state.clock_sleep_time = this.sleep_time //贪睡时长--vuex
      },
//标签内容
      note_sure(){
          this.show4 = false
          this.$store.state.clock_note = this.inputContent
      },
  },


}
</script>
