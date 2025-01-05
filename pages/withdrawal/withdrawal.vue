<template>
	<view class="feedback">
		<AppBar title='提现' @goBank="goBank" />
		<view style="padding: 16px;">
			<view class="content">
				<view class="title">
					提现方式
				</view>
				<view class="typeBox">
					<view class="item" @click="type = '微信'">
						<view class="round">
							<view class="innerCircle" v-show="type === '微信'"></view>
						</view>
						<span class="typeText">微信</span>
					</view>
					<view class="item" @click="type = '支付宝'">
						<view class="round">
							<view class="innerCircle" v-show="type === '支付宝'"></view>
						</view>
						<span class="typeText">支付宝</span>
					</view>
				</view>
				<view class="title">
					收款信息
				</view>
				<view class="formBox">
					<view class="formItem">
						<view class="color-c2a9bb label">提现数量</view>
						<view class="itemRight">
							<u--input border="bottom" type="text" v-model="amount" placeholder="请输入提现数量" />
						</view>
					</view>
					<view class="formItem">
						<view class="color-c2a9bb label">{{type}}账号</view>
						<view class="itemRight">
							<u--input border="bottom" type="text" v-model="account" :placeholder="`请输入${type}账号`" />
						</view>
					</view>
					<view class="formItem">
						<view class="color-c2a9bb label">{{type}}名称</view>
						<view class="itemRight">
							<u--input border="bottom" type="text" v-model="name" :placeholder="`请输入${type}名称`" />
						</view>
					</view>
					<view class="formItem items-start">
						<view class="color-c2a9bb label">收款码</view>
						<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple
							:maxCount="10"></u-upload>
					</view>
				</view>

				<view class="notice">
					<view style="color: #eea618;">注意事项:</view>
					<view class="remark">1.充值电池和共享收益可提现，提现收取1%手续费</view>
					<view class="remark">2.赠送电池不可提现，提现后赠送电池将被清空</view>
					<view class="remark">3.提现将在1~3个工作日内到账</view>
					<view class="remark">4.如收款信息填写有误，将退回到余额中，请重新申请提现</view>
				</view>
			</view>
		</view>

		<view class="btns">
			<view class="btn">
				<u-button type="primary" shape="circle" text="提交" style="color: #30313D;"
					color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import AppBar from '@/components/common/AppBar.vue'
	export default {
		data() {
			return {
				amount: '',
				account: '',
				name: '',
				type:'微信',
				fileList: [],
			}
		},
		components: {
			AppBar
		},
		onLoad(options) {

		},
		methods: {
			goBank() {
				uni.navigateTo({
					url: '/pages/wallet/wallet',
				})

			},
			onPickerChange(e) {
				const selectedIndex = e.detail.value;
				this.selectedOption = this.options[selectedIndex];
			},
			// 删除图片
			deletePic(event) {
				this[`fileList`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList`].length
				lists.map((item) => {
					this[`fileList`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList`][fileListLen]
					this[`fileList`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.feedback {
		width: 100%;
		min-height: 100vh;
		background: url('../../assets/images/tab-bg.png') no-repeat;
		background-size: 100% auto;
		background-color: #eea618;
		padding-bottom: 72px;
		box-sizing: border-box;

		.content {
			width: 100%;
			min-height: calc(100vh - 194px);
			box-sizing: border-box;
			padding: 16px;
			border-radius: 8px;
			background-color: #FFF;

			.title {
				font-size: 18px;
				color: #eea618;
				font-weight: bold;
			}

			.typeBox {
				display: flex;
				box-sizing: border-box;
				padding: 16px 32px;
				gap: 32px;

				.item {
					display: flex;
					align-items: center;

					.round {
						width: 24px;
						height: 24px;
						border-radius: 50%;
						border: solid 1px #eea618;
						display: flex;
						justify-content: center;
						align-items: center;
						margin-right: 8px;

						.innerCircle {
							width: 12px;
							height: 12px;
							border-radius: 50%;
							background-color: #eea618;
						}
					}

					.typeText {
						font-size: 16px
					}
				}
			}

			.formBox {
				width: 100%;
				box-sizing: border-box;
				padding: 8px 16px;

				.label {
					width: 90px;
				}

			}

			.notice {
				margin-top: 60px;

				.remark {
					padding: 4px 0;
					font-size: 12px;
					color: #616162;
				}
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

			.btn {
				flex: 1;
			}
		}
	}
</style>