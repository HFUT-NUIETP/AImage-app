<template>
	<view class="cropper" id="cropper" :class="{ show: show }">
		<view class="cropper-head">
			<view class="cropper-btn cropper-reset" @tap="resetCrop">重做</view>
		</view>
		<view class="cropper-body">
			<image id="image" class="cropper-image" :src="imagePath" mode="aspectFit"></image>
			<view :style="{ width: stageWidth + 'px', height: stageHeight + 'px', left: stageLeft + 'px', top: stageTop + 'px' }"
			 class="cropper-stage" @touchstart.stop.prevent="touchStart" @touchmove.stop.prevent="touchMove">
				<view id="box" class="cropper-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px', left: boxLeft + 'px', top: boxTop + 'px' }">
					<view id="lt" class="lt"></view>
					<view id="lb" class="lb"></view>
					<view id="rt" class="rt"></view>
					<view id="rb" class="rb"></view>

					<view class="line-v" style="left:33.3%;"></view>
					<view class="line-v" style="left:66.6%;"></view>
					<view class="line-h" style="top:33.3%;"></view>
					<view class="line-h" style="top:66.6%;"></view>
				</view>
			</view>

			<canvas class="cropper-canvas" canvas-id="canvas" :style="{ height: canvasHeight + 'px', width: canvasWidth + 'px' }"></canvas>
		</view>
		<view class="cropper-bottom">
			<view class="cropper-btn cropper-cancel" @tap="cancelCrop">取消</view>
			<view class="cropper-btn cropper-ok" @tap="completeCrop">裁剪</view>
		</view>
	</view>
</template>
<script>
	//无须渲染的变量

	let layoutLeft = 0;
	let layoutTop = 0;
	let layoutWidth = 0;
	let layoutHeight = 0;

	let stageLeft = 0;
	let stageTop = 0;
	let stageWidth = 0;
	let stageHeight = 0;

	let imageWidth = 0;
	let imageHeight = 0;

	let pixelRatio = 1; //todo设备像素密度//暂不使用//

	let imageStageRatio = 1; //图片实际尺寸与剪裁舞台大小的比值，用于尺寸换算。

	let minBoxWidth = 0;
	let minBoxHeight = 0;

	let touchStartBoxLeft = 0;
	let touchStartBoxTop = 0;
	let touchStartBoxWidth = 0;
	let touchStartBoxHeight = 0;

	let touchStartX = 0;
	let touchStartY = 0;

	export default {
		name: 'cropper',
		props: {
			quality: {
				type: Number,
				default: 0.5
			},

			//目标文件的类型。默认值为jpg，jpg：输出jpg格式图片；png：输出png格式图片
			outputFileType: {
				type: String,
				default: 'jpg'
			},
			//目标图片的宽高比，默认null，即不限制剪裁宽高比。aspectRatio需大于0
			aspectRatio: {
				type: [Number, null],
				default: 1
			},
			//最小剪裁尺寸与原图尺寸的比率，默认0.15，即宽度最小剪裁到原图的0.15宽。
			minBoxWidthRatio: {
				type: Number,
				default: 0.15
			},
			//同minBoxWidthRatio，当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到。
			minBoxHeightRatio: {
				type: Number,
				default: 0.15
			},
			//剪裁框初始大小比率。默认值0.8，即剪裁框默认宽度为图片宽度的0.8倍。
			initialBoxWidthRatio: {
				type: Number,
				default: 0.8
			},
			//同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
			initialBoxHeightRatio: {
				type: Number,
				default: 0.8
			}
		},
		data() {
			return {
				//data
				stageLeft: 0,
				stageTop: 0,
				stageWidth: 0,
				stageHeight: 0,

				boxWidth: 0,
				boxHeight: 0,
				boxLeft: 0,
				boxTop: 0,

				canvasWidth: 0,
				canvasHeight: 0,
				show: false,
				imagePath: ''
			};
		},
		mounted() {
			// setTimeout(() => {
			// 	this.init();
			// }, 150);
		},
		methods: {
			resetCrop() {
				this.$emit('reset');
				this.init(this.imagePath);
			},
			cancelCrop() {
				this.$emit('cancel');
			},
			completeCrop() {
			  uni.showLoading({
          title: "裁剪中"
        })
				let imagePath = this.imagePath;
				let canvasContext = wx.createCanvasContext('canvas', this);

				let boxLeft = this.boxLeft;
				let boxTop = this.boxTop;
				let boxWidth = this.boxWidth;
				let boxHeight = this.boxHeight;

				let sx = Math.ceil(boxLeft * imageStageRatio);
				let sy = Math.ceil(boxTop * imageStageRatio);

				let sWidth = Math.ceil(boxWidth * imageStageRatio);
				let sHeight = Math.ceil(boxHeight * imageStageRatio);
				let dx = 0;
				let dy = 0;

				let dWidth = Math.ceil(sWidth * pixelRatio);
				let dHeight = Math.ceil(sHeight * pixelRatio);
				const param = {
					x: sx,
					y: sy,
					width: dWidth,
					height: dHeight,
					rotate: 0,
					scaleX: 1,
					scaleY: 1
				};

				canvasContext.drawImage(imagePath, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
				canvasContext.draw(false, () => {
					wx.canvasToTempFilePath({
							x: dx,
							y: dy,
							width: dWidth,
							height: dHeight,
							destWidth: sWidth,
							destHeight: sHeight,
							canvasId: 'canvas',
							fileType: this.outputFileType,
							quality: this.quality,
							success: res => {
								this.$emit('complete', {
									param,
									path: res.tempFilePath,
									source: this.imagePath
								});
							},
            complete: () => uni.hideLoading()
						},
						this
					);
				});
			},
			touchMove(e) {
				let targetId = e.target.id;
				let touch = e.touches[0];
				let pageX = touch.pageX;
				let pageY = touch.pageY;

				let offsetX = pageX - touchStartX;
				let offsetY = pageY - touchStartY;

				if (targetId == 'box') {
					let newBoxLeft = touchStartBoxLeft + offsetX;
					let newBoxTop = touchStartBoxTop + offsetY;

					if (newBoxLeft < 0) {
						newBoxLeft = 0;
					}
					if (newBoxTop < 0) {
						newBoxTop = 0;
					}
					if (newBoxLeft + touchStartBoxWidth > stageWidth) {
						newBoxLeft = stageWidth - touchStartBoxWidth;
					}
					if (newBoxTop + touchStartBoxHeight > stageHeight) {
						newBoxTop = stageHeight - touchStartBoxHeight;
					}
					this.boxLeft = newBoxLeft;
					this.boxTop = newBoxTop;
				} else if (targetId == 'lt') {
					if (this.aspectRatio) {
						offsetY = offsetX / this.aspectRatio;
					}

					let newBoxLeft = touchStartBoxLeft + offsetX;
					let newBoxTop = touchStartBoxTop + offsetY;

					if (newBoxLeft < 0) {
						newBoxLeft = 0;
					}
					if (newBoxTop < 0) {
						newBoxTop = 0;
					}

					if (touchStartBoxLeft + touchStartBoxWidth - newBoxLeft < minBoxWidth) {
						newBoxLeft = touchStartBoxLeft + touchStartBoxWidth - minBoxWidth;
					}
					if (touchStartBoxTop + touchStartBoxHeight - newBoxTop < minBoxHeight) {
						newBoxTop = touchStartBoxTop + touchStartBoxHeight - minBoxHeight;
					}

					let newBoxWidth = touchStartBoxWidth - (newBoxLeft - touchStartBoxLeft);
					let newBoxHeight = touchStartBoxHeight - (newBoxTop - touchStartBoxTop);

					//约束比例
					if (newBoxTop == 0 && this.aspectRatio && newBoxLeft != 0) {
						newBoxWidth = newBoxHeight * this.aspectRatio;
						newBoxLeft = touchStartBoxWidth - newBoxWidth + touchStartBoxLeft;
					}
					if (newBoxLeft == 0 && this.aspectRatio) {
						newBoxHeight = newBoxWidth / this.aspectRatio;
						newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
					}

					if (newBoxWidth == minBoxWidth && this.aspectRatio) {
						newBoxHeight = newBoxWidth / this.aspectRatio;
						newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
					}
					this.boxTop = newBoxTop;
					this.boxLeft = newBoxLeft;
					this.boxWidth = newBoxWidth;
					this.boxHeight = newBoxHeight;
				} else if (targetId == 'rt') {
					if (this.aspectRatio) {
						offsetY = -offsetX / this.aspectRatio;
					}

					let newBoxWidth = touchStartBoxWidth + offsetX;
					if (newBoxWidth < minBoxWidth) {
						newBoxWidth = minBoxWidth;
					}
					if (touchStartBoxLeft + newBoxWidth > stageWidth) {
						newBoxWidth = stageWidth - touchStartBoxLeft;
					}

					let newBoxTop = touchStartBoxTop + offsetY;

					if (newBoxTop < 0) {
						newBoxTop = 0;
					}

					if (touchStartBoxTop + touchStartBoxHeight - newBoxTop < minBoxHeight) {
						newBoxTop = touchStartBoxTop + touchStartBoxHeight - minBoxHeight;
					}
					let newBoxHeight = touchStartBoxHeight - (newBoxTop - touchStartBoxTop);

					//约束比例
					if (newBoxTop == 0 && this.aspectRatio && newBoxWidth != stageWidth - touchStartBoxLeft) {
						newBoxWidth = newBoxHeight * this.aspectRatio;
					}

					if (newBoxWidth == stageWidth - touchStartBoxLeft && this.aspectRatio) {
						newBoxHeight = newBoxWidth / this.aspectRatio;
						newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
					}

					if (newBoxWidth == minBoxWidth && this.aspectRatio) {
						newBoxHeight = newBoxWidth / this.aspectRatio;
						newBoxTop = touchStartBoxHeight - newBoxHeight + touchStartBoxTop;
					}

					this.boxTop = newBoxTop;
					this.boxHeight = newBoxHeight;
					this.boxWidth = newBoxWidth;
				} else if (targetId == 'lb') {
					if (this.aspectRatio) {
						offsetY = -offsetX / this.aspectRatio;
					}
					let newBoxLeft = touchStartBoxLeft + offsetX;

					if (newBoxLeft < 0) {
						newBoxLeft = 0;
					}
					if (touchStartBoxLeft + touchStartBoxWidth - newBoxLeft < minBoxWidth) {
						newBoxLeft = touchStartBoxLeft + touchStartBoxWidth - minBoxWidth;
					}

					let newBoxWidth = touchStartBoxWidth - (newBoxLeft - touchStartBoxLeft);

					let newBoxHeight = touchStartBoxHeight + offsetY;
					if (newBoxHeight < minBoxHeight) {
						newBoxHeight = minBoxHeight;
					}
					if (touchStartBoxTop + newBoxHeight > stageHeight) {
						newBoxHeight = stageHeight - touchStartBoxTop;
					}

					//约束比例
					if (newBoxHeight == stageHeight - touchStartBoxTop && this.aspectRatio && newBoxLeft != 0) {
						newBoxWidth = newBoxHeight * this.aspectRatio;
						newBoxLeft = touchStartBoxWidth - newBoxWidth + touchStartBoxLeft;
					}
					if (newBoxLeft == 0 && this.aspectRatio) {
						newBoxHeight = newBoxWidth / this.aspectRatio;
					}

					if (newBoxWidth == minBoxWidth && this.aspectRatio) {
						newBoxHeight = newBoxWidth / this.aspectRatio;
					}

					this.boxLeft = newBoxLeft;
					this.boxWidth = newBoxWidth;
					this.boxHeight = newBoxHeight;
				} else if (targetId == 'rb') {
					if (this.aspectRatio) {
						offsetY = offsetX / this.aspectRatio;
					}
					let newBoxWidth = touchStartBoxWidth + offsetX;
					if (newBoxWidth < minBoxWidth) {
						newBoxWidth = minBoxWidth;
					}
					if (touchStartBoxLeft + newBoxWidth > stageWidth) {
						newBoxWidth = stageWidth - touchStartBoxLeft;
					}

					let newBoxHeight = touchStartBoxHeight + offsetY;
					if (newBoxHeight < minBoxHeight) {
						newBoxHeight = minBoxHeight;
					}
					if (touchStartBoxTop + newBoxHeight > stageHeight) {
						newBoxHeight = stageHeight - touchStartBoxTop;
					}

					//约束比例
					if (newBoxHeight == stageHeight - touchStartBoxTop && this.aspectRatio && newBoxWidth != stageWidth -
						touchStartBoxLeft) {
						newBoxWidth = newBoxHeight * this.aspectRatio;
					}

					if (newBoxWidth == stageWidth - touchStartBoxLeft && this.aspectRatio) {
						newBoxHeight = newBoxWidth / this.aspectRatio;
					}

					if (newBoxWidth == minBoxWidth && this.aspectRatio) {
						newBoxHeight = newBoxWidth / this.aspectRatio;
					}

					this.boxWidth = newBoxWidth;
					this.boxHeight = newBoxHeight;
				}
			},
			touchStart(e) {
				let touch = e.touches[0];
				let pageX = touch.pageX;
				let pageY = touch.pageY;

				touchStartX = pageX;
				touchStartY = pageY;

				touchStartBoxLeft = this.boxLeft;
				touchStartBoxTop = this.boxTop;
				touchStartBoxWidth = this.boxWidth;
				touchStartBoxHeight = this.boxHeight;
			},
			close(force = true) {
				this.show = false;
				if (force) {
					this.imagePath = ''
				}
			},
			init(src) {
				if (!src) {
					return '';
				}
				this.imagePath = src;
				uni.showLoading({
					mask: true,
					title: '载入图片中'
				});
				uni.createSelectorQuery()
					.in(this)
					.select('.cropper-body')
					.boundingClientRect(rect => {
						console.log(rect)
						layoutLeft = rect.left;
						layoutTop = rect.top;
						layoutWidth = rect.width;
						layoutHeight = rect.height;

						wx.getImageInfo({
							src: this.imagePath,
							success: imageInfo => {
								imageWidth = imageInfo.width;
								imageHeight = imageInfo.height;
								let imageWH = imageWidth / imageHeight;
								let layoutWH = layoutWidth / layoutHeight;
								if (imageWH >= layoutWH) {
									stageWidth = layoutWidth;
									stageHeight = stageWidth / imageWH;
									imageStageRatio = imageHeight / stageHeight;
								} else {
									stageHeight = layoutHeight;
									stageWidth = layoutHeight * imageWH;
									imageStageRatio = imageWidth / stageWidth;
								}
								stageLeft = (layoutWidth - stageWidth) / 2;
								stageTop = (layoutHeight - stageHeight) / 2;

								minBoxWidth = stageWidth * this.minBoxWidthRatio;
								minBoxHeight = stageHeight * this.minBoxHeightRatio;

								let boxWidth = stageWidth * this.initialBoxWidthRatio;
								let boxHeight = stageHeight * this.initialBoxHeightRatio;

								if (this.aspectRatio) {
									boxHeight = boxWidth / this.aspectRatio;
								}
								if (boxHeight > stageHeight) {
									boxHeight = stageHeight;
									boxWidth = boxHeight * this.aspectRatio;
								}

								let boxLeft = (stageWidth - boxWidth) / 2;
								let boxTop = (stageHeight - boxHeight) / 2;

								this.canvasWidth = imageWidth * pixelRatio;
								this.canvasHeight = imageHeight * pixelRatio;

								this.stageLeft = stageLeft;
								this.stageTop = stageTop;
								this.stageWidth = stageWidth;
								this.stageHeight = stageHeight;

								this.boxWidth = boxWidth;
								this.boxHeight = boxHeight;
								this.boxLeft = boxLeft;
								this.boxTop = boxTop;
								setTimeout(() => {
									uni.hideLoading();
									this.show = true;
								}, 100);
							},
							fail: () => {
								uni.showToast({
									icon: 'none',
									title: '图片载入失败'
								});
							},
						});
					})
					.exec();
			}
		}
	};
</script>

<style lang="scss">
	#image {
		width: 100%;
		height: 100%;
	}

	.cropper {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: #000;
		z-index: -1000000;
		opacity: 0;

		&.show {
			z-index: 999;
			opacity: 1;
		}

		.cropper-head {
			position: fixed;
			top: 0;
			width: 750rpx;
			z-index: 6;
			height: calc(var(--status-bar-height) + 88rpx);
			padding-top: var(--status-bar-height);
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}

		.cropper-btn {
			height: 64rpx;
			margin: 0 20rpx;
			padding: 0 30rpx;
			line-height: 64rpx;
			color: #fff;
			font-size: 26rpx;
		}

		.cropper-body {
			margin: calc(var(--status-bar-height) + 88rpx) 30rpx 0 30rpx;
			height: calc(100vh - var(--status-bar-height) - 88rpx - 100rpx);
			position: relative;
		}

		.cropper-bottom {
			height: calc(var(--safe-area-inset-bottom) + 100rpx);
			padding-top: var(--safe-area-inset-bottom);
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: fixed;
			z-index: 6;
			width: 750rpx;
			bottom: 0;
		}

		.cropper-ok {
			color: #39f;
		}

		.cropper-image {
			position: absolute;
			width: 100%;
			height: 100%;
		}

		.cropper-stage {
			position: absolute;

			.cropper-box {
				position: absolute;
				border: 4rpx solid #ddd;
				box-sizing: border-box;
				box-shadow: 0 0 0 2000rpx rgba(0, 0, 0, 0.5);

				.lt {
					position: absolute;
					height: 48rpx;
					width: 48rpx;
					left: -6rpx;
					top: -6rpx;
					border-left: 12rpx solid #ffffff;
					border-top: 12rpx solid #ffffff;
				}

				.lb {
					position: absolute;
					height: 48rpx;
					width: 48rpx;
					left: -6rpx;
					bottom: -6rpx;
					border-left: 12rpx solid #ffffff;
					border-bottom: 12rpx solid #ffffff;
				}

				.rt {
					position: absolute;
					height: 48rpx;
					width: 48rpx;
					right: -6rpx;
					top: -6rpx;
					border-right: 12rpx solid #ffffff;
					border-top: 12rpx solid #ffffff;
				}

				.rb {
					position: absolute;
					height: 48rpx;
					width: 48rpx;
					right: -6rpx;
					bottom: -6rpx;
					border-right: 12rpx solid #ffffff;
					border-bottom: 12rpx solid #ffffff;
				}

				.line-v,
				.line-h {
					position: absolute;
					opacity: 0.5;
				}

				.line-v {
					width: 2rpx;
					border-left: 2rpx dashed #fff;
					height: 100%;
				}

				.line-h {
					height: 2rpx;
					border-bottom: 2rpx dashed #fff;
					width: 100%;
				}
			}
		}

		.cropper-canvas {
			position: fixed;
			background-color: red;
			left: 5000rpx;
		}
	}

	// 安全域兼容样式
	// page {
	// 	--safe-area-inset-top: 0px;
	// 	--safe-area-inset-right: 0px;
	// 	--safe-area-inset-bottom: 0px;
	// 	--safe-area-inset-left: 0px;

	// 	@supports (top: constant(safe-area-inset-top)) {
	// 		--safe-area-inset-top: constant(safe-area-inset-top);
	// 		--safe-area-inset-right: constant(safe-area-inset-right);
	// 		--safe-area-inset-bottom: constant(safe-area-inset-bottom);
	// 		--safe-area-inset-left: constant(safe-area-inset-left);
	// 	}

	// 	@supports (top: env(safe-area-inset-top)) {
	// 		--safe-area-inset-top: env(safe-area-inset-top);
	// 		--safe-area-inset-right: env(safe-area-inset-right);
	// 		//--safe-area-inset-bottom: 12px;
	// 		--safe-area-inset-bottom: env(safe-area-inset-bottom);
	// 		--safe-area-inset-left: env(safe-area-inset-left);
	// 	}
	// }
</style>
