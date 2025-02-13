<template>
	<view class="verify" style="overflow: hidden;">
		<view class="content" :style="{ left: left + 'px' }">
			<view class="round" @touchstart.prevent="onTouchStart($event)" @touchmove.prevent="onTouchMove($event)" @touchend="onTouchEnd">
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {

		},
		data() {
			
			return {
				left: -160,
				startX: 0,
				startY: 0,
				isDragging: false,
				isSend: false
			}
		},
		onLoad() {

		},
		methods: {
			// 触摸开始时，记录起始位置
			onTouchStart(event) {
				console.log('开始触摸')
				if (!this.isSend) {
					this.isDragging = true;
				}
				this.startX = event.touches[0].clientX - this.left;
			},
			// 触摸移动时，更新元素的位置
			onTouchMove(event) {
				console.log( event.touches[0].clientX)
				if (this.isDragging) {
					const newX = event.touches[0].clientX - this.startX
					console.log('开始移动：',newX)
					if (newX >= 0) {
						if (!this.isSend) {
							this.$emit("success")
							uni.showToast({
								title: '打开成功',
								icon: 'success',
							});
						}
						this.left = 0
						this.isSend = true
					} else if (newX <= -160) {
						this.left = -160
					} else {
						this.left = newX
					}
				}
			},
			// 触摸结束时，停止拖动
			onTouchEnd() {
				this.isSend = false
				this.isDragging = false;
				this.left = -160
			}
		}
	}
</script>

<style scoped lang="less">
	.verify {
		width: 200px;
		height: 40px;
		border-radius: 20px;
		background-color: #b9ffff;
		position: relative;
		overflow: hidden;

		.content {
			width: 200px;
			height: 40px;
			position: absolute;
			background-color: #37eb00;
			border-radius: 20px;

			.round {
				position: absolute;
				right: 0;
				width: 40px;
				height: 40px;
				border-radius: 20px;
				background-color: #FFF;
			}
		}
	}
</style>