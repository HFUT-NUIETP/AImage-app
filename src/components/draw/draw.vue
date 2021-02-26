<template>
	<view class="draw">
		<canvas canvas-id="myDraw" disable-scroll="true" style="width: 750rpx; height: 750rpx" @touchstart="onStart" @touchmove="onMove"></canvas>
	</view>
</template>

<script>

  export default {
		name: 'draw',
		props: {
			width: {
				type: Number,
				default: 512
			},
			height: {
				type: Number,
				default: 512
			},
			background: {
				type: String,
				default: '#fff'
			},
			color: {
				type: String,
				default: '#000'
			},
			size: {
				type: Number,
				default: 8
			},
      useMethod: {
			  type: String,
        default: "paint"
      }
		},
		methods: {
			back: function () {
				this.s.splice(this.s.length - 1, 1)
        if (this.s.length === 0) {
          this.drawBG();
          this.can.draw();
        } else {
          this.isDraw = false;
          this.onDraw();
        }
			},
			save: function (e, w=uni.upx2px(750), h=uni.upx2px(750)) {
				let that = this
				uni.canvasToTempFilePath({
				  x: 0,
				  y: 0,
				  destWidth: w,
				  destHeight: h,
				  canvasId: 'myDraw',
				  success: function(res) {
					that.$emit('on-save', res.tempFilePath);
				  },
				  fail(e) {
				  	console.log(e)
				  }
				})
			},
			onStart: function (e) {
			  this.isDraw = true;
        const t = e.changedTouches[0]
        if (this.useMethod === "paint") {
          this.s.push({
            x: t.x,
            y: t.y,
            location: [],
            color: this.color,
            size: this.size
          })
        } else {
          t.x = Math.floor(t.x);
          t.y = Math.floor(t.y);

          let width = uni.upx2px(750);
          let height = uni.upx2px(750);
          let reg = new RegExp(/rgb\((.*)\)/);
          let newColor = this.color.match(reg)[1];
          const getPixelColor = (x, y) => {
            let result = "";
            uni.canvasGetImageData({
              x: x,
              y: y,
              canvasId: "myDraw",
              width: 1,
              height: 1,
              success: (res) => {
                result = res.data;
              }
            });
            return result;
          }
			    const lineFill = (x, y, newColor, oldColor) => {
            let pixels = undefined;
            uni.canvasGetImageData({
              x: 0,
              y: 0,
              width: width,
              height: height,
              canvasId: "myDraw",
              success: (res) => {
                pixels = res;
              },
              fail: (e) => {
                console.log(e);
              }
            });
            const getPixelColorFromPixels = (index) => {
              return pixels.data[index];
            }
            const replaceColor = (index) => {
              let temp = newColor.split(",");
              let R = Number.parseInt(temp[0]);
              let G = Number.parseInt(temp[1]);
              let B = Number.parseInt(temp[2]);
              let A = 255;
              pixels.data[index + 0] = R;
              pixels.data[index + 1] = G;
              pixels.data[index + 2] = B;
              pixels.data[index + 3] = A;
            }
            const isSameColor = (index) => {
              return pixels.data[index + 0] === oldColor[0] && pixels.data[index + 1] === oldColor[1] && pixels.data[index + 2] === oldColor[2] && pixels.data[index + 3] === oldColor[3]
            }
            let dirList = [[x, y]];
            if(newColor === oldColor) {
              return;
            }
            while(dirList.length > 0) {
              let dir = dirList.pop();
              let x = dir[0];
              let y = dir[1];
              let index = (y * width + x) * 4;
              while(isSameColor(index)) {
                y--;
                index = (y * width + x) * 4;
              }
              let _0x8127f9 = false,
                  _0x3c1b16 = false;
              while (true) {
                y++;
                index = (y * width + x) * 4;
                if (!(y < height && isSameColor(index)))
                  break;
                replaceColor(index);
                if (x > 0) {
                  if (isSameColor(index - 4))
                    !_0x8127f9 && (dirList.push([x - 1, y]),
                        _0x8127f9 = true);
                  else
                    _0x8127f9 && (_0x8127f9 = false);
                }
                if (x < width - 1) {
                  if (isSameColor(index + 0x4))
                    !_0x3c1b16 && (dirList.push([x + 1, y]),
                        _0x3c1b16 = true);
                  else
                    _0x3c1b16 && (_0x3c1b16 = false);
                }
                index += width * 4;
              }
            }
            uni.canvasPutImageData({
              canvasId: "myDraw",
              x: 0,
              y: 0,
              width: width,
              height: height,
              data: pixels.data,
              complete: (e) => {
                console.log(e)
                this.can.draw(true);
              }
            });
          };
          let oldColor = getPixelColor(t.x, t.y)
          lineFill(t.x, t.y, newColor, oldColor);
        }
			},
			onMove: function (e) {
			  if(this.useMethod !== "paint") {
			    return;
        }
				const t = e.changedTouches[0];
				
				this.s[this.s.length - 1].location.push({
					x: t.x,
					y: t.y
				});
				
				this.onDraw();
			},
			onDraw: function () {
			  this.drawBG()
				for (let j of this.s) {
					this.can.moveTo(j.x, j.y);
					
					for (let i of j.location) {
						this.can.lineTo(i.x, i.y);
					}
          this.can.setLineCap("round");
          this.can.setLineJoin("round");
          this.can.setStrokeStyle(j.color);
          this.can.setLineWidth(j.size);
          this.can.stroke();
          this.can.draw(this.isDraw);
				}
			},
			drawBG: function () {
        this.can.drawImage("/static/default_input.png", 0, 0, uni.upx2px(750), uni.upx2px(750));
			},
		},
		created() {
			this.can = uni.createCanvasContext('myDraw')
    },
		mounted() {
      this.drawBG()
			this.can.draw(true)
		},
		data() {
			return {
				can: undefined,
				s: [],
        isDraw: true
			}
		},
	}
</script>

<style lang="scss" scoped>
	
</style>
