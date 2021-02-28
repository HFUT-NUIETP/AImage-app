<template>
	<Layout>
		<Topbar>
			<template v-slot:left>
				<view class="topbar-menu" @click="drawer"></view>
			</template>
			<template v-slot:center>
				<view style="font-weight: bold;">AImage</view>
			</template>
			<template v-slot:right>
				<view class="topbar-info"></view>
			</template>
		</Topbar>
		<view class="func-box">
			<navigator v-for="func in funcList" :url="func.url" open-type="navigate">
				<view class="func" :style="[{backgroundImage: 'linear-gradient(180deg, '+ func.color[0] + ',' + func.color[1] + ')'}]">
					<view class="func-icon" :style="[{backgroundImage: func.icon}, {width: func.width}, {height: func.height}]"></view>
					<view>{{func.name}}</view>
				</view>
			</navigator>
		</view>
		<uni-drawer ref="draw" mask width="540rpx">
			<view>
				<view class="draw">
					<view class="draw-user">
						<view class="draw-user-wrap">
							<view class="draw-user-avatar" :style="[{backgroundImage: 'url(' + avatar + ')'}]"></view>
							<view class="button draw-user-button">登录</view>
						</view>
					</view>
					<view class="draw-menu">
						<view class="draw-menu-item" v-for="item in drawerData">
							<view class="draw-menu-item-icon" :style="[{backgroundImage: item.icon}]"></view>
							<view class="draw-menu-item-text">{{item.name}}</view>
						</view>
					</view>
					<view class="draw-bottom">
						<view class="draw-bottom-setting"></view>
					</view>
				</view>

			</view>
		</uni-drawer>
	</Layout>
</template>

<script>
	import Topbar from "../../components/topbar.vue"
	import Layout from "../../components/layout";
	import UniDrawer from "../../components/uni-drawer/uni-drawer"
	export default {
		name: "index",
		components: {
			Layout,
			Topbar,
			UniDrawer
		},
		data() {
			return {
				funcList: [
					{
						name: "AI 创作",
						color: ["#2355f6", "#7da3ff"],
						url: "/pages/aiDraw/aiDraw",
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
				],
				avatar: "../../static/avatar.png",
				drawerData: [
					{
						icon: "url('../../static/create.png')",
						name: "创作"
					},
					{
						icon: "url('../../static/commuity.png')",
						name: "社区"
					}
				]
			}
		},
		methods: {
			drawer() {
				const draw = this.$refs.draw;
				if(draw.showDrawer === true) {
					draw.close();
				} else {
					draw.open();
				}
			}
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
	.draw {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		&-user {
			display: flex;
			flex-direction: column;
			height: 334rpx;
			justify-content: center;
			padding: 40rpx;
			border-bottom: $bottom-border;
			background-color: #f5f5f5;
			&-wrap {
				display: flex;
				flex-direction: column;
				width: 76px;
				align-items: center;
			}
			&-avatar {
				background-size: cover;
				width: 152rpx;
				height: 152rpx;
				margin-bottom: 40rpx;
			}
			&-button {
				width: 102rpx;
				height: 56rpx;
				margin: 0;
				font-size: 28rpx;
				border-radius: 5px;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		&-menu {
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			&-item{
				border-bottom: $bottom-border;
				height: 110rpx;
				display: flex;
				align-items: center;
				padding: 0 36rpx;
				font-size: 40rpx;
				font-family: PRegular;
				&-icon {
					width: 48rpx;
					height: 42rpx;
					background-size: cover;
					margin-right: 36rpx;
				}
			}
		}
		&-bottom {
			margin-bottom: 18px;
			margin-left: 18px;
			&-setting {
				height: 56rpx;
				width: 56rpx;
				background-size: cover;
				background-image: url("../../static/setting.png");
			}
		}
	}
</style>
