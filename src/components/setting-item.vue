<template>
  <view class="item">
    <view class="item-main">
      <slot name="main"></slot>
    </view>
    <view v-if="!arrow">
      <slot name="side"></slot>
    </view>
    <view v-else class="item-arrow">
    </view>
  </view>
</template>

<script>
export default {
  name: "setting-item",
  props: {
    arrow: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="scss">
.item {
  display: flex;
  align-items: center;
  margin-top: 40rpx;

  &-main {
    flex-grow: 1;
  }

  &-arrow {
    background-image: url("../static/right-arrow.png");
    width: 48rpx;
    height: 48rpx;
    background-size: cover;
    background-position-x: 208rpx;
  }
}
</style>