<template>
	<view class="container" :style="[{ height: windowHeight - statusBarHeight + 'px' }]" @click="showADD=false">
		<view class="statusBar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view id="topTarbar" :style="[{ marginTop: statusBarHeight + 'px' }]">
			风格处理
			<view id="menu" @click.stop="changeDrawer">
				<view class="menuButton" style="top: 0;left: 0;"></view>
				<view class="menuButton" style="top: 0;right: 0;"></view>
				<view class="menuButton" style="bottom: 0;left: 0;"></view>
				<view class="menuButton" style="bottom: 0;right: 0;"></view>
			</view>
		</view>

		<uni-drawer ref="menuDrawer" :mask="true" :maskClick="true" mode="left" :width="220" :visible="true">
			<view style="padding:30rpx;">

			</view>
		</uni-drawer>

		<view id="boxBack">
			<view id="chooseBox" @click.stop="showADD = !showADD">
				<image id="image" :src="img" mode="aspectFill"></image>
				<view @click.stop="addImg" v-if="showADD" id="addMask">
					<view id="addIcon">+</view>
					<view v-if="false" id="changeIcon"></view>
				</view>
			</view>
		</view>
		<view>
			<cropper ref="cropper" :aspectRatio="1" :imagePath="img" @complete="complete" @cancel="cancel"></cropper>
		</view>
		<view id="bottomType">
			<view v-for="(fun, id) in functionType" :key="id" class="funTypeBox" @click="funChoose(id)">
				<view class="funTypeName">{{ fun.fun }}</view>
			</view>
			<view style="width: 30upx;height: 100%;flex-shrink: 0;"></view>
		</view>
		<!-- <view style="width: 100%;height: 9000upx;"></view> -->
		<uni-fab style="--window-bottom: 90px;" @fabClick="" :pattern="fab_moreFun.pattern" :content="fab_moreFun.content"
		 :horizontal="fab_moreFun.horizontal" :vertical="fab_moreFun.vertical" :direction="fab_moreFun.direction"></uni-fab>

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
				fab_moreFun: {
					pattern: {
						color: "#3c3e49",
						selectedColor: "#007AFF",
						backgroundColor: "#ffffff",
						buttonColor: "#3c3e49"
					},
					horizontal: "right",
					vertical: "bottom",
					direction: "horizontal",
					popMenu: true,
					content: [{
							iconPath: "",
							selectedIconPath: "",
							text: "分享",
							active: false
						},
						{
							iconPath: "",
							selectedIconPath: "",
							text: "保存",
							active: false
						},
						{
							iconPath: "",
							selectedIconPath: "",
							text: "刷新",
							active: false
						},
						{
							iconPath: "",
							selectedIconPath: "",
							text: "清空",
							active: false
						}
					]
				},
				showADD: false,
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
			changeDrawer() {
				this.$refs.menuDrawer.open();
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

<style>
	.container {
		width: 100%;
		/* height: 1000upx; */
		background-color: #f3f3f3;
		position: relative;
	}
	.statusBar {
		background-image: linear-gradient(to right, #ededed, #6d89c3);
		width: 750px;
		position: fixed;
		top: 0;
		z-index: 999;
	}
	#topTarbar {
		width: 100%;
		height: 100upx;
		background-color: #FFFFFF;
		border-bottom: #e5e5e5 2upx solid;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: fixed;
		z-index: 10;
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
		padding: 200upx 0 0 0;
	}
	#chooseBox {
		width: 90%;
		height: 900upx;
		background-color: #ffffff;
		border-radius: 40upx;
		margin: 0 auto;
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
		background-color: rgba(0,0,0,0.3);
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
	}
	#addIcon {
		width: 150upx;
		height: 150upx;
		border-radius: 100%;
		border: #FFFFFF 20upx solid;
		margin: 50% auto 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #FFFFFF;
		font-size: 100upx;
		font-weight: 900;
	}
	#bottomType {
		width: 100%;
		height: 200upx;
		padding-bottom: 10px;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		overflow-x: scroll;
		position: fixed;
		bottom: -10px;
		z-index: 10;
	}
	.funTypeBox {
		width: 140upx;
		height: 140upx;
		margin: 30upx 0 0 30upx;
		background-color: #67C23A;
		border-radius: 20upx;
		flex-shrink: 0;
		position: relative;
		overflow: hidden;
	}
	.funTypeName {
		width: 100%;
		height: 60upx;
		position: absolute;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
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
</style>
