<!--
 * @Descripttion: 
 * @version: 
 * @Author: 马琳峰
 * @Date: 2021-02-03 17:53:36
 * @LastEditors: 马琳峰
 * @LastEditTime: 2021-02-09 10:55:07
-->
<template>
  <section>
    <router-view></router-view>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    computed: {

    }
  }
</script>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .2s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>