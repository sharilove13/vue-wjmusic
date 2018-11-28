import jsonp from 'assets/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'   


//获取歌手数据

export function getSingerList() {
    const url = '/api/getSingerList'        //前端请求的是路由地址
   
    const data = Object.assign({}, commonParams, {
        channel:"singer",
        page:"list",
        key:"all_all_all",
        pagesize:100,
        pagenum:1,
        hostUin:0,
        needNewCode:0,
        platform:"yqq",
        g_tk:1664029744
    })
   
    return axios.get(url, { //返回值也不是jsonp，而是要通过axios实现
      params: data            //参数
    }).then((res) => {        //拿到数据（response对象）
      return Promise.resolve(res.data)
    })
}