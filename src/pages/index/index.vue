<template>
	<Layout>
		<Topbar>
			<template v-slot:left>
        <navigator url="/pages/setting/setting" open-type="navigate">
          <view class="topbar-menu" style="width: 40rpx"></view>
        </navigator>
			</template>
			<template v-slot:center>
				<view style="font-weight: 1000; font-family: 'Alibaba PuHuiTi R'">AI绘画</view>
			</template>
			<template v-slot:right>
				<view class="topbar-info" @click="testConn"></view>
			</template>
		</Topbar>
		<view class="func-box">
			<navigator class="route" v-for="func in funcList" :url="func.url" :key="func.url" open-type="navigate">
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
						url: "/pages/encrypt/encrypt",
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
		  testConn() {
		    let url = uni.getStorageSync('serverUrl');
        uni.request({
          url: url + "test",
          method: "GET",
          success: (res) => {
            if (res.data === 1) {
              uni.showToast({
                title: `${url}\n连接成功`,
                icon: "none",
                mask: false,
                duration: 2000
              });
            } else {
              uni.showToast({
                title: `${url}\n服务器返回无效`,
                icon: "none",
                mask: false,
                duration: 2000
              });
            }
          },
          fail: (res) => {
            uni.showToast({
              title: `${url}\n连接失败`,
              icon: "none",
              mask: false,
              duration: 2000
            });
          }
        })
      }
		},
    mounted() {
		  this.testConn();
    }
  }
</script>

<style lang="scss" scoped>
	@import "../../common";
	.topbar {
		&-menu {
			background-image: url("../../static/setting.png");
			@extend .topbar-icon;
		}
		&-info {
			background-image: url("../../static/info.png");
			@extend .topbar-icon;
		}
	}
  .route {
    margin-bottom: 120rpx;
  }
	.func {
		width: 500rpx;
		height: 252rpx;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		font-family: "Alibaba PuHuiTi B";
		//font-weight: bold;
		font-size: 46rpx;
		color: white;
		border-radius: 20px;


		&-icon {
			background-size: cover;
		}
	}
	.func-box {
		@extend .content-box;
		align-items: center;
	}
</style>
