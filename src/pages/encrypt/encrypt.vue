<template>
<layout>
  <topbar>
    <template v-slot:left>
      <topbar-back v-if="currentMainComponent === 'picker'"></topbar-back>
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
      <view class="input-title">
        <span>
          <span>
            版权信息
          </span>
        </span>
      </view>
      <view class="input-group">
        <view class="input-item" v-for="(v, k) in inputs" :key="k">
          <view class="input-wrapper">
            <view class="input-label">{{inputsMap[k]}}</view>
            <input class="input" v-model:value="inputs[k]" :disabled="currentMainComponent === 'output'">
          </view>
        </view>
        <view class="input-item">
          <view class="input-label">备注信息</view>
          <textarea v-model="textareaValue" class="textarea" :disabled="currentMainComponent === 'output'"></textarea>
        </view>
      </view>
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
import {pathToBase64} from "@/js_sdk/gsq-image-tools/image-tools";
import {postProcessImageData} from "@/api/postProcess";
export default {
  name: "encrypt",
  components: {Progressing, ImgPicker, TopbarBack, Topbar, Layout},
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('addImg', data => {
      console.log(data);
      this.img = data.img;
      // #ifdef APP-PLUS
      if (this.img !== "" && this.img !== undefined) {
        this.$refs.picker.changeShow();
      }
      // #endif
    })
  },
  mounted() {
    // #ifdef H5
    if (this.img !== "" && this.img !== undefined) {
      this.$refs.picker.changeShow();
    }
    // #endif
  },
  data() {
    return {
      img: undefined,
      currentMainComponent: "picker", // TODO: keep this 'picker',
      textareaValue: "",
      percent: 1,
      requestTask: undefined,
      progressDetail: "",
      errorMsg: "",
      inputs: {
        author: "",
        date: "",
        contact: "",
        copyright: "",
      },
      inputsMap: {
        author: "作者",
        date: "创作日期",
        contact: "联系方式",
        copyright: "版权声明",
        area: "备注信息"
      }
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
      this.percent = 50;
      let text = Object.assign({}, this.inputs);
      text.area = this.textareaValue;
      let data = {
        img: this.img.split(',')[1],
        txt: JSON.stringify(text)
      };
      postProcessImageData(data).then((res) => {
        this.percent = 75;
        this.callApi(res, "image_encry/encode")
      });
    },
    decrypted() {
      let data = {
        img: this.img.split(',')[1]
      }
      this.percent = 50;
      postProcessImageData(data).then((res) => {
        this.percent = 75;
        this.callApi(res, "image_encry/decode")
      });
    },
    callApi(data, path) {
      this.requestTask = uni.request({
        url: uni.getStorageSync('serverUrl') + path,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: data,
        success: (res) => {
          if (res.statusCode === 200) {
            this.percent = 100;
            if (this.currentMainComponent !== "progress") return;

            if (path === 'image_encry/decode') {
              this.currentMainComponent = "output";
              let data = res.data;
              this.textareaValue = data.area;
              delete data.area;
              this.inputs = data;
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
      let text = [];
      for (const inputsKey in this.inputs) {
        text.push(`${this.inputsMap[inputsKey]}: ${this.inputs[inputsKey]}\n`);
      }
      text.push(`备注信息: ${this.textareaValue}`);
      uni.setClipboardData({
        data: text.join(),
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
  flex-grow: 1;
  @extend .input;
  padding: 20rpx;
  width: auto;
  height: 200rpx;
}

.input-area {
  flex-grow: 1;
  padding: 36rpx 72rpx;
  display: flex;
  flex-direction: column;
}

.input-title {
  font-family: "Alibaba PuHuiTi B";
  font-size: 18px;
  text-align: center;
  span {
    border-bottom: 2px #A1A1A1 solid;
  }
  > span {
    padding-bottom: 4px;
    > span {
      padding-bottom: 8px;
    }
  }
}

.input-group {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.input-item{
  display: flex;
  flex-direction: column;
  margin-top: 48rpx;

  input {
    height: 82rpx;
  }
}

.input-label {
  font-size: 16px;
  margin-bottom: 20rpx;
}

.input-wrapper {
  flex-grow: 1;
}
</style>