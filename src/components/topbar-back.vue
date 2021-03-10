<template>
  <view class="topbar-back" @click.stop="back"></view>
</template>

<script>
export default {
  name: "topbar-back",
  methods: {
    back() {
      uni.navigateBack();
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/common";
.topbar-back {
  background-image: url("../static/back.png");
  @extend .topbar-icon
}

</style>