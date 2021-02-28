<template>
  <view class="content-box">
    <view class="successBox">
      <view>
        <image class="image" :src="img" mode="aspectFill"></image>
      </view>
      <view class="buttonGroup">
        <view class="button" @click="saveImage">保存</view>
        <view class="button" @click="share">分享</view>
        <view class="button" @click="encrypted">加密</view>
      </view>
    </view>
  </view>
</template>

<script>
import {base64ToPath} from "@/js_sdk/gsq-image-tools/image-tools";

export default {
  name: "success",
  props: ['img'],
  methods: {
    saveImage() {
      base64ToPath(this.img).then((path) => {
        uni.saveImageToPhotosAlbum({
          filePath: path,
          success: () => {
            uni.showToast({
              title: "保存成功",
              icon: "none",
              mask: false,
              duration: 2000
            })
          },
          fail: () => {
            uni.showToast({
              title: "保存失败",
              icon: "none",
              mask: false,
              duration: 2000
            })
          }
        })
      });
    },
    share() {
      base64ToPath(this.img).then((path) => {
        uni.shareWithSystem({
          type: "image",
          imageUrl: path,
          success: () => {
            uni.showToast({
              title: "分享成功",
              icon: "none",
              mask: false,
              duration: 2000
            })
          },
          fail: () => {
            uni.showToast({
              title: "分享失败",
              icon: "none",
              mask: false,
              duration: 2000
            })
          }
        });
      });
    },
    encrypted() {
      uni.showToast({
        title: "暂不可用",
        duration: 2000,
        icon: "none"
      })
      //TODO: Not Implementation
    }
  }
}
</script>

<style scoped lang="scss">
@import "../common";
.successBox {
  background-color: #fff;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>