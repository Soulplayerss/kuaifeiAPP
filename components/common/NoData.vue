<template>
	<view class="nodata">
		<image src="../../assets/images/nodata.png" mode=""></image>
		<view class="">
			暂无数据
		</view>
	</view>
</template>

<script>
</script>

<style scoped lang="less">
	.nodata{
		width: 100%;
		height: 400px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #6a6a6a;
		image{
			width: 200px;
			height: 200px;
		}
	}
</style>