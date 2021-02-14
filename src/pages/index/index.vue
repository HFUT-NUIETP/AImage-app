<template>
	<Layout>
		<Topbar>
			<template v-slot:left>
				<view class="topbar-menu"></view>
			</template>
			<template v-slot:center>
				<view style="font-weight: bold;">AImage</view>
			</template>
			<template v-slot:right>
				<view class="topbar-info"></view>
			</template>
		</Topbar>
		<view class="func-box">
			<navigator v-for="func in funcList" :url="func.url" open-type="redirect">
				<view class="func" :style="[{backgroundImage: 'linear-gradient(180deg, '+ func.color[0] + ',' + func.color[1] + ')'}]">
					<view class="func-icon" :style="[{backgroundImage: func.icon}, {width: func.width}, {height: func.height}]"></view>
					<view>{{func.name}}</view>
				</view>
			</navigator>
		</view>
	</Layout>
</template>

<script>
	import Topbar from "../../components/topbar.vue"
	import Layout from "../../components/layout";
	export default {
		name: "index",
		components: {
			Layout,
			Topbar
		},
		data() {
			return {
				funcList: [
					{
						name: "AI 创作",
						color: ["#2355f6", "#7da3ff"],
						url: "#",
						icon: "url('../../static/ai-icon.png')",
						width: "108rpx",
						height: "108rpx"
					},
					{
						name: "风格转换",
						color: ["#f84444", "#ff7979"],
						url: "/pages/styleConvert/styleConvert",
						icon: "url('../../static/style-icon.png')",
						width: "136rpx",
						height: "118rpx"
					},
					{
						name: "版权保护",
						color: ["#aa44f8", "#b879ff"],
						url: "#",
						icon: "url('../../static/encrypted-icon.png')",
						width: "116rpx",
						height: "148rpx"
					}
				]
			}
		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../common";
	.topbar {
		&-menu {
			background-image: url("../../static/menu.png");
			@extend .topbar-icon;
		}
		&-info {
			background-image: url("../../static/info.png");
			@extend .topbar-icon;
		}
	}
	.func {
		width: 500rpx;
		height: 252rpx;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		font-family: PBold;
		font-weight: bold;
		font-size: 46rpx;
		color: white;
		border-radius: 20px;

		margin-bottom: 120rpx;

		&-icon {
			background-size: cover;
		}
	}
	.func-box {
		@extend .content-box;
		align-items: center;
	}
</style>
