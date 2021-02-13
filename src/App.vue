<script>
export default {
	onLaunch: function() {
	},
	onShow: function() {
	},
	onHide: function() {
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
@font-face {
    font-family: PRegular;
    src: url('/static/Alibaba-PuHuiTi-Regular.ttf');
}
@font-face {
    font-family: PBold;
    src: url('/static/Alibaba-PuHuiTi-Bold.ttf');
}
</style>
