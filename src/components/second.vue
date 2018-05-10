<template>
  <div class="second">
      <div class="circleprogress">
          <div :class="animation1" ref="animation1"></div>
          <div class="timeCount">
            <span ref="m">00</span>
            <span>:</span>
            <span ref="s">00</span>
            <span>.</span>
            <span ref="ms">0</span>
         </div>
      </div>
        <yd-flexbox>
             <yd-flexbox-item></yd-flexbox-item>
            <yd-flexbox-item style="flex:3.6">
                <yd-button size="large" @click.native="start" v-show="isLeft">启动</yd-button>
                <yd-button size="large" @click.native="stop" v-show="!isLeft">停止</yd-button>
            </yd-flexbox-item>
            <yd-flexbox-item ></yd-flexbox-item>
            <yd-flexbox-item style="flex:3.6">
                <yd-button size="large" @click.native="reset" v-show="isLeft">复位</yd-button>
                <yd-button size="large" @click.native="reCount" v-show="!isLeft">计次</yd-button>
            </yd-flexbox-item>
             <yd-flexbox-item></yd-flexbox-item>
        </yd-flexbox>
        <div class="bottom" ref="bot">
            <ul>
                <li v-for="(todo,index) in todos" :key="todo.id">
                    <yd-flexbox style="text-align:center">
                        <yd-flexbox-item>第{{index+1}}名:</yd-flexbox-item>
                        <yd-flexbox-item>{{ todo.timeC }}</yd-flexbox-item>
                        <yd-flexbox-item>
                            <yd-icon name="good" size="0.5rem" :color="todo.goodcolor" @click.native="good(index)"></yd-icon>
                        </yd-flexbox-item>
                    </yd-flexbox> 
                </li>   
            </ul>   
        </div>
  </div>
</template>
<style scoped>
@import "../assets/second.css";
</style>

<script>
export default {
  name: 'second',
  data(){
    return {
        timer: null,
        n:0,
        isLeft:true,
        isRight:true,
        todos:[],
        animation1:'',
        animation2:'bcd',
    }
  },
  
  updated(){
//滚动条在底部
      this.$refs.bot.scrollTop = this.$refs.bot.scrollHeight;
  },
  methods:{
//启动秒表
  start(){
        this.isLeft = !this.isLeft
        clearInterval(this.timer)
        this.timer = setInterval(this.time,110) 
        this.animation1 = 'abc'
        if(this.$refs.animation1.style.animationPlayState="paused"){
            this.$refs.animation1.style.animationPlayState='running'
      }
  },
//倒计时时间计算
    time(){
        this.n++;
        this.$refs.ms.innerHTML = this.n
        const minute = this.$refs.m.innerHTML
        const second = this.$refs.s.innerHTML
        const milliscond = this.$refs.ms.innerHTML
        if(milliscond >8){
            if(second<9){
                this.$refs.s.innerHTML ='0'+ (parseInt(second) + 1)
            }else{
                 this.$refs.s.innerHTML = parseInt(second) + 1
            }
            if(second>59){
                if(minute<9){
                    this.$refs.m.innerHTML = '0'+ (parseInt(minute) + 1)
                }else{
                    this.$refs.m.innerHTML =  parseInt(minute) + 1
                }
            this.$refs.s.innerHTML = '00'
        }
        this.n = 0
    }
},
        
//暂停
      stop(){
          clearInterval(this.timer)
          this.isLeft = !this.isLeft
          this.$refs.animation1.style.animationPlayState="paused"
      },
//复位
      reset(){
          this.$refs.m.innerHTML = '00'
          this.$refs.s.innerHTML = '00'
          this.$refs.ms.innerHTML= '0'
          clearInterval(this.timer)
          this.removeAll() //调用删除功能
          this.animation1 = '' //清除动画
      },
//计次
      reCount(){
        //console.log(this.$refs.ms.innerHTML)  
        this.todos.push({timeC:this.$refs.m.innerHTML+':'+this.$refs.s.innerHTML+':'+this.$refs.ms.innerHTML})
      },
//删除计次
        removeAll(){
             this.todos.splice(0,this.todos.length)
        },
//点赞
        good(i){
            if(this.todos[i].goodcolor =='#910909'){
                this.$set(this.todos[i],'goodcolor','')      
            }else{
                this.$set(this.todos[i],'goodcolor','#910909') //动态添加属性
            }
        },
    },

}
</script>