<template>
	<view class="container" :style="[{ height: windowHeight - statusBarHeight + 'px' }]">
		<view class="statusBar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="topbar" :style="[{ marginTop: statusBarHeight + 'px' }]">
			<view class="topbar-back" @click.stop="back"></view>
			<view style="font-family: PBold; font-weight: bold;">风格处理</view>
			<view class="topbar-reset" @click.stop="cancel">清空</view>
		</view>

		<view id="boxBack">
			<view id="chooseBox">
				<image id="image" v-if="!showADD" v-bind:src="img" mode="aspectFill"></image>
				<view @click.stop="addImg" v-if="showADD" id="addMask">
					<view id="addIcon"></view>
					<view v-if="false" id="changeIcon"></view>
				</view>
			</view>
		</view>
		<view>
			<cropper ref="cropper" :aspectRatio="1" :imagePath="img" @complete="complete" @cancel="cancel"></cropper>
		</view>
		<view id="bottomType">
			<view class="funTypeContainer" v-for="(fun, id) in functionType" :key="id">
				<view class="funTypeBoxWrap">
					<view class="funTypeBox" :style="[{backgroundImage: fun.img}]" @click="funChoose(fun.name)"></view>
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
					<input-switch :checked="pencilData.color" @click="pencilData.color = !pencilData.color"/>
					<!--					<switch :checked="pencilData.color" @click="pencilData.color = !pencilData.color" style="transform:scale(0.7)"/>-->
				</view>
				<input-slider name="线条粗细" :value="pencilData.gammaS" :change="(e) => this.pencilData.gammaS = e.detail.value" :show_value="true" step="1" min="1" max="50"/>
				<input-slider name="颜色深浅" :value="pencilData.gammaI" :change="(e) => this.pencilData.gammaI = e.detail.value" :show_value="true" step="1" min="1" max="50"/>
				<input-slider name="图片质量" :value="pencilData.quality" :change="(e) => this.pencilData.gammaS = e.detail.value" :show_value="true" step="1" min="1" max="3"/>
				<view class="submitButton" @click="pencilDataSubmit()">生成</view>
			</view>
		</uni-popup>
		<uni-popup ref="oilPopup" type="bottom">
			<view class="popup">
				<view class="closeBox" @click="$refs.oilPopup.close()">×</view>
				<view class="functionTitle">油墨画</view>
				<view class="inpputBox">
					<view class="inputTitle" style="width: 400rpx">{{oilpaintData.model?'冬季转夏季':'夏季转冬季'}}模式</view>
					<input-switch :checked="oilpaintData.model" @click="oilpaintData.model = !oilpaintData.model" />
				</view>
				<view class="submitButton" @click="oilpaintDataSubmit()">提交</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import Cropper from '../../components/yankai-cropper/cropper.vue';
	// import md5 from 'md5.js'
	import {
		pathToBase64,
		base64ToPath
	} from '../../js_sdk/gsq-image-tools/image-tools/index.js'
	import InputSlider from "../../components/inputSlider";
	import InputSwitch from "../../components/inputSwitch";
	import UniPopup from "../../components/uni-popup/uni-popup";
	export default {
		data() {
			return {
				statusBarHeight: 0,
				windowHeight: 0,
				functionType: [
					// {
					// 	fun: '原  图',
					// 	img: ''
					// },
					{
						name: "pencil",
						fun: '铅笔画',
						img: ''
					},
					{
						name: "oil",
						fun: '油墨画',
						img: ''
					},
					{
						name: "anime",
						fun: '动漫风',
						img: ''
					},
					{
						name: "cartoon",
						fun: '卡通头像',
						img: ''
					},
					// {
					// 	fun: '艺术画',
					// 	img: ''
					// },
					// {
					// 	fun: '动态图',
					// 	img: ''
					// }
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
				uni.navigateBack({});
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
				if(this.img === '') {
					uni.showToast({
						title: "请选择图片",
						icon: "none",
						mask: true
					});
					return;
				}
				// this.pencilData.flag = false;
				// this.oilpaintData.flag = false;
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
						this.animeFunction();
						break;
					case 'cartoon':
						this.cartoonFunction();
						break;
					default:
						return;
				}
			},
			pencilDataSubmit() {
					uni.showLoading({
						title: '绘画中……',
						mask: true
					});
					pathToBase64(this.img)
						.then(base64 => {
							uni.request({
								url: this.serverUrl + 'pencil',
								method: 'POST',
								header: {
									'content-type': 'application/x-www-form-urlencoded'
								},
								data: {
									'img': base64.split(',')[1],
									'color': (this.pencilData.color ? 'True' : 'False'),
									's': (this.pencilData.gammaS / 10).toFixed(1),
									'i': (this.pencilData.gammaI / 10).toFixed(1),
									'q': this.pencilData.quality
								},
								success: (res) => {
									if (res.statusCode == 200) {
										base64ToPath("data:image/png;base64," + res.data)
											.then(path => {
												uni.hideLoading();
												uni.showToast({
													title: '画出来了！',
													mask: true
												});
												this.img = path;
												this.pencilData.flag = false;
											});
									} else {
										uni.hideLoading();
										uni.showToast({
											title: '没有画出来！',
											icon: 'none',
											mask: true
										})
									}
								},
								fail: (res) => {
									uni.showToast({
										title: '网络异常！',
										icon: 'none',
										mask: true
									})
									uni.hideLoading()
								}
							});
						})
						.catch(error => {
							uni.hideLoading();
						})
			},
			animeFunction() {

					uni.showLoading({
						title: '绘画中……',
						mask: true
					});
					pathToBase64(this.img)
						.then(base64 => {
							uni.request({
								url: this.serverUrl + 'anime',
								method: 'POST',
								header: {
									'content-type': 'application/x-www-form-urlencoded'
								},
								data: {
									'img': base64.split(',')[1]
								},
								success: (res) => {
									if (res.statusCode == 200) {
										base64ToPath("data:image/png;base64," + res.data)
											.then(path => {
												uni.hideLoading();
												uni.showToast({
													title: '画出来了！',
													mask: true
												});
												this.img = path;
											});
									} else {
										uni.hideLoading();
										uni.showToast({
											title: '没有画出来！',
											icon: 'none',
											mask: true
										})
									}
								},
								fail: (res) => {
									uni.showToast({
										title: '网络异常！',
										icon: 'none',
										mask: true
									})
									uni.hideLoading()
								}
							});
						})
						.catch(error => {
							uni.hideLoading();
						})
			},
			oilpaintFunction() {
				this.oilpaintData.flag = !this.oilpaintData.flag;
			},
			oilpaintDataSubmit() {
					uni.showLoading({
						title: '绘画中……',
						mask: true
					});
					pathToBase64(this.img)
						.then(base64 => {
							uni.request({
								url: this.serverUrl + 'oilpaint',
								method: 'POST',
								header: {
									'content-type': 'application/x-www-form-urlencoded'
								},
								data: {
									'img': base64.split(',')[1],
									'model': (this.oilpaintData.model ? 0 : 1)
								},
								success: (res) => {
									if (res.statusCode == 200) {
										base64ToPath("data:image/png;base64," + res.data)
											.then(path => {
												uni.hideLoading();
												uni.showToast({
													title: '画出来了！',
													mask: true
												});
												this.img = path;
												this.oilpaintData.flag = false;
											});
									} else {
										uni.hideLoading();
										uni.showToast({
											title: '没有画出来！',
											icon: 'none',
											mask: true
										})
									}
								},
								fail: (res) => {
									uni.showToast({
										title: '网络异常！',
										icon: 'none',
										mask: true
									})
									uni.hideLoading()
								}
							});
						})
						.catch(error => {
							uni.hideLoading();
						})
			},
			cartoonFunction() {

					uni.showLoading({
						title: '绘画中……',
						mask: true
					});
					pathToBase64(this.img)
						.then(base64 => {
							uni.request({
								url: this.serverUrl + 'cartoon',
								method: 'POST',
								header: {
									'content-type': 'application/x-www-form-urlencoded'
								},
								data: {
									'img': base64.split(',')[1]
								},
								success: (res) => {
									if (res.statusCode == 200 && res.data.status == 0) {
										base64ToPath("data:image/png;base64," + res.data.img)
											.then(path => {
												uni.hideLoading();
												uni.showToast({
													title: '画出来了！',
													mask: true
												});
												this.img = path;
											});
									} else if (res.statusCode == 200 && res.data.status == 1) {
										uni.hideLoading();
										uni.showToast({
											title: '没有找到人脸哦，请换张图片！',
											icon: 'none',
											mask: true
										})
									} else {
										uni.hideLoading();
										uni.showToast({
											title: '没有画出来！',
											icon: 'none',
											mask: true
										})
									}
								},
								fail: (res) => {
									uni.showToast({
										title: '网络异常！',
										icon: 'none',
										mask: true
									})
									uni.hideLoading()
								}
							});
						})
						.catch(error => {
							uni.hideLoading();
						})
				}
		},
		components: {
			UniPopup,
			InputSwitch,
			InputSlider,
			Cropper
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		/* height: 1000rpx; */
		background-color: #f3f3f3;
		position: relative;
		display: flex;
		flex-direction: column;
	}
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
	#boxBack {
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
	#image {
		width: 670rpx;
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
		border-radius: 22rpx;
		border: 1px solid white;
		box-shadow: 0 0 8rpx #888;
		margin-bottom: 10rpx;
	}
	.funTypeBox {
		width: 116rpx;
		height: 116rpx;
		background-color: #67C23A;
		border-radius: 20rpx;
		flex-shrink: 0;
		position: relative;
		overflow: hidden;
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

	.submitButton {
		/*width: 90%;*/
		height: 80rpx;
		margin: 50rpx auto;
		background-color: #7076fe;
		color: #FFFFFF;
		font-size: 40rpx;
		border-radius: 40rpx;
		line-height: 80rpx;
		text-align: center;
	}
	.topbar {
		width: 100%;
		height: 100rpx;
		background-color: #FFFFFF;
		border-bottom: #e5e5e5 2rpx solid;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/*position: fixed;*/
		z-index: 10;
		font-size: 30rpx;
		&-reset {
			margin-right: 20rpx;
			color: #6f75fe;
		 }
		&-back {
			background-image: url("../../static/back.png");
			height: 45rpx;
			width: 45rpx;
			background-size: cover;
			margin-left: 20rpx;
		}
	}

	.popup {
		background-color: #fff;
		padding: 10%;
	}

</style>
