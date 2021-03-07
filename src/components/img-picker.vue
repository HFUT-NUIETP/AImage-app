<template>
  <view class="content-box">
    <view id="chooseBox">
      <image class="image" v-if="!show" v-bind:src="img" mode="aspectFill"></image>
      <view @click.stop="addImg" v-if="show" id="addMask">
        <view id="addIcon"></view>
        <view v-if="false" id="changeIcon"></view>
      </view>
    </view>
    <view>
      <cropper ref="cropper" :aspectRatio="1" :imagePath="img" @complete="complete" @cancel="cancel"></cropper>
    </view>
  </view>
</template>

<script>
import cropper from "@/components/yankai-cropper/cropper";
export default {
  name: "img-picker",
  props: ['img'],
  data() {
    return {
      show: true
    }
  },
  components: {
    cropper
  },
  methods: {
    addImg() {
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          console.log(res);
          this.$refs.cropper.init(res.tempFilePaths[0]);
        }
      });
    },
    complete(res) {
      this.$refs.cropper.close(true);
      this.$emit('img-change', res.path);
      // this.img = res.path;
      // this.imgCopy = res.path;
      this.show = false;
    },
    cancel() {
      this.$emit('img-change', res.path);
      // this.img = "data:image/jpeg;base64";
      // this.img = "";
      // this.imgCopy = "";
      this.show = true;
    },
    changeShow() {
      this.show = !this.show;
    }
  }
}
</script>

<style scoped lang="scss">
@import "../common";
#chooseBox {
  width: 100%;
  /*height: 900rpx;*/
  background-color: #ffffff;
  /*border-radius: 40rpx;*/
  /*margin: 0 auto;*/
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

#addMask {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  /*background-color: rgba(0,0,0,0.3);*/
  overflow: hidden;
  /*position: absolute;*/
  /*top: 0;*/
  /*left: 0;*/
}

#addIcon {
  width: 100rpx;
  height: 100rpx;
  background-image: url("../static/add.png");
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #FFFFFF;
}

</style>