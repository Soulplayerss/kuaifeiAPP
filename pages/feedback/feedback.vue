<template>
	<view class="feedback">
		<AppBar title='问题反馈' @goBank="goBank" />
		<view style="padding: 16px;">
			<view class="content">
				<view class="title">
					信息提交
				</view>
				<view class="item">
					<span class="color-c2a9bb">投诉类型</span>
					<view class="pickerBox">
						<picker mode="selector" :range="options" @change="onPickerChange">
							<view class="picker">
								<text>{{ selectedOption }}</text>
								<u-icon name="arrow-down" size="16"></u-icon>
							</view>
						</picker>
					</view>
				</view>
				<view class="item items-start">
					<span class="color-c2a9bb">问题描述</span>
					<u--textarea v-model="remark" placeholder="请输入内容" count height="120"></u--textarea>
				</view>

				<view class="item items-start">
					<span class="color-c2a9bb">上传图片凭证</span>
					<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple
						:maxCount="10"></u-upload>
				</view>

				<view class="notice">
					<view style="color: #eea618;">注意事项:</view>
					<view class="remark">1.支付完成后入进如或车辆异常，请及时联系客服处理</view>
					<view class="remark">2.进入后如车辆翻车或不能驾驶，请及时上报管理员处理</view>
					<view class="remark">3.如有其他任何问题请及时联系客服处理</view>
				</view>
			</view>
		</view>

		<view class="btns">
			<view class="btn">
				<u-button type="primary" @click="commitFeedback" shape="circle" text="提交" style="color: #30313D;"
					color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import AppBar from '@/components/common/AppBar.vue'
	import request from '@/utils/request';
	import {
		requestUrl
	} from '@/utils/request';
	export default {
		data() {
			return {
				options: [],
				selectedOption: '请选择投诉类型',
				remark: '',
				type: '',
				fileList: [],
				sitePictureUrl: '',
				superiorPage: 'my',
				questionTypeList: []
			}
		},
		components: {
			AppBar
		},
		onLoad(options) {
			const {
				page
			} = options; // 获取具体的参数值
			this.superiorPage = page
		},
		mounted() {
			this.getQuestionType()
		},
		methods: {
			goBank() {
				if (this.superiorPage === 'my') {
					uni.navigateTo({
						url: '/pages/my/my',
					})
				}
				if (this.superiorPage === 'wallet') {
					uni.navigateTo({
						url: '/pages/wallet/wallet',
					})
				}
				if (this.superiorPage === 'myOrder') {
					uni.navigateTo({
						url: '/pages/myOrder/myOrder',
					})
				}
			},
			async getQuestionType() {
				try {
					const response = await request(`/system/dict/data/type/app_question_type`, 'GET')
					this.questionTypeList = response.data
					this.options = response.data.map((item) => item.dictLabel)
					this.selectedOption = response.data[0].dictLabel
					this.type = response.data[0].dictValue
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},
			onPickerChange(e) {
				const selectedIndex = e.detail.value;
				this.selectedOption = this.options[selectedIndex];
				this.type = this.questionTypeList.find(item => item.dictLabel == this.selectedOption)?.dictValue
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
				var token = ''
				uni.getStorage({
					key: 'Token',
					success(res) {
						token = res.data
					}
				})
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: `${requestUrl}/common/upload`,
						filePath: url,
						name: 'file',
						header: {
							'Authorization': `Bearer ${token}`
						},
						success: (res) => {
							let data = JSON.parse(res.data)
							this.sitePictureUrl = data.fileName
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			async commitFeedback() {
				if (this.remark == '') {
					uni.showToast({
						title: '请输入问题描述',
						icon: 'error',
					});
					return
				}
				try {
					const response = await request('/app/question/addByApp', 'POST', {
						type: this.type,
						remark: this.remark,
						certificate: this.sitePictureUrl
					})
					if (response.code === 200) {
						uni.showToast({
							title: '反馈成功',
							icon: 'success',
						});
						setTimeout(() => {
							this.goBank()
						}, 1000)
					}
				} catch (error) {
					uni.showToast({
						title: '添加失败',
						icon: 'none',
					});
				}

			}
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
				font-size: 16px;
				margin-bottom: 16px;
			}

			.item {
				display: flex;
				gap: 16px;
				align-items: center;
				margin-bottom: 24px;

				.pickerBox {
					flex: 1;
					border: solid 1px #e5e5e6;
					border-radius: 4px;
					padding: 6px 16px;

					.picker {
						background-color: #fff;
						font-size: 16px;
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
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