<template>
    <view class="container" :style="[{ height: windowHeight - statusBarHeight + 'px' }]">
        <slot></slot>
    </view>
</template>

<script>
    export default {
        name: "layout",
        data() {
          return {
              windowHeight: 0,
              statusBarHeight: 0
          }
        },
        mounted() {
            setTimeout(() => {
                //获取状态栏高度，setTimeout后才能调用uni.
                uni.getSystemInfo({
                    success: res => {
                        this.statusBarHeight = res.statusBarHeight;
                        this.windowHeight = res.windowHeight;
                    }
                });
            }, 1);
        },
    }
</script>

<style scoped lang="scss">
    .container {
        width: 100%;
        background-color: #f3f3f3;
        position: relative;
        display: flex;
        flex-direction: column;
    }
</style>