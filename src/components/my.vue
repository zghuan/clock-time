<template>
  <div class="my">
      <!-- 头部导航 -->
      <yd-navbar title="世界时钟" bgcolor="rgb(22,29,21)" color="#fff" fontsize="0.35rem">
            <router-link to="" slot="left">
                <span style="color:#fff" >编辑</span>
            </router-link>
            <router-link to="" slot="right"  @click.native="searchcitylist">
                <span style="color:#fff">搜索</span>
            </router-link>
      </yd-navbar>
    <!-- 搜索弹窗 -->
    <yd-popup v-model="show" position="right" width="100%">
        <!-- 返回透明层 -->
        <div @click="show = false" class="back">＜</div>
        <!-- 搜索框 -->
        <yd-search v-model="value2" :on-submit="submitHandler" :on-cancel="cancelEvent" placeholder="搜索城市" class="searchcity"></yd-search><hr>
        <!-- 所有城市列表 -->
        <yd-cell-group class="allcity">
            <yd-cell-item v-for="(list,index) in searchData" :key="list.id" @click.native="addCityTimeData(index)" class="listactive">
                <span slot="left" style="color:#000">{{list.city_cn}},{{list.contry_cn}}</span>
                <span slot="right">{{list.city_en}},{{list.continents_cn}}</span>
            </yd-cell-item>
        </yd-cell-group>
    </yd-popup>
    <!-- 时钟特效 -->
        <div class="clockmodel" :class="nowtime?'white':'black'">
            <div class="h" ref="hour"></div>
            <div class="m" ref="munt"></div>
            <div class="s" ref="sec"></div>
            <span class="citybrage">{{this.city}}</span>
        </div>
    <!-- 不固定城市列表 -->
    <div class="firstelement">
        <yd-cell-item v-for="(choose,index) in this.choosecity" :key="choose.id" :data-index="index" class="ordercity" @touchstart.native="deleteCity(index)"
         @touchend.native="clearLoop(index)" @click.native="changeTimeModel(index)" :class="{current:a==index}">
            <span slot="left" style="font-size:0.4rem;">{{choose.city}}</span>
            <span slot="right" style="font-size:0.4rem" ref="timedata">{{choose.time | filtime}}</span>
        </yd-cell-item><hr>
    </div>
    <!-- 删除菜单 -->
    <yd-actionsheet :items="myItems2" v-model="show2"></yd-actionsheet>
  </div>
</template>
<style>
@import "../assets/earth.css";
</style>
<script type="text/babel">
import store from './../store/index.js'
import moment from 'moment' //时间过滤器
    export default {
        data() {
            return {
                allCityList:[],
                timesList:[],
                nowtime:false,//时间模型calss判断
                value2:'',   //搜索框的值
                show:false, //右滑弹窗
                show2:false,//删除弹窗
                timer:null, //删除定时器
                a:0,        //class默认为第一个
                timed:null, //时间计算定时器
                cityList:[],
                choosecity:[{city:'北京',time:'新年快乐'}], //选中城市列表
                city:'北京' ,  //时钟里默认显示的城市
                myItems2:[
                    {
                        label:'确定要删除该城市?',
                        stay: true 
                    },
                    {
                        label: '删除',
                        callback: () => {
                            //判断如果是删除选中的，便跳转回北京
                            if(this.city == this.choosecity[this.indexing].city.split(',')[0]){
                                this.city = '北京'
                                this.a = 0 
                            }
                            this.choosecity.splice(this.indexing,1)
                            this.$dialog.toast({
                                mes: '删除成功~',
                                timeout:500
                            })
                        }
                    },
                    {
                        label:'取消'
                    },
                ],
                indexing:null,  //删除城市索引
                timeing:null,
                diff_h:0, //时间差值
                diff_m:0,
                times:null,
                currentH:0,
                currentM:0,
                currentS:0,
            }     
        },
    methods:{
    //点击搜索按钮1
        searchcitylist(){
            this.show = true
            this.getAllCityData()
        },
    //获取所有城市列表2
        getAllCityData(){
            var that = this
            if(this.$store.state.allcitylist.length == 0){
           // var url = "http://api.k780.com/?app=time.world_city&appkey=31723&sign=f30b2c59276b52af9dfa73d15a4d2b85&format=json"
            this.$axios.get('api/city').then(function(res){
                that.$store.state.allcitylist = res.data.result
                console.log(that.$store.state.allcitylist)
                    }).catch(function(res) {
                        console.log(res);
                })     
            }
        },
     //添加选中城市3
        addCityTimeData(i){
            this.getCityTimeData(i)
            this.show = false
        },
    //获取当前选中城市时间4------------------------------------------------------
        getCityTimeData(i){
            var that = this
            var url = "http://api.k780.com/?app=time.world&appkey=31723&sign=f30b2c59276b52af9dfa73d15a4d2b85&format=json"
            this.$axios.get(url,{params:{city_en:i}}).then(function(res){
                that.$store.state.currentcitytime = res.data.result.datetime_1
                //获取当前时分秒
                var currdate = new Date()
                that.currentH = that.$store.state.currentcitytime.split(' ')[1].split(':')[0]- parseInt(currdate.getHours()) //差值
                that.currentM = that.$store.state.currentcitytime.split(' ')[1].split(':')[1]- parseInt(currdate.getMinutes())
                 //把城市信息加入列表
                that.choosecity.push({
                    city:that.$store.state.allcitylist[i].city_cn+','+that.$store.state.allcitylist[i].contry_cn,
                    time:that.$store.state.currentcitytime
                })
                }).catch(function(res){
                    console.log(res);
            })
        },
    //-------其他城市时间?????--------------------------------------------------------
        ordercitytime(){
            var date2 = new Date();
            var hh = date2.getHours()+this.currentH //时
            var mm = date2.getMinutes()+this.currentM //分
            var ss = date2.getSeconds() //秒
            this.$store.state.currentcitytime = hh+':'+mm+':'+ss
        },
    //提交搜索时的触发方法
        submitHandler(value) {
            this.$dialog.toast({mes: `搜索：${value}`});
        },
    //取消搜索时回调
        cancelEvent(){
            console.log('取消')
            this.value2 = ''
        },
   
    //删除选中城市
        deleteCity(i){
            this.indexing = i //把当前索引传入数据模型
                if(i == 0){  //北京无法删除
                    this.show2 = false
                }else{
                    const _this = this
                    clearInterval(this.timer)
                    this.timer = setTimeout(function(){
                        _this.show2 = true
                },500) 
            }
        },
    //清除长按删除定时器
        clearLoop(){
            clearInterval(this.timer); 
        },
    //选中城市改变时间模型
        changeTimeModel(i){
            this.city = this.choosecity[i].city //同步城市
            var tempArr = this.city.split(",") 
            this.city = tempArr[0]  //过滤国家
            this.a = i //绑定选中active的class
        //判断时钟是白天还是黑夜
            let zghtime = this.$refs.timedata[i].innerText.split(':')[0]
            if('06'<zghtime&&zghtime<'18'){
                this.nowtime = true //白天
            }else{
                this.nowtime = false//黑夜
            }
        //改变时钟为对应城市时区
            this.timesList[0] = this.choosecity[i].time.split(' ')[1].split(':')[0]
            this.timesList[1] = this.choosecity[i].time.split(' ')[1].split(':')[1]
            var zghdate = new Date()
            this.diff_h = parseInt(this.timesList[0]) - parseInt(zghdate.getHours()) //小时差值
            this.diff_m = parseInt(this.timesList[1]) - parseInt(zghdate.getMinutes())//分钟差值 
        },
    //时钟动画--------
        gogogo(a,b,c){
            var date = new Date();
            var hh = date.getHours()+this.diff_h //时
            var mm = date.getMinutes()+this.diff_m //分
            var ss = date.getSeconds() //秒
            var ms = date.getMilliseconds() //毫秒
            let s = parseInt(ss)+ ms/1000; //转动的秒数起点
            let m = parseInt(mm) + s/60;   //转动的分钟起点
            let h = parseInt(hh) + m/60;    //转动的小时起点
            this.$refs.sec.style.WebkitTransform = "rotate("+s*6+"deg)";
            this.$refs.munt.style.WebkitTransform = "rotate("+m*6+"deg)";
            this.$refs.hour.style.WebkitTransform = "rotate("+h*30+"deg)";
        },
    //固定的北京时间
        beijingTime(){
            var dates = new Date();
            var yy = dates.getFullYear() //年
            var MM = dates.getMonth()+1  //月
            var dd = dates.getDate()     //日
            var hh = dates.getHours()     //时
            var mm = dates.getMinutes()   //分
            var ss = dates.getSeconds()   //秒
                if('06'<hh&&hh<'18'){this.nowtime = true}
            this.choosecity[0].time = yy+'-'+MM+'-'+dd+' '+hh+':'+mm+':'+ ss
        },
    
    },
    //----------生命周期钩子------------
    created(){ 
    },
    //进入组件调用定时器
    activated(){
         //this.timeing = setInterval(this.beijingTime,1000);//每秒执行一次北京时间
        // this.timed = setInterval(this.gogogo,1000); //指针转动的定时器
        // this.times = setInterval(this.ordercitytime,1000)
    },
    //离开组件就清除定时器
    deactivated(){
        clearInterval(this.timeing)
        clearInterval(this.timed)
        clearInterval(this.times)
    },
    //监听搜索数据
    watch:{
        getCurrentCityTime(val) {
            this.timesList = val
            console.log(this.timesList)
        }
    },
    //计算这个属性的变化
    computed: {
        getCurrentCityTime(){
            return this.$store.state.currentcitytime
        },
    searchData(){
        const search = this.value2
        if(search){
            return this.$store.state.allcitylist.filter(function(a){
        //     return Object.keys(a).some(function(key){
        //     return String(a[key]).toLowerCase().indexOf(search) > -1
        //   })
                return a.city_cn.toLowerCase().indexOf(search)!=-1
        })
        }else{
            return this.$store.state.allcitylist;
        }   
    }
},   
    //时间过滤器
    filters:{
        filtime:function(a){
            return moment(a).format('HH:mm:ss')
        }
    }
}
</script>
