import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        clock_time:'08:00',  //闹钟时间
        clock_second:'',//总秒数
        clock_day:'无',   //执行天数
        clock_remind:'响铃',//提醒方式
        clock_play_sound:'等你下课', //播放铃声
        clock_play_noise:false,  //语音播报
        clock_sleep_time:'5分钟', //贪睡时长
        clock_sleep_mark:false, //贪睡状态
        clock_note:'',  //标签内容
        clock_mark:true,
        arrays:[],  //闹钟localstorage数组
        clock_index:null,
        hour:null,
        minute:null,
        zgh:'',//单独总秒数
        zgharr:[],//秒数数组
        //----------------------------------//
        allcitylist:[], //所有城市
        currentcitytime:[], //当前城市时间
        ms:'',
        s:'',
        m:'',
        h:'',
        happytime:[]
    },
    mutations:{
        // change_Tmark:state=>state.arrmark= true,
        // change_Fmark:state=>state.clock_mark = false
    },
    getters:{

    },
    actions:{

    }
})