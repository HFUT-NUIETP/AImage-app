<template>
  <view class="content-box">
    <view class="progress-popup">
      <u-circle-progress :percent="percent" active-color="#6200ee" width="112" border-width="10" inactive-color="#fff">
        <text>{{percent}}%</text>
      </u-circle-progress>
      <view>{{detail}}</view>
      <view class="button" @click="cancelTask">取消</view>
    </view>
  </view>
</template>

<script>
import uCircleProgress from 'uview-ui/components/u-circle-progress/u-circle-progress.vue'

export default {
  name: "progressing",
  components: {
    uCircleProgress
  },
  props: ['cancelTask', 'detail', 'percent'],
}
</script>

<style scoped lang="scss">
@import "../common";
.progress-popup {
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>