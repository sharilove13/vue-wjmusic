<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- 保证切换tab时不重新初始化 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  export default {
    components:{
      MHeader,
      Tab
    }
  }
</script>

<!-- <style>
  body,html{
    line-height:1;
    font-family: "PingFang SC","STHeitiSC-Light","Helvetica-Light",arial,sans-serif;
    background:#222;
    color:#fff;
  }
</style> -->
