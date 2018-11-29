<template>
    <div class="music-list">
        <!-- 头部 -->
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <!-- 歌手图 -->
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper">
                <!-- 随机播放按钮样式 -->
                <div class="play" v-show="songs.length>0" ref="playBtn">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <!-- 模糊遮罩 -->
            <div class="filter" ref="filter"></div>
        </div>
        <!-- 列表上移的遮罩 -->
        <div class="bg-layer" ref="layer"></div>
        <!-- 歌曲列表 -->
        <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
            <div class="song-list-wrapper">
                <song-list :songs="songs"></song-list>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>
      
<script>
    import Scroll from 'base/scroll/scroll'
    import SongList from 'base/song-list/song-list'
    import {prefixStyle} from 'assets/js/dom'
    import Loading from 'base/loading/loading'

    const RESERVED_HEIGHT=40    //预留高度
    const transform = prefixStyle('transform')
    const backdrop = prefixStyle('backdrop-filter')

    export default{
        data(){
            return{
                scrollY:0
            }
        },
        props:{
            bgImage:{
                type:String,
                default:""
            },
            songs:{
                type:Array,
                default:[]
            },
            title:{
                type:String,
                default:""
            }
        },
        created() {
            this.probeType=3
            this.listenScroll=true
        },
        methods:{
            scroll(pos){
                this.scrollY=pos.y
            },
            //返回点击事件
            back(){
                this.$router.back();
            }
        },
        watch:{
            scrollY(newY){
                //为防止背景色只有窗口的长度,最远向上滚的距离
                let translateY = Math.max(this.minTranslateY,newY)
                //为防止移动后文字超出背景问题
                let zIndex = 0
                //图片放大效果
                let scale =1
                //向上拉高斯模糊
                let blur =0
                //图片上移遮盖至标题处效果
                this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
                //图片放大和模糊效果判断
                const percent = Math.abs(newY/this.imageHeight);
                if(newY>0){
                    scale = 1+ percent
                    zIndex =10
                }else{
                    blur = Math.min(20*percent,20)
                }
                //高斯模糊，只有ios手机可以看到
                this.$refs.filter.style[backdrop] = `blur(${blur}px)`
                //为防止移动后文字超出背景问题,判断，重新设定高度
                if(newY<this.minTranslateY){
                    zIndex =10
                    this.$refs.bgImage.style.paddingTop=0
                    this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
                    //列表上移时，随机播放按钮的处理
                    this.$refs.playBtn.style.display = "none"
                }else{
                    this.$refs.bgImage.style.paddingTop='70%'
                    this.$refs.bgImage.style.height = 0
                    this.$refs.playBtn.style.display = ""
                }
                this.$refs.bgImage.style.zIndex = zIndex
                //向下拉时图片放大变化
                this.$refs.bgImage.style[transform] = `scale(${scale})`
            }
        },
        computed:{
            bgStyle(){
                return `background-image:url(${this.bgImage})`
            }
        },
        mounted(){
            //设置图片高度为背景图的高度
            this.imageHeight = this.$refs.bgImage.clientHeight;
            //最小滚动距离
            this.minTranslateY = -this.imageHeight+RESERVED_HEIGHT
            this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
        },
        components:{
            Scroll,
            SongList,
            Loading
        }
    }
</script>
      
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~assets/stylus/variable";
@import "~assets/stylus/mixin";

.music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
        position absolute
        top: 0
        left: 6px
        z-index: 50
        .icon-back
            display: block
            padding: 10px
            font-size: $font-size-large-x
            color: $color-theme
    .title
        position: absolute
        top: 0
        left: 10%
        z-index: 40
        width: 80%
        no-wrap()
        text-align: center
        line-height: 40px
        font-size: $font-size-large
        color: $color-text
    .bg-image
        position: relative
        width: 100%
        height: 0
        padding-top: 70%
        transform-origin: top
        background-size: cover
        .play-wrapper
            position: absolute
            bottom: 20px
            z-index: 50
            width: 100%
            .play
                box-sizing: border-box
                width: 135px
                padding: 7px 0
                margin: 0 auto
                text-align: center
                border: 1px solid $color-theme
                color: $color-theme
                border-radius: 100px
                font-size: 0
                .icon-play
                    display: inline-block
                    vertical-align: middle
                    margin-right: 6px
                    font-size: $font-size-medium-x
                .text
                    display: inline-block
                    vertical-align: middle
                    font-size: $font-size-small
        .filter
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
            background: rgba(7, 17, 27, 0.4)
    .bg-layer
        position: relative
        height: 100%
        background: $color-background
    .list
        position: fixed
        top: 0
        bottom: 0
        width: 100%
        background: $color-background
        .song-list-wrapper
            padding: 20px 30px
    /*.loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%) */
</style>