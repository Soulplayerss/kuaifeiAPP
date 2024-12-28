<template>
	<view class="">
		<u-overlay :show="show">
			<view class="overlayBox">
				<view class="title">温馨提示</view>
				<view class="content">
					欢迎来到快飞云控!
				</view>
				<view class="content">
					我们深知个人信息对你的重要性也感谢你对我们的信任。
				</view>
				<view class="content">
					为了更好地保护你的权益，同时遵守相关监管的要求，我们将通过《<span
						class="protocolText">快飞云控隐私权政策</span>》向你说明我们会如何收集、存储保护、使用及对外提供你的信息，并说明你享有的权利。
				</view>
				<view class="content">
					更多详情，敬请查阅《<span class="protocolText">快飞云控隐私权政策</span>》全文
				</view>
				<view class="btns">
					<span class="no" @click="close('no')">不同意</span>
					<span class="yes" @click="close('yes')">同意</span>
				</view>
			</view>
		</u-overlay>
	</view>
</template>

<script>
	export default {
		props: {
			overlay: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				show: false,
			}
		},
		methods: {
			close(type) {
				this.$emit("clsoeEvent", type)
				this.show = false
			}
		},
		watch: {
			overlay: {
				handler(newVal, oldVal) {
					this.show = newVal
				},
			}
		}
	}
</script>

<style scoped lang="less">
	.u-transition {
		display: flex;
		align-items: center;
		justify-content: center;

		.overlayBox {
			width: 80%;
			height: auto;
			background-color: #FFF;
			padding: 16px;
			border-radius: 8px;

			.title {
				font-size: 18px;
				font-weight: bold;
				text-align: center;
				color: #30313D;
				margin-bottom: 40rpx;
			}

			.content {
				text-indent: 2em;
				font-size: 14px;
				color: #30313D;
				line-height: 24px;

				.protocolText {
					color: #b9dd04;
				}
			}

			.btns {
				margin-top: 40rpx;
				text-align: right;
				color: #b9dd04;

				.no {
					color: darkgrey;
					padding-right: 40rpx;
				}
			}
		}
	}
</style>