<template>
  <div class="thesound">
      <yd-cell-group title="系统铃声" @click.native="getChange">
        <yd-cell-item type="radio" v-for="(music,index) in datas" :key="music.id" @click.native="choose(index)">
          <yd-icon slot="icon" name="play" size=".42rem"></yd-icon>
            <span slot="left">{{music.name}}</span>
            <input slot="right" type="radio" :value="index" v-model="picked">
            
        </yd-cell-item>
    </yd-cell-group>
    
    <audio :src="zgh" autoplay id="audio"></audio>
  
  </div>
</template>
<script type="text/babel">
import $ from 'jquery';
import addAudio from './common/localStorage.js'
import bus from './common/bus.js';
    export default {
        data() {
            return {
                picked: '',
                zgh:'',
                radio1:'',
                datas:[
                  {name:'像风一样'},
                  {name:'绅士'},
                  {name:'狐狸'},
                  {name:'动物世界'},
                  {name:'等你下课'}
                ]
            }
        },
        mounted(){
          const _this = this
          bus.$on('pickeds',function(evt){
            _this.picked = evt
        }),
         bus.$on("urled",function(e){
            _this.zgh = e
        });
      },
      created(){
        const _this = this
        const changeMusicName = localStorage.getItem('strMusic') ||'[]';
        const musicContent = JSON.parse(changeMusicName);
        //console.log(musicContent.picked)
       this.picked = musicContent.picked
        
    },
       methods:{
         getChange(e){
           bus.$emit("msg",this.showConfirm);
           if(e.target.value !== null){
             this.showConfirm = true
           }else{
             this.showConfirm = false
           }
         },
        choose(a){
          const _this = this
          const names = this.datas[a].name
          this.play(names)
          bus.$emit("msg_localStorage",names,a);
        },
        play(musicName){
          const url = '../../static/music/' + musicName +'.mp3'
          this.zgh = url
        },
       
        
},
       
  }
</script>