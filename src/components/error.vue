<template>
  <view class="content-box">
    <view class="errorBox">
      <view class="errorContent">
        <view class="errorIcon"></view>
        <view style="font-size: 36rpx; margin-top: 100rpx">错误: {{errorMsg}}</view>
      </view>
      <view class="buttonGroup">
        <view class="button" @click="cancelTask">确认</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "error",
  props: ['errorMsg', 'cancelTask']
}
</script>

<style scoped lang="scss">
@import "../common";
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
  background-image: url('../static/error.png');
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