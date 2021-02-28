<template>
	<view class="topbar" :style="[{ marginTop: statusBarHeight + 'px' }]">
		<view style="width: 25%">
			<view class="left">
				<slot name="left"></slot>
			</view>
		</view>
		<view style="width: 50%; text-align: center; font-weight: bold;">
			<slot name="center"></slot>
		</view>
		<view style="width: 25%; text-align: end">
			<view class="right">
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
				windowHeight: 0
			};
		},
		mounted() {
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
	}
</script>

<style lang="scss" scoped>
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
	}
	.left {
		padding-left: 40rpx;
	}
	.right {
		padding-right: 40rpx;
		float: right;
	}
</style>
