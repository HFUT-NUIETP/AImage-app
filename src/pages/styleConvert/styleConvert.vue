<template>
	<Layout>
		<topbar>
			<template v-slot:left>
        <topbar-back v-if="currentMainComponent === 'choose'"></topbar-back>
			</template>
			<template v-slot:center>
				<view>风格转换</view>
			</template>
			<template v-slot:right>
				<view class="topbar-shortcut" v-if="currentMainComponent === 'choose'" @click.stop="imgChange('')">清空</view>
			</template>
		</topbar>
    <img-picker ref="picker" v-show="currentMainComponent === 'choose'" :img="img" v-on:img-change="imgChange($event)"></img-picker>
    <progressing v-if="currentMainComponent === 'progress'"
    :cancel-task="cancelTask" detail="正在生成风格化图像" :percent="percent"></progressing>
		<view id="bottomType" v-if="currentMainComponent === 'choose'">
			<view class="funTypeContainer" v-for="(fun, id) in functionType" :key="id">
				<view class="funTypeBoxWrap">
					<view class="funTypeBox" :style="[{backgroundImage: 'url(' + fun.img + ')'}]" @click="funChoose(fun.name)"></view>
				</view>
				<view class="funTypeName">{{ fun.fun }}</view>
			</view>
			<view style="width: 30rpx;height: 100%;flex-shrink: 0;"></view>
		</view>
		<uni-popup ref="pencilPopup" type="bottom">
			<view class="popup">
				<view class="closeBox" @click="$refs.pencilPopup.close()">×</view>
				<view class="functionTitle">铅笔画</view>
				<view class="inpputBox">
					<view class="inputTitle">{{pencilData.color?'彩色':'黑白'}}模式</view>
					<input-switch :checked="pencilData.color" :click="() => pencilData.color = !pencilData.color" />
					<!--					<switch :checked="pencilData.color" @click="pencilData.color = !pencilData.color" style="transform:scale(0.7)"/>-->
				</view>
				<input-slider name="线条粗细" :value="pencilData.gammaS" :change="(e) => this.pencilData.gammaS = e.detail.value"
				 :show_value="true" step="1" min="1" max="50" />
				<input-slider name="颜色深浅" :value="pencilData.gammaI" :change="(e) => this.pencilData.gammaI = e.detail.value"
				 :show_value="true" step="1" min="1" max="50" />
				<input-slider name="图片质量" :value="pencilData.quality" :change="(e) => this.pencilData.quality = e.detail.value"
				 :show_value="true" step="1" min="1" max="3" />
				<view class="submitButton" @click="startProcess('pencil')">生成</view>
			</view>
		</uni-popup>
		<uni-popup ref="oilPopup" type="bottom">
			<view class="popup">
				<view class="closeBox" @click="$refs.oilPopup.close()">×</view>
				<view class="functionTitle">油墨画</view>
				<view class="inpputBox">
					<view class="inputTitle" style="width: 400rpx">{{oilpaintData.model?'冬季转夏季':'夏季转冬季'}}模式</view>
					<input-switch :checked="oilpaintData.model" :click="() => this.oilpaintData.model = !this.oilpaintData.model" />
				</view>
				<view class="submitButton" @click="startProcess('oil')">提交</view>
			</view>
		</uni-popup>
    <uni-popup ref="artPopup" type="bottom">
    <view class="popup">
      <view class="closeBox" @click="$refs.artPopup.close()">×</view>
      <view class="functionTitle">艺术化风格选择</view>
      <scroll-view class="artSelect" scroll-y>
        <view class="artSelect-box">
          <view class="artSelect-item" v-for="i in artData" :key="i.img" :style="{backgroundImage: `url(${i.img})`}" @click="artSelect = i.id">
            <view class="artSelect-ok" v-if="artSelect === i.id"></view>
          </view>
        </view>
      </scroll-view>
      <view class="submitButton" @click="startProcess('art')">生成</view>
    </view>
  </uni-popup>
	</Layout>
</template>

<script>
	import Cropper from '../../components/yankai-cropper/cropper.vue';
	import {
		pathToBase64,
		base64ToPath
	} from '../../js_sdk/gsq-image-tools/image-tools/index.js'
	import InputSlider from "../../components/inputSlider";
	import InputSwitch from "../../components/inputSwitch";
	import UniPopup from "../../components/uni-popup/uni-popup";
	import Topbar from "../../components/topbar";
	import Layout from "../../components/layout";
  import TopbarBack from "@/components/topbar-back";
  import Progressing from "@/components/progressing";
  import ImgPicker from "@/components/img-picker";
	export default {
		data() {
			return {
				currentMainComponent: "choose", //Todo:keep this 'choose'
				percent: 1,
				requestTask: undefined,
				errorMsg: "",
				functionType: [{
						name: "pencil",
						fun: '铅笔画',
						img: '../../static/pencil.png'
					},
					{
						name: "oil",
						fun: '油墨画',
						img: '../../static/oil.png'
					},
					{
						name: "anime",
						fun: '动漫风',
						img: '../../static/anime.png'
					},
					{
						name: "art",
						fun: '艺术画',
						img: '../../static/art.png'
					},
				],
				img: '',
				imgCopy: '',

				pencilData: {
					flag: false,
					color: true,
					gammaS: 10,
					gammaI: 10,
					quality: 2
				},
				oilpaintData: {
					flag: false,
					model: true
				},
        artData: [
          {'img': '../../static/styles/style0.jpg', 'id': 0},
          {'img': '../../static/styles/style1.jpg', 'id': 1},
          {'img': '../../static/styles/style2.jpg', 'id': 2},
          {'img': '../../static/styles/style3.jpg', 'id': 3},
          {'img': '../../static/styles/style4.jpg', 'id': 4},
          {'img': '../../static/styles/style5.jpg', 'id': 5},
          {'img': '../../static/styles/style6.jpg', 'id': 6},
          {'img': '../../static/styles/style7.jpg', 'id': 7},
          {'img': '../../static/styles/style8.jpg', 'id': 8},
          {'img': '../../static/styles/style9.jpg', 'id': 9},
          {'img': '../../static/styles/style10.jpg', 'id': 10},
          {'img': '../../static/styles/style11.jpg', 'id': 11},
          {'img': '../../static/styles/style12.jpg', 'id': 12},
          {'img': '../../static/styles/style13.jpg', 'id': 13},
          {'img': '../../static/styles/style14.jpg', 'id': 14},
          {'img': '../../static/styles/style15.jpg', 'id': 15},
          {'img': '../../static/styles/style16.jpg', 'id': 16},
          {'img': '../../static/styles/style17.jpg', 'id': 17},
          {'img': '../../static/styles/style18.jpg', 'id': 18},
          {'img': '../../static/styles/style19.jpg', 'id': 19},
          {'img': '../../static/styles/style20.jpg', 'id': 20},
          {'img': '../../static/styles/style21.jpg', 'id': 21},
          {'img': '../../static/styles/style22.jpg', 'id': 22},
          {'img': '../../static/styles/style23.jpg', 'id': 23},
          {'img': '../../static/styles/style24.jpg', 'id': 24},
          {'img': '../../static/styles/style25.jpg', 'id': 25}],
		    artSelect: undefined
			}
		},
		onLoad() {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.on('addImg', data => {
        console.log(data);
        this.img = data.img;
      })
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
    mounted() {
      if (this.img !== undefined) {
        this.$refs.picker.changeShow();
      }
    },
    methods: {
			back() {
				uni.redirectTo({
					url: "/pages/index/index",
					complete: (e) => {console.log(e)},
				});
			},
      imgChange(event) {
        if (event === '') {
          this.img = "data:image/jpeg;base64";
          this.img = "";
          this.imgCopy = "";
          this.$refs.picker.changeShow();
        } else {
          this.img = event;
          this.imgCopy = event;
        }
      },
			funChoose(type) {
				if (this.img === '') {
					uni.showToast({
						title: "请选择图片",
						icon: "none",
						mask: true
					});
					return;
				}
				switch (type) {
					case 'pencil':
						this.$refs.pencilPopup.open();
						// this.pencilFunction();
						break;
					case 'oil':
						this.$refs.oilPopup.open();
						// this.oilpaintFunction();
						break;
					case 'anime':
						this.startProcess("anime");
						break;
					case 'art':
					  this.$refs.artPopup.open();
						break;
					default:
						return;
				}
			},
			startProcess(type) {
				this.errorMsg = "";
				this.currentMainComponent = "progress";
				this.percent = 1;
				let data = {};
				let path = "";
				let img = this.img.split(',')[1]
				switch (type) {
					case 'pencil':
						this.$refs.pencilPopup.close();
						data = {
							'img': img,
							'color': (this.pencilData.color ? 'True' : 'False'),
							's': (this.pencilData.gammaS / 10).toFixed(1),
							'i': (this.pencilData.gammaI / 10).toFixed(1),
							'q': this.pencilData.quality
						};
						path = "pencil";
						break;
					case 'oil':
						this.$refs.oilPopup.close();
						data = {
							'img': img,
							'model': (this.oilpaintData.model ? 0 : 1)
						};
						path = "oilpaint";
						break;
					case 'anime':
						data = {
							'img': img
						};
						path = "anime";
						break;
					case 'art':
					  this.$refs.artPopup.close();
						data = {
							'img': img,
              'style_no': this.artSelect
						};
						path = "style_transfer";
						break;
					default:
						return;
				}
				this.percent = 50;
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
							if (this.currentMainComponent === "choose") return;
							const img = "data:image/png;base64," + res.data;
              uni.navigateTo({
                url: "/pages/success/success",
                success: (res) => {
                  res.eventChannel.emit("success",
                      {
                        img: img,
                        title: "版权保护",
                        url: "/pages/encrypt/encrypt"
                      })
                }
              })
              this.currentMainComponent = "choose";
						} else {
							this.errorMsg = "内部错误";
              uni.navigateTo({
                url: "/pages/error/error",
                success: (res) => {
                  res.eventChannel.emit("error", {errorMsg: this.errorMsg, title: "风格转换"});
                }
              })
              this.currentMainComponent = "choose";
						}
					},
					fail: (res) => {
            if (res.errMsg === "request:fail abort") return;
            this.errorMsg = "网络异常"
            uni.navigateTo({
              url: "/pages/error/error",
              success: (res) => {
                res.eventChannel.emit("error", {errorMsg: this.errorMsg, title: "风格转换"});
              }
            })
            this.currentMainComponent = "choose";
					}
				});
				let progressAdd = () => setTimeout(() => {
					if (this.percent < 99) {
						this.percent += 1;
						progressAdd();
					}
				}, 1500);
				progressAdd();
			},
			cancelTask() {
				if (this.requestTask !== undefined) {
					this.requestTask.abort();
				}
				this.currentMainComponent = "choose";
			},
		},
		components: {
      ImgPicker,
      Progressing,
      TopbarBack,
			Layout,
			UniPopup,
			InputSwitch,
			InputSlider,
			Cropper,
			Topbar
		}
  }
</script>

<style lang="scss" scoped>
	@import "../../common";
	.statusBar {
		background-image: linear-gradient(to right, #ededed, #6d89c3);
		width: 750px;
		/*position: fixed;*/
		top: 0;
		z-index: 999;
	}

	#menu {
		width: 65rpx;
		height: 65rpx;
		/* background-color: #007AFF; */
		position: absolute;
		top: 50%;
		right: 20rpx;
		transform: translateY(-50%);
	}

	.menuButton {
		width: 25rpx;
		height: 25rpx;
		border: #CCCCCC 2rpx solid;
		flex-shrink: 0;
		position: absolute;
	}

	.boxBack {
		width: 100%;
		background-color: inherit;
		flex-grow: 1;
		display: flex;
		/*padding: 200rpx 0 0 0;*/
	}



	#bottomType {
		padding-top: 10rpx;
		width: 100%;
		height: 240rpx;
		/*padding-bottom: 10px;*/
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		overflow-x: scroll;
		z-index: 10;
	}

	.funTypeContainer {
		margin-left: 50rpx;
	}

	.funTypeBoxWrap {
		border-radius: 32rpx;
		border: 1px solid white;
		box-shadow: 0 0 8rpx #888;
		margin-bottom: 10rpx;
	}

	.funTypeBox {
		width: 116rpx;
		height: 116rpx;
		/*background-color: #67C23A;*/
		border-radius: 30rpx;
		flex-shrink: 0;
		position: relative;
		overflow: hidden;
		background-position-x: center;
		background-position-y: center;
	}

	.funTypeName {
		/*width: 100%;*/
		height: 60rpx;
		/*position: absolute;*/
		/*bottom: 0;*/
		/*background-color: rgba(0, 0, 0, 0.5);*/
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
	}

	.functionBox {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		top: 0;
		left: 0;
	}

	.functionCard {
		width: 80%;
		height: 45%;
		padding: 10%;
		position: absolute;
		bottom: 200rpx;
		left: 0;
		border-top-left-radius: 40rpx;
		border-top-right-radius: 40rpx;
		background-color: #FFFFFF;
		overflow: auto;
	}

	.closeBox {
		position: absolute;
		top: 20rpx;
		right: 50rpx;
		font-size: 50rpx;
		font-weight: 900;
	}

	.functionTitle {
		width: 100%;
		height: 80rpx;
		text-align: center;
		font-size: 40rpx;
		font-weight: 900;
		line-height: 80rpx;
	}

	.inpputBox {
		width: 100%;
		height: 120rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.inputTitle {
		width: 30%;
	}

	.inputSlider {
		width: 70%;
	}

	@import "../../common";

	.submitButton {
		@extend .button
		/*width: 90%;*/
		/*height: 80rpx;*/
		/*margin: 50rpx auto;*/
		/*background-color: #7076fe;*/
		/*color: #FFFFFF;*/
		/*font-size: 40rpx;*/
		/*border-radius: 40rpx;*/
		/*line-height: 80rpx;*/
		/*text-align: center;*/
	}

	.topbar {
		width: 100%;
		height: 144rpx;
		background-color: #FFFFFF;
		border-bottom: #e5e5e5 2rpx solid;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		/*position: fixed;*/
		z-index: 10;
		font-size: 40rpx;
		font-family: "Alibaba PuHuiTi B";


		&-back {
			background-image: url("../../static/back.png");
			@extend .topbar-icon
		}
	}

  .artSelect {
    width: 576rpx;
    height: 596rpx;

    margin: 20rpx auto 0;

    &-box {
      display: flex;
      flex-wrap: wrap;
    }

    &-item {
      width: 184rpx;
      height: 184rpx;
      background-size: cover;
      border-bottom: 4rpx solid white;
      border-right: 4rpx solid white;
      display: inline-flex;
      justify-content: flex-end;
      align-items: flex-end;
    }
    &-ok {
      background-image: url("../../static/ok.png");
      width: 24px;
      height: 24px;
    }
  }

</style>
