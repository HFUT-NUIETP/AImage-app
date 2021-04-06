<template>
  <Layout>
    <topbar>
      <template v-slot:left>
        <topbar-back></topbar-back>
      </template>
      <template v-slot:center>
        <view>保存并分享</view>
      </template>
    </topbar>
    <view class="content-box">
      <view class="successBox">
        <view>
          <image class="image" :src="img" mode="aspectFill"></image>
        </view>
        <view class="buttonGroup">
          <view class="button" @click="saveImage">保存</view>
          <view class="button" @click="share">分享</view>
          <view class="button" v-if="title" @click="to(url)">{{title}}</view>
        </view>
      </view>
    </view>
  </Layout>
</template>

<script>
import {base64ToPath} from "@/js_sdk/gsq-image-tools/image-tools";
import Layout from "@/components/layout";
import Topbar from "@/components/topbar";
import TopbarBack from "@/components/topbar-back";

export default {
  name: "success",
  components: {Topbar, Layout, TopbarBack},
  data() {
    return {
      img: undefined,
      url: undefined,
      title: undefined
    }
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('success', data => {
      console.log(data);
      this.img = data.img;
      this.title = data.title;
      this.url = data.url;
    })
  },
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
          },
          complete: () => {
            uni.hideLoading();
          }
        });
        uni.showLoading({
          title: "正在保存"
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
    to(url) {
      uni.navigateTo({
        url: url,
        success: (res) => {
          res.eventChannel.emit("addImg", {img: this.img})
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../common";
.successBox {
  background-color: #fff;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

</style>