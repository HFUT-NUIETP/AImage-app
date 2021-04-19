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
    <text style="color: #525151; font-size: 16px;">
      AI绘画是一个移动艺术创作平台，构建了一个全新的艺术画创作流程，使用户无需过多专业技巧，即可从0开始创作出风格多元的艺术画，并使用隐水印技术保护作品版权。

      在AI创作模块中，可使用各种绘图工具，简单描绘景物的轮廓，即可生成一张逼真的自然风景图像。

      在风格转换模块中，可对生成的图像进行精细化风格编辑，生成四类风格多样的艺术图像。

      在版权保护模块中，可将版权信息以隐式水印的方式记录到创作作品当中。
    </text>
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
  justify-content: flex-end;
  align-items: flex-start;
  padding: 20px 34px;
  overflow: hidden;
}
</style>