<template>
	<view class="container" :style="[{ height: windowHeight - statusBarHeight + 'px' }]" @click="showADD=false">
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
					<view class="funTypeBox" @click="funChoose(id)"></view>
				</view>
				<view class="funTypeName">{{ fun.fun }}</view>
			</view>
			<view style="width: 30upx;height: 100%;flex-shrink: 0;"></view>
		</view>
		<!-- <view style="width: 100%;height: 9000upx;"></view> -->

		<view class="functionBox" v-if="pencilData.flag" @click="pencilData.flag = false">
			<view class="functionCard" @click.stop>
				<view class="closeBox" @click="pencilData.flag = false">×</view>
				<view class="functionTitle">铅笔画</view>
				<view class="inpputBox">
					<view class="inputTitle">{{pencilData.color?'彩色':'黑白'}}模式</view>
					<switch :checked="pencilData.color" @click="pencilData.color = !pencilData.color" />
				</view>
				<view class="inpputBox">
					<view class="inputTitle">线条粗细</view>
					<slider class="inputSlider" :value="pencilData.gammaS" @change="pencilDataGammaSChange" :show-value="true" step="1"
					 min="1" max="50" />
				</view>
				<view class="inpputBox">
					<view class="inputTitle">颜色深浅</view>
					<slider class="inputSlider" :value="pencilData.gammaI" @change="pencilDataGammaIChange" :show-value="true" step="1"
					 min="1" max="50" />
				</view>
				<view class="inpputBox">
					<view class="inputTitle">图片质量</view>
					<slider class="inputSlider" :value="pencilData.quality" @change="pencilDataQuality" :show-value="true" step="1"
					 min="1" max="3" />
				</view>
				<view class="submitButton" @click="pencilDataSubmit()">提交</view>
			</view>
		</view>

		<view class="functionBox" v-if="oilpaintData.flag" @click="oilpaintData.flag = false">
			<view class="functionCard" @click.stop style="height: 30%;">
				<view class="closeBox" @click="oilpaintData.flag = false">×</view>
				<view class="functionTitle">油墨画</view>
				<view class="inpputBox">
					<view class="inputTitle" style="width: 400upx">{{oilpaintData.model?'冬季转夏季':'夏季转冬季'}}模式</view>
					<switch :checked="oilpaintData.model" @click="oilpaintData.model = !oilpaintData.model" />
				</view>
				<view class="submitButton" @click="oilpaintDataSubmit()">提交</view>
			</view>
		</view>

	</view>
</template>

<script>
	import Cropper from '../../components/yankai-cropper/cropper.vue';
	// import md5 from 'md5.js'
	import {
		pathToBase64,
		base64ToPath
	} from '../../js_sdk/gsq-image-tools/image-tools/index.js'
	export default {
		data() {
			return {
				statusBarHeight: 0,
				windowHeight: 0,
				functionType: [{
						fun: '原  图',
						img: ''
					},
					{
						fun: '铅笔画',
						img: ''
					},
					{
						fun: '油墨画',
						img: ''
					},
					{
						fun: '动漫风',
						img: ''
					},
					{
						fun: '卡通头像',
						img: ''
					},
					{
						fun: '艺术画',
						img: ''
					},
					{
						fun: '动态图',
						img: ''
					}
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
				this.imgCopy = "data:image/jpeg;base64";
				this.showADD = true;
			},
			funChoose(type) {
				this.pencilData.flag = false;
				this.oilpaintData.flag = false;
				if (type == 0) {
					this.img = this.imgCopy;
				} else if (type == 1) {
					this.pencilFunction();
				} else if (type == 2) {
					this.oilpaintFunction();
				} else if (type == 3) {
					this.animeFunction();
				} else if (type == 4) {
					this.cartoonFunction();
				}
			},
			pencilFunction() {
				this.pencilData.flag = !this.pencilData.flag;
			},
			pencilDataGammaSChange(e) {
				this.pencilData.gammaS = e.detail.value;
			},
			pencilDataGammaIChange(e) {
				this.pencilData.gammaI = e.detail.value;
			},
			pencilDataQuality(e) {
				this.pencilData.quality = e.detail.value;
			},
			pencilDataSubmit() {
				if (this.img == "") {
					uni.showToast({
						title: "请选择图片",
						icon: "none",
						mask: true
					})
				} else {
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
				}
			},
			animeFunction() {
				if (this.img == "") {
					uni.showToast({
						title: "请选择图片",
						icon: "none",
						mask: true
					})
				} else {
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
				}
			},
			oilpaintFunction() {
				this.oilpaintData.flag = !this.oilpaintData.flag;
			},
			oilpaintDataSubmit() {
				if (this.img == "") {
					uni.showToast({
						title: "请选择图片",
						icon: "none",
						mask: true
					})
				} else {
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
				}
			},
			cartoonFunction() {
				if (this.img == "") {
					uni.showToast({
						title: "请选择图片",
						icon: "none",
						mask: true
					})
				} else {
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
			}
		},
		components: {
			Cropper
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		/* height: 1000upx; */
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
		width: 65upx;
		height: 65upx;
		/* background-color: #007AFF; */
		position: absolute;
		top: 50%;
		right: 20upx;
		transform: translateY(-50%);
	}
	.menuButton {
		width: 25upx;
		height: 25upx;
		border: #CCCCCC 2upx solid;
		flex-shrink: 0;
		position: absolute;
	}
	#boxBack {
		width: 100%;
		background-color: inherit;
		flex-grow: 1;
		display: flex;
		/*padding: 200upx 0 0 0;*/
	}
	#chooseBox {
		width: 100%;
		/*height: 900upx;*/
		background-color: #ffffff;
		/*border-radius: 40upx;*/
		/*margin: 0 auto;*/
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		position: relative;
	}
	#image {
		width: 670upx;
		height: 670upx;
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
		width: 100upx;
		height: 100upx;
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
		height: 240upx;
		/*padding-bottom: 10px;*/
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		overflow-x: scroll;
		z-index: 10;
	}
	.funTypeContainer {
		margin-left: 30rpx;
	}
	.funTypeBoxWrap {
		border-radius: 22upx;
		border: 1px solid white;
		box-shadow: 0 0 8rpx #888;
		margin-bottom: 10rpx;
	}
	.funTypeBox {
		width: 110upx;
		height: 110upx;
		background-color: #67C23A;
		border-radius: 20upx;
		flex-shrink: 0;
		position: relative;
		overflow: hidden;
	}
	.funTypeName {
		/*width: 100%;*/
		height: 60upx;
		/*position: absolute;*/
		/*bottom: 0;*/
		/*background-color: rgba(0, 0, 0, 0.5);*/
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		font-size: 26upx;
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
		width: 90%;
		height: 45%;
		padding: 5%;
		position: absolute;
		bottom: 200upx;
		left: 0;
		border-top-left-radius: 40upx;
		border-top-right-radius: 40upx;
		background-color: #FFFFFF;
		overflow: auto;
	}

	.closeBox {
		position: absolute;
		top: 20upx;
		right: 50upx;
		font-size: 50upx;
		font-weight: 900;
	}

	.functionTitle {
		width: 100%;
		height: 80upx;
		text-align: center;
		font-size: 40upx;
		font-weight: 900;
		line-height: 80upx;
	}

	.inpputBox {
		width: 100%;
		height: 120upx;
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
		width: 90%;
		height: 80upx;
		margin: 50upx auto;
		background-color: #4CD964;
		color: #FFFFFF;
		font-size: 40upx;
		border-radius: 40upx;
		line-height: 80upx;
		text-align: center;
	}
	.topbar {
		width: 100%;
		height: 100upx;
		background-color: #FFFFFF;
		border-bottom: #e5e5e5 2upx solid;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		/*position: fixed;*/
		z-index: 10;
		font-size: 30upx;
		&-reset {
			margin-right: 20rpx;
			color: #6f75fe;
		 }
		&-back {
			background-image: url("../../static/back.png");
			height: 45upx;
			width: 45upx;
			background-size: cover;
			margin-left: 20rpx;
		}
	}

</style>
