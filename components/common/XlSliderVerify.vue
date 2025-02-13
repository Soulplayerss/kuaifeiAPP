<template>
	<cover-view class="verify" style="overflow: hidden;">
		<cover-view class="content" :style="{ left: left + 'px' }">
			<cover-view class="round" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
			</cover-view>
		</cover-view>
	</cover-view>
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
				if (!this.isSend) {
					this.isDragging = true;
				}
				this.startX = event.touches[0].clientX - this.left;
			},
			// 触摸移动时，更新元素的位置
			onTouchMove(event) {
				if (this.isDragging) {
					const newX = event.touches[0].clientX - this.startX
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

		.content {
			width: 100%;
			height: 100%;
			position: absolute;
			background-color: #37eb00;
			border-radius: 20px;
			display: flex;
			justify-content: end;

			.round {
				width: 40px;
				height: 40px;
				border-radius: 20px;
				background-color: #FFF;
			}
		}
	}
</style>