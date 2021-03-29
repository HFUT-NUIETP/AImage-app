<template>
<Layout style="background-color: white">
  <Topbar style="border-bottom: none">
    <template v-slot:left>
      <topbar-back></topbar-back>
    </template>
    <template v-slot:center>
      <text>关于</text>
    </template>
  </Topbar>
  <view class="main-container">
    <view class="main">
      <view class="logo"></view>
      <view>AI 绘图</view>
      <view style="font-size: 12px; color: #525151">V {{version}}</view>
    </view>
  </view>
  <view class="information">
    <view style="color: #525151; font-size: 16px;">
      文字文字文字文字文字文字文字文字文字文字
      文字文字文字文字文字文字文字文字文字文字
      文字文字文字文字文字文字文字文字文字文字
      文字文字文字文字文字文字文字文字文字文字
      文字文字文字文字文字文字文字文字文字文字
      Lorem ipsum dolor sit amet, consectetur
      adipisicing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna ali-
      qua. Ut enim ad minim veniam, quis no-
      strud exercitation ullamco laboris nisi ut
      aliquip exea commodo consequat. Duis
      aute irure dolor in reprehenderit in volu-
      ptate velit esse cillum dolore eu fugiat n
      ulla pariatur. Excepteur sint occaecat cu
      pidatat non proident, sunt in culpa qui o
      fficia deserunt mollit anim id est laborum.
      Lorem ipsum dolor sit amet, consectetur
      adipisicing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna ali-
      qua. Ut enim ad minim veniam, quis no-
      strud exercitation ullamco laboris nisi ut
      aliquip exea commodo consequat. Duis
    </view>
  </view>
</Layout>
</template>

<script>
import Layout from "@/components/layout";
import Topbar from "@/components/topbar";
import TopbarBack from "@/components/topbar-back";
export default {
  name: "about",
  components: {TopbarBack, Topbar, Layout}
}
</script>

<style scoped lang="scss">
.main {
  justify-content: center;
  align-items: center;
  height: 346rpx;
  display: flex;
  box-shadow: 0 6rpx 6rpx rgba(0,0,0, 0.16);
  flex-direction: column;
  > * {
    margin-top: 20rpx;
  }
}
.logo {
  background-image: url("../../static/LOGO_full.png");
  width: 160rpx;
  height: 160rpx;
  background-size: cover;
}
.information {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 34px;
  overflow: hidden;
}
</style>