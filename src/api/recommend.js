import jsonp from 'assets/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'     
//获取轮播图的jsonp
export function getRecommend(){
    const url="https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
    
    //配置个人不同的参数
    const data = Object.assign({},commonParams,{
        platform:"h5",
        uin:0,
        needNewCode:1
    })
    return jsonp(url,data,options)
}

//获取歌单数据

export function getDiscList() {
    const url = '/api/getDiscList'        //前端请求的是路由地址
   
    const data = Object.assign({}, commonParams, {
      platform: 'yqq',
      hostUin: 0,
      sin: 0,
      ein: 29,
      sortId: 5,
      needNewCode: 0,
      categoryId: 10000000,
      rnd: Math.random(),
      format: 'json'        //json数据
    })
   
    return axios.get(url, { //返回值也不是jsonp，而是要通过axios实现
      params: data            //参数
    }).then((res) => {        //拿到数据（response对象）
      return Promise.resolve(res.data)
    })
}