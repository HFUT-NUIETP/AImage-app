<template>
  <view class="topbar-back" @click.stop="back"></view>
</template>

<script>
export default {
  name: "topbar-back",
  methods: {
    back() {
      uni.redirectTo({
        url: "/pages/index/index",
        complete: (e) => {
          console.log(e)
        },
      });
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