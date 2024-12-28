<template>
	<view class="appbar">
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

			}
		},
		methods: {
			goback() {
				this.$emit("goBank")
			}
		}
	}
</script>

<style scoped lang="less">
	.appbar {
		width: 100%;
		height: 44px;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 16px;
		background-color: #eea618;
		font-size: 16px;
		font-weight: bold;
	}
</style>