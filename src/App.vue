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
  font-family: 'Alibaba PuHuiTi R';
  src: url('/static/Alibaba-PuHuiTi-R.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Alibaba PuHuiTi B';
  src: url('/static/Alibaba-PuHuiTi-B.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
  font-display: swap;
}


</style>
