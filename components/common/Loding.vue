<template>
	<view class="loding">
		<u-loading-icon color="#FFF" size="40"></u-loading-icon>
	</view>
</template>

<script>

</script>

<style scoped lang="less">
	.loding {
		width: 100%;
		height: 100%;
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 99999;
	}
</style>