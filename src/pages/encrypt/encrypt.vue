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
  <img-picker ref="picker" :img="img" v-on:img-change="imgChange($event)" v-show="currentMainComponent === 'picker'"></img-picker>
  <view class="content-box" v-if="currentMainComponent === 'input' || currentMainComponent === 'output'">
    <view class="input-area">
      <textarea v-model="textareaValue" class="textarea"
                :placeholder="this.currentMainComponent === 'output' ? '':'请输入要加密的文字'"
                :disabled="this.currentMainComponent === 'output'" :adjust-position="false"></textarea>
      <view class="button" v-if="currentMainComponent === 'input'" @click="encrypted">开始加密</view>
      <view class="button" v-else-if="currentMainComponent === 'output'" @click="copyCopyright">复制</view>
    </view>
  </view>
  <progressing :detail="progressDetail" :percent="percent" :cancel-task="cancelTask" v-else-if="currentMainComponent === 'progress'"></progressing>
  <view class="function" v-if="currentMainComponent === 'picker'">
    <view class="button margin-l-r" @click="emitProcess('en')">加密</view>
    <view class="button margin-l-r" @click="emitProcess('de')">解密</view>
  </view>
</layout>
</template>

<script>
import Layout from "@/components/layout";
import Topbar from "@/components/topbar";
import TopbarBack from "@/components/topbar-back";
import ImgPicker from "@/components/img-picker";
import Progressing from "@/components/progressing";
export default {
  name: "encrypt",
  components: {Progressing, ImgPicker, TopbarBack, Topbar, Layout},
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('addImg', data => {
      console.log(data);
      this.img = data.img;
    })
  },
  mounted() {
    if (this.img !== undefined) {
      this.$refs.picker.changeShow();
    }
  },
  data() {
    return {
      img: undefined,
      currentMainComponent: "picker", // TODO: keep this 'picker',
      textareaValue: "",
      percent: 1,
      requestTask: undefined,
      progressDetail: "",
      errorMsg: ""
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
    },
    emitProcess(func) {
      if (this.img === '' || this.img === undefined) {
        uni.showToast({
          title: "请选择图片",
          icon: "none",
          mask: false,
          duration: 2000
        });
        return;
      }
      this.percent = 25;
      switch (func) {
        case 'en':
          this.currentMainComponent = 'input';
          this.textareaValue = '';
          break;
        case 'de':
          this.decrypted();
      }
    },
    encrypted() {
      if (this.textareaValue === "") {
        uni.showToast({
          title: "加密信息不能为空",
          icon: "none",
          mask: false,
          duration: 2000
        });
        return;
      }
      this.percent = 75;
      let data = {
        img: this.img.split(',')[1],
        txt: this.textareaValue
      };
      this.callApi(data, "image_encry/encode");
    },
    decrypted() {
      let data = {
        img: this.img.split(',')[1]
      }
      this.percent = 75;
      this.callApi(data, "image_encry/decode");
    },
    callApi(data, path) {
      this.requestTask = uni.request({
        url: this.serverUrl + path,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: data,
        success: (res) => {
          if (res.statusCode === 200) {
            this.percent = 100;
            if (this.currentMainComponent === "picker") return;
            if (path === 'image_encry/decode') {
              this.currentMainComponent = "output";
              this.textareaValue = res.data
            } else {
              const img = "data:image/png;base64," + res.data;
              uni.navigateTo({
                url: "/pages/success/success",
                success: (res) => {
                  res.eventChannel.emit("success", {img: img})
                }
              })
              this.currentMainComponent = "picker";
            }
          } else {
            this.errorMsg = "内部错误";
            uni.navigateTo({
              url: "/pages/error/error",
              success: (res) => {
                res.eventChannel.emit("error", {errorMsg: this.errorMsg, title: "版权保护"});
              }
            })
            this.currentMainComponent = "picker";
          }
        },
        fail: (res) => {
          if (res.errMsg === "request:fail abort") return;
          this.errorMsg = "网络异常"
          uni.navigateTo({
            url: "/pages/error/error",
            success: (res) => {
              res.eventChannel.emit("error", {errorMsg: this.errorMsg, title: "版权保护"});
            }
          })
          this.currentMainComponent = "picker";
        }
      });
      let progressAdd = () => setTimeout(() => {
        if (this.percent < 99) {
          this.percent += 1;
          progressAdd();
        }
      }, 1500);
      progressAdd();
      this.currentMainComponent = 'progress';
    },
    copyCopyright() {
      uni.setClipboardData({
        data: this.textareaValue,
        success: (e) => {
          uni.showToast({
            title: "已复制",
            icon: "none",
            mask: false,
            duration: 2000
          })
        },
        complete: (e) => {
          console.log(e);
        }
      });
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
  flex-grow: 1;
  //height: 1099rpx;
  border: 2px solid #707070;
  padding: 20px;
}

.input-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}
</style>