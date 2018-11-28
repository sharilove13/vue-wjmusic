<template>
    <div class="recommend">
      <scroll ref="scroll" class="recommend-content" :data="discList">
        <div>
          <!-- 只有当recommends有值时才渲染 -->
          <div v-if="recommends.length" class="slider-wrapper">
            <slider>
              <div v-for="(item, index) in recommends" :key="index">
                <a :href="item.linkUrl">
                  <img :src="item.picUrl" @load="loadImage" class="needsclick">
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li v-for="(item,index) in discList" :key="index" class="item">
                <div class="icon">
                  <img v-lazy="item.imgurl" width="60" height="60">
                </div>
                <div class="text">
                  <!-- 字中字符转义 -->
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- 懒加载 -->
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </scroll>
    </div>
</template>

<script>
  import Loading from 'base/loading/loading';
  import Scroll from 'base/scroll/scroll';
  import Slider from 'base/slider/slider';
  import {getRecommend,getDiscList} from 'api/recommend';
  import {ERR_OK} from 'api/config';

  export default{
    data(){
      return{
        //图列表
        recommends:[],
        discList:[]
      }
    },
    created(){
      //轮播
      this._getRecommend();
      //歌单
      this._getDiscList();
    },
    methods:{
      _getRecommend(){
        getRecommend().then((res)=>{
          if(res.code === ERR_OK){
            // 将图片对象赋值给recommends列表
            this.recommends = res.data.slider;
          }
        })
      },
      _getDiscList(){
        getDiscList().then((res)=>{
          if(res.code === ERR_OK){
            // console.log(res.data);
            this.discList = res.data.list;
          }
        })
      },
      //监听图片加载
      loadImage(){
        if(!this.checkLoaded){
          this.$refs.scroll.refresh();
          this.checkLoaded =true;
        }
      }
    },
    components:{
      Loading,
      Slider,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~assets/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        height: 100%
        overflow hidden
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>