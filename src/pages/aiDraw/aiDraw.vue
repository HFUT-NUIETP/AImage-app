<template>
<Layout>
  <Topbar>
    <template v-slot:left>
      <topbar-back></topbar-back>
    </template>
    <template v-slot:center>
      <view>AI 创作</view>
    </template>
    <template v-slot:right>
      <view class="topbar-shortcut">生成</view>
    </template>
  </Topbar>
  <view class="draw-box">
    <draw></draw>
  </view>
</Layout>
</template>

<script>
import Layout from "@/components/layout";
import Topbar from "@/components/topbar";
import TopbarBack from "@/components/topbar-back";
import Draw from "@/components/xiaobai-draw/xiaobai-draw"
export default {
  name: "aiDraw",
  components: {TopbarBack, Topbar, Layout, Draw},
  mounted() {
  },
  data() {
    return {
      canvasData: {
        paintColor: "#fff",
        size: 8,
        img: ""
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../common";

.draw-box {
  @extend .content-box;
}
</style>