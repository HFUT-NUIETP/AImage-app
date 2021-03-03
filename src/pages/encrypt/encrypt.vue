<template>
<layout>
  <topbar>
    <template v-slot:left>
      <topbar-back></topbar-back>
    </template>
    <template v-slot:center>
      <view>版权保护</view>
    </template>
    <template v-slot:right>
      <view class="topbar-shortcut" @click="imgChange('')" v-if="currentMainComponent === 'picker'">清空</view>
    </template>
  </topbar>
  <img-picker ref="picker" :img="img" v-on:img-change="imgChange($event)" v-if="currentMainComponent === 'picker'"></img-picker>
  <view class="content-box" v-else-if="currentMainComponent === 'input' || currentMainComponent === 'output'">
    <view class="input-area">
      <textarea v-model="textareaValue" class="textarea" placeholder="请输入要加密的文字"></textarea>
      <view class="button" v-if="currentMainComponent === 'input'">开始加密</view>
      <view class="button" v-else-if="currentMainComponent === 'output'">复制</view>
    </view>
  </view>
  <progressing :detail="progressDetail" :percent="percent" :cancel-task="cancelTask" v-else-if="currentMainComponent === 'progress'"></progressing>
  <success :img="img" is-encrypted v-else-if="currentMainComponent === 'success'"></success>
  <view class="function" v-if="currentMainComponent === 'picker'">
    <view class="button margin-l-r">加密</view>
    <view class="button margin-l-r">解密</view>
  </view>
</layout>
</template>

<script>
import Layout from "@/components/layout";
import Topbar from "@/components/topbar";
import TopbarBack from "@/components/topbar-back";
import ImgPicker from "@/components/img-picker";
import Progressing from "@/components/progressing";
import Success from "@/components/success";
export default {
  name: "encrypt",
  components: {Success, Progressing, ImgPicker, TopbarBack, Topbar, Layout},
  data() {
    return {
      img: undefined,
      currentMainComponent: "picker", // TODO: keep this 'picker',
      textareaValue: "",
      percent: 1,
      requestTask: undefined,
      progressDetail: ""
    }
  },
  methods: {
    imgChange(event) {
      if(event === '') {
        this.img = "data:image/jpeg;base64";
        this.img = "";
        this.$refs.picker.changeShow();
      } else {
        this.img = event;
      }
    },
    cancelTask() {
      if (this.requestTask !== undefined) {
        this.requestTask.abort();
      }
      this.currentMainComponent = "picker";
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../common";
.function {
  display: flex;
  background-color: white;
  justify-content: space-around;
  align-items: center;
}

.margin-l-r {
  margin-left: 40rpx;
  margin-right: 40rpx;
}

.textarea {
  width: 584rpx;
  height: 1099rpx;
  border: 2px solid #707070;
  padding: 20px;
}

.input-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>