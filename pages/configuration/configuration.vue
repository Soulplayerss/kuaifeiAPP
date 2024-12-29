<template>
	<view class="configuration">
		<AppBar title='车辆配置' @goBank="goBank" />
		<view class="content">
			<image src="../../static/20.png" mode="" class="carImg"></image>
			<view class="item">
				<span class="left">车辆编号</span>
				<span class="right">KFYK20241101</span>
			</view>
			<view class="item">
				<span class="left">车辆名称</span>
				<span class="right">挖机最好玩</span>
			</view>
			<view class="item">
				<span class="left">车辆状态</span>
				<span class="right">在线</span>
			</view>
			<view class="item">
				<span class="left">图传状态</span>
				<span class="right">获取中</span>
			</view>
			<view class="item" style="border: none;">
				<span class="left">电池电量</span>
				<span class="right">7.8V</span>
			</view>
			<u-collapse accordion>
				<u-collapse-item title="选择场地">
					<text class="u-collapse-content">选择场地</text>
				</u-collapse-item>
				<u-collapse-item title="系统设置">
					<text class="u-collapse-content">系统设置</text>
				</u-collapse-item>
				<u-collapse-item title="通道设置">
					<text class="u-collapse-content">通道设置川</text>
				</u-collapse-item>
				<u-collapse-item title="图传设置">
					<text class="u-collapse-content">图传设置</text>
				</u-collapse-item>
				<u-collapse-item title="操控设置">
					<text class="u-collapse-content">操控设置</text>
				</u-collapse-item>
			</u-collapse>
			<view class="item">
				<span class="left">共享车辆</span>
			</view>
		</view>

		<view class="btns">
			<view class="btn">
				<u-button type="primary" shape="circle" text="保存" style="color: #30313D;"
					color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))"></u-button>
			</view>
			<view class="btn">
				<u-button type="primary" shape="circle" text="删除车辆"
					color="linear-gradient(to bottom, rgb(248, 124, 23), rgb(219, 76, 4))"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import AppBar from '@/components/common/AppBar.vue'
	export default {
		data() {
			return {

			}
		},
		components: {
			AppBar
		},
		methods: {
			goBank() {
				uni.navigateTo({
					url: '/pages/car/car',
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.configuration {
		width: 100%;
		min-height: 100vh;
		background-color: #eea618;
		box-sizing: border-box;
		padding-bottom: 72px;

		.content {
			background-color: #FFF;
			border-radius: 8px;
			padding: 16px;
			box-sizing: border-box;
			margin: 16px;

			.carImg {
				width: 100%;
			}

			.item {
				height: 42px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 15px;
				border-bottom: solid 1px #d6d7d9;
				padding: 0 16px;
				box-sizing: border-box;

				.right {
					color: #98999a;
				}
			}

			.u-cell {
				border: solid 1px #d6d7d9;
			}
		}

		.btns {
			background-color: #eea618;
			position: fixed;
			bottom: 0px;
			left: 0;
			width: 100%;
			box-sizing: border-box;
			padding: 16px;
			display: flex;
			gap: 20px;

			.btn {
				flex: 1;
			}
		}
	}
</style>