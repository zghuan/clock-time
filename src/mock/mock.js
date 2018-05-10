import Mock from 'mockjs';//es6语法引入mock模块

//输出闹钟消息
 Mock.mock("api/message", {
"clock_array|5":[
        {
            "click_id|+1":1,       //闹钟id
            'click_name': '@name',//闹钟名称
            'click_time':'08:00', //闹钟时间
            'now':"@now('minute')",//当前时间
            'clock_day':'无',      //执行天数
            'clock_remind':'响铃',//提醒方式
            'clock_play_sound':'等你下课', //播放铃声
            "clock_play_noise": false, //贪睡时长
            "clock_sleep_mark": true, //贪睡状态
            "clock_sleep_time|5-15": 5,//贪睡时间
            'clock_note':"@ctitle()", //标签内容
            "click_mark": true, //闹钟开启状态
        }
    ]
});
//输出城市列表
 Mock.mock("api/city", {
    "success":"1",
    "result":[
            {
                "city_cn":"北京",       
                'city_en': 'beijing',
                'continents_cn':'亚洲', 
                'continents_en':"as",
                'contry_cn':'中国',      
                'contry_en':'china',
            },
            {
                "city_cn":"上海",       
                'city_en': 'shanghai',
                'continents_cn':'亚洲', 
                'continents_en':"as",
                'contry_cn':'中国',      
                'contry_en':'china',
            },
            {
                "city_cn":"广州",       
                'city_en': 'guangzhou',
                'continents_cn':'亚洲', 
                'continents_en':"as",
                'contry_cn':'中国',      
                'contry_en':'china',
            },
            {
                "city_cn":"深圳",       
                'city_en': 'shenzhen',
                'continents_cn':'亚洲', 
                'continents_en':"as",
                'contry_cn':'中国',      
                'contry_en':'china',
            },
            {
                "city_cn":"纽约",       
                'city_en': 'newyue',
                'continents_cn':'美洲', 
                'continents_en':"as",
                'contry_cn':'美国',      
                'contry_en':'amriecan',
            },
            {
                "city_cn":"东京",       
                'city_en': 'donjing',
                'continents_cn':'亚洲', 
                'continents_en':"as",
                'contry_cn':'日本',      
                'contry_en':'japan',
            },
        ]
    });
    