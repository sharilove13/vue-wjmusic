<template>
  <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
          <slot>
          </slot>
      </div>
      <div class="dots">
        <span class="dot" v-for="(item,index) in dots" :key="index" :class="{active:currentPageIndex == index}"></span>
      </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import {addClass} from 'assets/js/dom';
    export default {
      data(){
        return {
          dots:[],
          currentPageIndex:0  //默认当前第几页
        }
      },
      props:{
        loop:{
          type:Boolean,
          default:true
        },
        autoPlay:{
          type:Boolean,
          default:true
        },
        interval:{
          type:Number,
          default:4000
        }
      },
      
      mounted(){
        setTimeout(()=>{
          this._setSliderWidth();
          this._initSlider();
          this._initDots();

          if(this.autoPlay){
            this._play();
          }
        },20)
        
        //监听窗口改变事件
        window.addEventListener("resize",()=>{
          //如果slider还没有初始化的时候
          if(!this.slider){
            return;
          }
          this._setSliderWidth(true);
          this.slider.refresh();
        })
      },
      
      methods:{

        //设置宽度
        _setSliderWidth(isResize){
          //sliderGroup内的子元素
          this.children = this.$refs.sliderGroup.children;
          let width=0;
          //令sliderWidth为slider的宽度
          let sliderWidth = this.$refs.slider.clientWidth;
          for(let i=0;i<this.children.length;i++){
            // 定义每个轮播内容
            let child = this.children[i];
            addClass(child,"slider-item");//加样式使左浮动
            child.style.width= sliderWidth+"px";//单张轮播内容宽度
            width += sliderWidth; //轮播内容总长宽度
          }

          if(this.loop && !isResize){
            //如果循环的话,在添上后面多拷贝的两张宽度
            width += 2*sliderWidth;
          }
          this.$refs.sliderGroup.style.width = width + "px";
        },

        //初始化
        _initSlider(){
          //使用better-scroll组件，设置参数，令其可滑动
          this.slider = new BScroll(this.$refs.slider,{
            scrollX:true, //横向滚动
            scrollY:false,  //不允许纵向滚动
            momentum:false, //惯性
            snap:{    //该属性是给 slider 组件使用的
              loop:this.loop, //循环
              threshold:0.3,  //用手指滑动时页面可切换的阈值，大于这个阈值可以滑动的下一页
              Speed:400  //轮播图切换的动画时间
            }
          })

          //滚动完毕时执行函数
          this.slider.on("scrollEnd",()=>{
            //better-scroll获取当前页的方法
            let pageIndex = this.slider.getCurrentPage().pageX;

            this.currentPageIndex = pageIndex;
            if(this.autoPlay){
              clearTimeout(this.timer);//每次轮播前清除定时器
              this._play();
            }
          })
        },

        //初始化显示点的list
        _initDots(){
          if(this.autoPlay){
            this.dots = new Array(this.children.length-2)
          }else{
            this.dots = new Array(this.children.length)
          }
        },

        //自动播放
        _play(){
          let pageIndex = this.currentPageIndex+1;
          if(this.loop){
            pageIndex +=1;
          }
          this.timer = setTimeout(()=>{
            //better-scroll提供跳转下一页的方法
            // this.slider.goToPage(pageIndex,0,400)
            this.slider.next();
          },this.interval)
        }
      },
      
      destroyed(){
        clearTimeout(this.timer)
      }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~assets/stylus/variable'

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
  .dots
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background: $color-text-l
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>