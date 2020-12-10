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
		<cropper ref="cropper" :aspectRatio="1" :imagePath="img" @complete="complete" @cancel="cancel" ></cropper>
		<view id="bottomType">
			<view v-for="(fun, id) in functionType" :key="id" class="funTypeBox">
				<view class="funTypeName">{{ fun.fun }}</view>
			</view>
			<view style="width: 30upx;height: 100%;flex-shrink: 0;"></view>
		</view>
		<view style="width: 100%;height: 9000upx;"></view>
		<uni-fab style="--window-bottom: 90px;" @fabClick="" :pattern="fab_moreFun.pattern" :content="fab_moreFun.content"
		 :horizontal="fab_moreFun.horizontal" :vertical="fab_moreFun.vertical" :direction="fab_moreFun.direction"></uni-fab>
	</view>
</template>

<script>
	import Cropper from '@/components/yankai-cropper/cropper.vue';
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
						fun: '风格画',
						img: ''
					},
					{
						fun: '动漫风',
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
				img: ''
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
						this.$refs.cropper.init(res.tempFilePaths[0]);

					}
				});
			},
			complete(res) {
				this.$refs.cropper.close(true);
				this.img = res.path;
				this.showADD = false;
			}
		},
		components: {
			Cropper
		}
	}
</script>

<style>
	@import url("index.css");
</style>
