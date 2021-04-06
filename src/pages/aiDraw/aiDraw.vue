<template>
<Layout>
  <Topbar>
    <template v-slot:left>
      <topbar-back v-if="currentMainComponent === 'draw'"></topbar-back>
    </template>
    <template v-slot:center>
      <view>AI 创作</view>
    </template>
    <template v-slot:right>
      <view class="topbar-shortcut" @click="startAIDraw" v-if="currentMainComponent === 'draw'">生成</view>
    </template>
  </Topbar>
  <view class="draw-box" v-show="currentMainComponent === 'draw'">
    <draw ref="draw" v-if="!destroy" :color="`rgb(${colors[colorsIndex[0]].options[colorsIndex[1]].color})`"
          v-on:on-save="aiDrawCallback($event)"
          :use-method="method" :size="size"></draw>
  </view>
  <progressing v-if="currentMainComponent === 'progress'" :percent="percent" detail="AI 正在创作中" :cancel-task="cancelTask"></progressing>
  <view class="draw-function" v-if="currentMainComponent === 'draw'">
    <picker class="draw-palette" mode="multiSelector" :style="[{backgroundColor: `rgb(${colors[colorsIndex[0]].options[colorsIndex[1]].color})`}]" :range="[colors, colors[colorsIndex[0]].options]" range-key="type"
            :value="colorsIndex" @change="e => colorsIndex = e.target.value" @columnchange="onColumnChange">
      <view>{{ colors[colorsIndex[0]].options[colorsIndex[1]].type }}</view>
    </picker>
    <view v-for="f in functions" :key="f.name" :style="[{backgroundImage: `url(${getFuncColor(f)}.png)`, width: f.width, height: f.height}]" @click="callFunc(f)"></view>
  </view>
  <uni-popup ref="paint" type="bottom">
    <view class="popup" style="padding: 48rpx">
      <view class="popup-content">
        <view style="font-size: 18px; font-weight: bold; font-family: PBold">笔刷大小</view>
        <input-slider name="" :value="size" :change="(e) => this.size = e.detail.value"
                      :show_value="true" step="1" min="1" max="50" />
        <view class="button" @click="$refs.paint.close()">确定</view>
      </view>
    </view>
  </uni-popup>
</Layout>
</template>

<script>
import Layout from "@/components/layout";
import Topbar from "@/components/topbar";
import TopbarBack from "@/components/topbar-back";
import Draw from "@/components/draw/draw"
import UniPopup from "@/components/uni-popup/uni-popup";
import InputSlider from "@/components/inputSlider";
import Progressing from "@/components/progressing";
import {pathToBase64} from "@/js_sdk/QuShe-SharerPoster/QS-SharePoster/image-tools";
export default {
  name: "aiDraw",
  components: {Progressing, InputSlider, UniPopup, TopbarBack, Topbar, Layout, Draw},

  data() {
    return {
      functions: [
        {
          name: "new_draw",
          img: "../../static/new_draw",
          width: "56rpx",
          height: "60rpx",
          active: false
        },
        {
          name: "paint",
          img: "../../static/paint",
          width: "56rpx",
          height: "60rpx",
          active: true
        },
        {
          name: "paint_bucket",
          img: "../../static/paint_bucket",
          width: "56rpx",
          height: "60rpx",
          active: false
        },
        {
          name: "withdraw",
          img: "../../static/withdraw",
          width: "56rpx",
          height: "60rpx"
        },
      ],
      currentMainComponent: "draw", //Todo: keep this 'draw',
      percent: 1,
      requestTask: undefined,
      errorMsg: "",
      img: "",
      colorsIndex: [2, 0],
      destroy: false,
      method: "paint",
      size: 8,
      colors: [
        {
          type: "建筑物",
          name: "building",
          options: [
            {
              type: "桥",
              color: "94,91,197"
            },
            {
              type: "围栏",
              color: "112,100,25"
            },
            {
              type: "房子",
              color: "127,69,2"
            },
            {
              type: "平台",
              color: "127,69,2"
            },
            {
              type: "屋顶",
              color: "150,0,177"
            },
            {
              type: "砖墙",
              color: "170,209,106"
            },
            {
              type: "石墙",
              color: "174,41,116"
            },
            {
              type: "木墙",
              color: "76,193,195"
            },
          ]
        },
        {
          type: "地面景物",
          name: "ground",
          options: [
            {
              type: "土",
              color: "110,110,40"
            },
            {
              type: "碎石",
              color: "124,50,200"
            },
            {
              type: "地面",
              color: "125,48,84"
            },
            {
              type: "泥",
              color: "135,113,111"
            },
            {
              type: "人行道",
              color: "139,48,39"
            },
            {
              type: "路",
              color: "148,110,40"
            },
            {
              type: "沙",
              color: "153,153,0"
            }
          ]
        },
        {
          type: "风景景物",
          name: "landscape",
          options: [
            {
              type: "云",
              color: "105,105,105"
            },
            {
              type: "雾",
              color: "119,186,29"
            },
            {
              type: "丘陵",
              color: "126,200,100"
            },
            {
              type: "山脉",
              color: "134,150,100"
            },
            {
              type: "河流",
              color: "147,100,200"
            },
            {
              type: "岩石",
              color: "149,100,50"
            },
            {
              type: "海洋",
              color: "154,198,218"
            },
            {
              type: "天空",
              color: "156,238,221"
            },
            {
              type: "雪",
              color: "158,158,170"
            },
            {
              type: "石头",
              color: "161,161,100"
            },
            {
              type: "水",
              color: "177,200,255"
            },
          ]
        },
        {
          type: "植物",
          name: "plant",
          options: [
            {
              type: "灌木从",
              color: "96,110,50"
            },
            {
              type: "花朵",
              color: "118,0,0"
            },
            {
              type: "草地",
              color: "123,200,0"
            },
            {
              type: "枯草",
              color: "162,163,235"
            },
            {
              type: "树",
              color: "168,200,50"
            },
            {
              type: "木材",
              color: "181,123,0"
            }
          ]
        }
      ],
      currOptions: []
    }
  },
  methods: {
    onColumnChange(e) {
      let [column, value] = [e.detail.column, e.detail.value];
      this.colorsIndex[column] = value;
      this.colorsIndex.splice(1,1,0);
      this.colorsIndex.splice(2,1,0);
    },
    getFuncColor(f) {
      if(f.active === true) {
        return f.img + "-b"
      }
      return f.img
    },
    callFunc(f) {
      if(f.name === "paint" || f.name === "paint_bucket") {
        for (const _f of this.functions) {
          _f.active = false;
        }
        f.active = true;
      }
      switch (f.name) {
        case 'new_draw':
          this.img = "/static/default_input.png";
          this.destroy = true;
          this.$nextTick(() => this.destroy = false);
          break;
        case 'withdraw':
          this.$refs.draw.back();
          break;
        case 'paint':
          if (this.method === "paint") {
            this.$refs.paint.open();
          } else {
            this.method = "paint";
          }
          break;
        case 'paint_bucket':
          this.method = "paint_bucket";
          break;
        default:
          return;
      }

    },
    startAIDraw() {
      this.$refs.draw.save();
    },
    aiDrawCallback(path) {
      const callAPi = (data) => {
        data.img = data.img.split(",")[1];
        this.requestTask = uni.request({
          url: uni.getStorageSync('serverUrl') + "paint",
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: data,
          success: (res) => {
            if (res.statusCode === 200) {
              this.percent = 100;
              if (this.currentMainComponent !== "progress") return;
              const img = "data:image/png;base64," + res.data;
              uni.navigateTo({
                url: "/pages/success/success",
                success: (res) => {
                  res.eventChannel.emit("success",
                      {
                        img: img,
                        title: "风格转换",
                        url: "/pages/styleConvert/styleConvert"
                      })
                }
              })
              this.currentMainComponent = "draw";
            } else {
              this.errorMsg = "内部错误";
              uni.navigateTo({
                url: "/pages/error/error",
                success: (res) => {
                  res.eventChannel.emit("error", {errorMsg: this.errorMsg, title: "AI 创作"});
                }
              })
              this.currentMainComponent = "draw";
            }
          },
          fail: (res) => {
            if (res.errMsg === "request:fail abort") return;
            this.errorMsg = "网络异常"
            uni.navigateTo({
              url: "/pages/error/error",
              success: (res) => {
                res.eventChannel.emit("error", {errorMsg: this.errorMsg, title: "AI 创作"});
              }
            })
            this.currentMainComponent = "draw";
          }
        });
        let progressAdd = () => setTimeout(() => {
          if (this.percent < 99) {
            this.percent += 1;
            progressAdd();
          }
        }, 1500);
        progressAdd();
      }
      this.percent = 1;
      this.currentMainComponent = "progress";
      let data = {
        'img': path
      };
      if (path.indexOf("base64") !== -1) {
        this.percent = 25;
        callAPi(data);
      } else {
        pathToBase64(path).then((res) => {
          data.img = res;
          this.percent = 25;
          callAPi(data);
        })
      }
    },
    cancelTask() {
      if (this.requestTask !== undefined) {
        this.requestTask.abort();
      }
      this.currentMainComponent = "draw";
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../common";

.draw-box {
  @extend .content-box;
}

.draw-function {
  height: 98rpx;
  display: flex;
  align-items: center;
  background-color: white;
  justify-content: space-around;
  > view {
    background-size: cover;
  }
}

.draw-palette {
  width: 120rpx;
  height: 60rpx;
  color: white;
  border: 1rpx solid white;
  box-shadow: 0 0 6rpx #888;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
}

.popup-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.select-box {
  font-size: 28rpx;
  display: flex;
  margin-top: 40rpx;
  height: 96rpx;
  width: 448rpx;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 12px #888;
  border-radius: 10rpx;
}

.picker-area {
  flex-grow: 1;
  padding: 14rpx 24rpx;
}

.picker {
  display: flex;
}

.color-preview {
  width: 34rpx;
  height: 34rpx;
  border: solid 1px black;
  margin-right: 20rpx;
}
</style>