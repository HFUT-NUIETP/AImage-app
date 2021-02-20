<template>
	<Layout>
		<view class="statusBar" :style="{ height: statusBarHeight + 'px' }"></view>
		<topbar>
			<template v-slot:left>
        <topbar-back v-if="currentMainComponent === 'choose' || currentMainComponent === 'success'"></topbar-back>
			</template>
			<template v-slot:center>
				<view v-if="currentMainComponent === 'choose' || currentMainComponent === 'progress' || currentMainComponent === 'error'"
				 style="font-weight: bold;">风格转换</view>
				<view v-if="currentMainComponent === 'success'" style="font-family: PBold; font-weight: bold; margin: auto">保存并分享</view>
			</template>
			<template v-slot:right>
				<view class="topbar-reset" v-if="currentMainComponent === 'choose'" @click.stop="cancel">清空</view>
			</template>
		</topbar>
		<view class="boxBack" v-if="currentMainComponent === 'choose'">
			<view id="chooseBox">
				<image class="image" v-if="!showADD" v-bind:src="img" mode="aspectFill"></image>
				<view @click.stop="addImg" v-if="showADD" id="addMask">
					<view id="addIcon"></view>
					<view v-if="false" id="changeIcon"></view>
				</view>
			</view>
		</view>
		<view class="boxBack" v-else-if="currentMainComponent === 'progress'" :style="[{height: windowHeight + 'px'}]">
			<view class="progress-popup">
				<u-circle-progress :percent="percent" active-color="#6200ee" width="112" border-width="10" inactive-color="#fff">
					<text>{{percent}}%</text>
				</u-circle-progress>
				<view>正在生成风格化图像</view>
				<view class="cancel-button" @click="cancelTask">取消</view>
			</view>
		</view>
		<view class="boxBack" v-else-if="currentMainComponent === 'success'">
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
		<view class="boxBack" v-else-if="currentMainComponent === 'error'">
			<view class="errorBox">
				<view class="errorContent">
					<view class="errorIcon"></view>
					<view style="font-size: 36rpx; margin-top: 100rpx">错误: {{errorMsg}}</view>
				</view>
				<view class="buttonGroup">
					<view class="button" @click="cancelTask">确认</view>
				</view>
			</view>
		</view>
		<view>
			<cropper ref="cropper" :aspectRatio="1" :imagePath="img" @complete="complete" @cancel="cancel"></cropper>
		</view>
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
				<input-slider name="图片质量" :value="pencilData.quality" :change="(e) => this.pencilData.gammaS = e.detail.value"
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
	</Layout>
</template>

<script>
	import Cropper from '../../components/yankai-cropper/cropper.vue';
	import uCircleProgress from 'uview-ui/components/u-circle-progress/u-circle-progress.vue'
	// import md5 from 'md5.js'
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
	export default {
		data() {
			return {
				statusBarHeight: 0,
				windowHeight: 0,
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
						name: "cartoon",
						fun: '卡通头像',
						img: '../../static/cartoon.png'
					},
				],
				showADD: true,
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
				}
			}
		},
		onLoad() {
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
		methods: {
			back() {
				uni.redirectTo({
					url: "/pages/index/index",
					complete: (e) => {console.log(e)},
				});
			},
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
				this.img = res.path;
				this.imgCopy = res.path;
				this.showADD = false;
			},
			cancel() {
				this.img = "data:image/jpeg;base64";
				this.img = "";
				this.imgCopy = "";
				this.showADD = true;
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
					case 'cartoon':
						this.startProcess("cartoon");
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
				switch (type) {
					case 'pencil':
						this.$refs.pencilPopup.close();
						data = {
							'img': this.img.split(',')[1],
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
							'img': this.img.split(',')[1],
							'model': (this.oilpaintData.model ? 0 : 1)
						};
						path = "oilpaint";
						break;
					case 'anime':
						data = {
							'img': this.img.split(',')[1]
						};
						path = "anime";
						break;
					case 'cartoon':
						data = {
							'img': this.img.split(',')[1]
						};
						path = "cartoon";
						break;
					default:
						return;
				}
				this.percent = 50;
				this.requestTask = uni.request({
					url: this.serverUrl + path,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: data,
					success: (res) => {
						if (res.statusCode === 200 && res.data.status === 1) {
							uni.hideLoading();
							this.errorMsg = "没有找到人脸哦，请换张图片"
							this.currentMainComponent = "error";
						} else if (res.statusCode === 200) {
							this.percent = 100;
							if (this.currentMainComponent === "choose") return;
							this.currentMainComponent = "success";
							this.img = "data:image/png;base64," + res.data;
							this.pencilData.flag = false;
						} else {
							this.errorMsg = "内部错误";
							this.currentMainComponent = "error";
						}
					},
					fail: (res) => {
						this.errorMsg = "网络异常"
						this.currentMainComponent = "error";
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
				if (this.requestTask != undefined) {
					this.requestTask.abort();
				}
				this.currentMainComponent = "choose";
			},
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
		},
		components: {
      TopbarBack,
			Layout,
			UniPopup,
			InputSwitch,
			InputSlider,
			Cropper,
			uCircleProgress,
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

	.image {
		width: 100%;
		height: 670rpx;
	}

	#addMask {
		width: 100%;
		height: 100%;
		/*background-color: rgba(0,0,0,0.3);*/
		overflow: hidden;
		/*position: absolute;*/
		/*top: 0;*/
		/*left: 0;*/
	}

	#addIcon {
		width: 100rpx;
		height: 100rpx;
		background-image: url("../../static/add.png");
		background-size: cover;
		margin: 50% auto 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #FFFFFF;
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
		font-family: PBold;

		&-reset {
			margin-right: 20rpx;
			color: #6f75fe;
			font-size: 36rpx;
		}

		&-back {
			background-image: url("../../static/back.png");
			@extend .topbar-icon
		}
	}

	.popup {
		background-color: #fff;
		padding: 10%;
	}

	.progress-popup {
		width: 100%;
		background-color: white;
		padding: 10%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.cancel-button {
		@extend .button;
	}

	.successBox {
		background-color: #fff;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.buttonGroup {
		padding: 10%;
	}

	.errorBox {
		width: 100%;
		background-color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		/*align-items: center;*/
		flex-grow: 1;
	}

	.errorIcon {
		background-image: url('../../static/error.png');
		height: 90rpx;
		width: 100rpx;
		background-size: cover;
	}

	.errorContent {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
</style>
