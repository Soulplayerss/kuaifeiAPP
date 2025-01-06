<template>
	<view class="appbar" :style="pageStyle">
		<view style="width: 24px;">
			<u-icon name="arrow-left" :color="textColor" size="24" v-show="showBack" @click="goback"></u-icon>
		</view>
		<span :style="{ color: textColor }">{{title}}</span>
		<span style="display: inline-block;width: 24px;height: 24px;"></span>
	</view>
</template>

<script>
	export default {
		props: {
			showBack: {
				type: Boolean,
				default: true
			},
			title: {
				type: String,
				default: ''
			},
			textColor: {
				type: String,
				default: '#FFF'
			}
		},
		data() {
			return {
				pageStyle: {}
			}
		},
		onReady() {
			
		},
		methods: {
			goback() {
				this.$emit("goBank")
			}
		},
		mounted() {
			let that = this
			uni.getStorage({
				key: 'statusBarHeight',
				success(res) {
					that.pageStyle = {
						paddingTop: `${res.data + 16}px`
					};
				}
			})
		}
	}
</script>

<style scoped lang="less">
	.appbar {
		width: 100%;
		height: 44px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 16px;
		background-color: #eea618;
		font-size: 18px;
		font-weight: bold;
	}
</style>