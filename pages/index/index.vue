<template>
	<view class="indexPage">
		<u-button text="驾驶" @click="toDrive"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			toDrive(){
				uni.navigateTo({
					url: '/pages/drive/drive',
				})
			}
			
		}
	}
</script>

<style>
</style>