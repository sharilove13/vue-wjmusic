<template>
    <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" :probeTybe="probeTybe" @scroll="scroll">
        <!-- 歌手主体 -->
        <ul>
            <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="(item,index) in group.items" :key="index" class="list-group-item">
                        <img v-lazy="item.avatar" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <!-- 侧边 -->
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li v-for="(item,index) in shortcutList" :key="index" :data-index="index" class="item" :class="{'current':currentIndex === index}">
                    {{item}}
                </li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
    </scroll>
</template>

<script>
    import Scroll from 'base/scroll/scroll';
    import { getData } from "assets/js/dom";

    const ANCHO_HEIGHT = 18;    //.item(font-size:10px+paddingtopbottom:3px*2)
    const TITLE_HEIGHT = 30;    //.list-group-title(height: 30px)
    export default{
        //计算高亮坐标
        data(){
            return{
                scrollY:-1,
                currentIndex:0,
                probeTybe:3,
                listenScroll:true,
                diff:-1     //与上线的距离
            }
        },
        props:{
            data:{
                type:Array,
                default:[]
            }
        },
        created(){
            this.touch = {}
            // this.listenScroll = true
            // this.probeTybe = 3
            this.listHeight=[]
        },
        computed:{
            //获取快速列表的入口
            shortcutList(){
                return this.data.map((group)=>{
                    return group.title.substr(0,1);
                })
            },
            //固定title的标题
            fixedTitle(){
                if(this.scrollY>0){
                    return ""
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : " "
            }
        },
        methods:{
            //侧边可滚动开始
            onShortcutTouchStart(e){
                //获取下标
                let anchorIndex = getData(e.target,"index");
                //第一个触点位置
                let firstTouch = e.touches[0];
                this.touch.y1 = firstTouch.pageY;
                //记录一开始点锚点是第几个索引
                this.touch.anchorIndex = anchorIndex;
                this._scrollTo(anchorIndex)
            },
            //侧边可滚动结束
            onShortcutTouchMove(e){
                let firstTouch = e.touches[0];
                //垂直滚动的偏移
                this.touch.y2 = firstTouch.pageY;
                //通过总长/每个li高度=锚点个数
                let delta = (this.touch.y2-this.touch.y1)/ANCHO_HEIGHT | 0; 
                //当前索引=初始索引+偏差值
                let anchorIndex = parseInt(this.touch.anchorIndex)+delta;
                this._scrollTo(anchorIndex)
            },
            scroll(pos){
                this.scrollY = pos.y;
            },
            _scrollTo(index){
                if(!index && index !==0){
                    return;
                }
                if(index<0){
                    index=0;
                }else if(index>this.listHeight.length-2){
                    index = this.listHeight.length-2;
                }
                console.log(index);
                //获取上限的位置=>scrollY=>侧边可以联动
                this.scrollY = -this.listHeight[index];
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
            },
            //计算主内容高度
            _calculateHeight(){
                this.listHeight=[]
                // 主内容列表
                const list = this.$refs.listGroup
                let height = 0
                this.listHeight.push(height)
                for(let i=0;i<list.length;i++){
                    //主体每个li的内容
                    let item = list[i];
                    //高度加上li内容的高度
                    height += item.clientHeight;
                    //放入listHeight中
                    this.listHeight.push(height);
                }
            }
        },
        watch:{
            data(){
                setTimeout(()=>{
                    this._calculateHeight();
                },20)
            },
            scrollY(newY){
                const listHeight = this.listHeight;

                //当滚动到顶部，newY>0
                if(newY>0){
                    this.currentIndex =0;
                    return;
                }

                //在中间部分滚动
                for(let i=0;i<listHeight.length-1;i++){
                    let height1 = listHeight[i];
                    let height2 = listHeight[i+1];
                    //如果到最后一个li或者滚动的长度没有滚到下一个li（落在中间）时
                    if(-newY>=height1 && -newY < height2){
                        this.currentIndex = i;
                        //看下一个li是否已经触碰到上线
                        this.diff = height2+newY
                        // console.log(this.currentIndex);
                        return;
                    }
                }

                //当滚动到底部，且-newY大于最后一个元素的上限
                this.currentIndex = listHeight.length-2;
            },
            diff(newVal){
                let fixedTop = (newVal>0 && newVal< TITLE_HEIGHT) ? newVal-TITLE_HEIGHT : 0
                if(this.fixedTop === fixedTop){
                    return;
                }
                this.fixedTop = fixedTop;
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }
        },
        components:{
            Scroll
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~assets/stylus/variable";
  
    .listview
      position: relative
      width: 100%
      height: 100%
      overflow: hidden
      background: $color-background
      .list-group
        padding-bottom: 30px
        .list-group-title
          height: 30px
          line-height: 30px
          padding-left: 20px
          font-size: $font-size-small
          color: $color-text-l
          background: $color-highlight-background
        .list-group-item
          display: flex
          align-items: center
          padding: 20px 0 0 30px
          .avatar
            width: 50px
            height: 50px
            border-radius: 50%
          .name
            margin-left: 20px
            color: $color-text-l
            font-size: $font-size-medium
      .list-shortcut
        position: absolute
        z-index: 30
        right: 0
        top: 50%
        transform: translateY(-50%)
        width: 20px
        padding: 20px 0
        border-radius: 10px
        text-align: center
        background: $color-background-d
        font-family: Helvetica
        .item
          padding: 3px
          line-height: 1
          color: $color-text-l
          font-size: $font-size-small
          &.current
            color: $color-theme
      .list-fixed
        position: absolute
        top: 0
        left: 0
        width: 100%
        .fixed-title
          height: 30px
          line-height: 30px
          padding-left: 20px
          font-size: $font-size-small
          color: $color-text-l
          background: $color-highlight-background
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
  </style>
  