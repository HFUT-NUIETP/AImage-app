<template>
  <layout>
    <topbar>
      <template v-slot:left>
        <topbar-back></topbar-back>
      </template>
      <template v-slot:center>
        <view>{{title}}</view>
      </template>
    </topbar>
    <view class="content-box">
      <view class="errorBox">
        <view class="errorContent">
          <view class="errorIcon"></view>
          <view style="font-size: 36rpx; margin-top: 100rpx">错误: {{errorMsg}}</view>
        </view>
        <view class="buttonGroup">
          <view class="button" @click="goBack">确认</view>
        </view>
      </view>
    </view>
  </layout>
</template>

<script>
import Layout from "@/components/layout";
import Topbar from "@/components/topbar";
import TopbarBack from "@/components/topbar-back";
export default {
  name: "error",
  components: {TopbarBack, Topbar, Layout},
  props: ['cancelTask'],
  data() {
    return {
      errorMsg: undefined,
      title: undefined
    }
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on("error", e => {
      this.errorMsg = e.errorMsg;
      this.title = e.title;
    })
  },
  methods: {
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../common";
.errorBox {
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /*align-items: center;*/
  flex-grow: 1;
}
.errorIcon {
  background-image: url('../../static/error.png');
  height: 90rpx;
  width: 100rpx;
  background-size: cover;
}

.errorContent {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>