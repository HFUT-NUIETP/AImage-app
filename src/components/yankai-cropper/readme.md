#### 【注意】由于赶时间，只做了功能性测试，兼容性测试暂时无法进行，更不用说优化测试了。欢迎有遇到问题的留言，或者自己动手修改也可以。
#### 【注意】因为属于业余时间开发的一个项目所依赖的插件，所以更新较缓慢。

### 使用方式

```javascript
import Cropper from '@/components/cropper/cropper.vue';
```

```html
<cropper :imagePath="originalFaceSrc" :aspectRatio="1" @complete="complete" @cancel="cancel" v-if="handleFaceStatus"></cropper>
```

使用v-if控制显示，mounted内执行init方法，使用简单，操作便利。

## 参数
| 参数  | 类型  | 解释  |  默认 |  必填 | 备注  |
| ------------ | ------------ | ------------ | ------------ | ------------ | ------------ |
|  quality | Number  | 返回图片质量  | 1  | 否  |  如返回的图片仅需预览不用上传，请适当调低 |
|  imagePath | String  | 原始图片路径  |""  | 是  | blob、静态图片资源地址或者base64（未测试）  |
|  outputFileType | String  | 目标文件的类型  | jpg  | 否  | jpg：输出jpg格式图片；png：输出png格式图片  |
|  aspectRatio | Number, null  | 目标图片的宽高比  | null  | 否  | null，即不限制剪裁宽高比。aspectRatio需大于0  |
|  minBoxWidthRatio | Number  | 最小剪裁尺寸与原图尺寸的比率（宽）  | 0.15  | 否  | 宽度最小剪裁到原图的0.15宽  |
|  minBoxHeightRatio  | Number  | 最小剪裁尺寸与原图尺寸的比率（高）  | 0.15  | 否  | 当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到  |
|  initialBoxWidthRatio | Number  | 剪裁框初始大小比率（宽）  | 0.8  | 否  | 裁框默认宽度为图片宽度的0.8倍  |
|  initialBoxHeightRatio | Number  | 剪裁框初始大小比率（高）  | 0.8  | 否  | 当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到  |

## 事件

| 事件名  | 解释  | 参数  |  备注 |
| ------------ | ------------ | ------------ | ------------ |
|  reset |  用户点击重做后触发 | 无  | 可能无用，但留一个给开发者备用  |
|  cancel |  用户点击取消后触发 | 无  | 开发者可以将组件置为消失v-if（尽量不要用v-show）   |
|  complete |  用户点击裁剪后触发 | path：路径，h5为base64，app与小程序为临时路径；param：裁切参数，见【备注1】  | 核心功能   |


### 备注1
param：
```json
｛
	x:Number, //裁切左上角X坐标
	y:Number, //裁切左上角Y坐标
	width:Number, //裁切宽度
	height:Number, //裁切高度
	rotate:Number, //旋转（未实现，预留）
	scaleX:Number, //X轴缩放（未实现，预留）
	scaleY:Number, //Y轴缩放（未实现，预留）
｝
```

### 备注2
本组件样式支持iphone安全范围但需要手动开启
请在插件被样式中最后备注的地方解除备注即可。
控制台会报错，无视即可。
或者复制如下样式样式代码
```css
// 安全域兼容样式
page {
	--safe-area-inset-top: 0px;
	--safe-area-inset-right: 0px;
	--safe-area-inset-bottom: 0px;
	--safe-area-inset-left: 0px;

	@supports (top: constant(safe-area-inset-top)) {
		--safe-area-inset-top: constant(safe-area-inset-top);
		--safe-area-inset-right: constant(safe-area-inset-right);
		--safe-area-inset-bottom: constant(safe-area-inset-bottom);
		--safe-area-inset-left: constant(safe-area-inset-left);
	}

	@supports (top: env(safe-area-inset-top)) {
		--safe-area-inset-top: env(safe-area-inset-top);
		--safe-area-inset-right: env(safe-area-inset-right);
		//--safe-area-inset-bottom: 12px;
		--safe-area-inset-bottom: env(safe-area-inset-bottom);
		--safe-area-inset-left: env(safe-area-inset-left);
	}
}
```