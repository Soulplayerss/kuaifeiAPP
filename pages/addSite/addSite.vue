<template>
	<view class="addSite">
		<AppBar title='添加场地' @goBank="goBank" />
		<view class="content">
			<!-- <view class="title">场地信息:</view> -->
			<view class="formItem">
				<span style="padding-right: 32px;" class="color-c2a9bb">场地名称</span>
				<view class="itemRight">
					<u--input border="bottom" type="text" v-model="siteName" placeholder="请输入场地名称" />
				</view>
			</view>
			<view class="siteTag">
				<view style="padding-right: 32px;width: 110px;" class="color-c2a9bb">场地标签</view>
				<view class="tags">
					<view class="u-page__tag-item" v-for="(item, index) in tagList" :key="index">
						<u-tag :text="item.name" :plain="!item.checked" shape="circle" type="warning" :name="index"
							@click="checkboxClick">
						</u-tag>
					</view>
				</view>
			</view>
			<view class="uploadImg">
				<view style="padding-right: 32px;" class="color-c2a9bb">上传场地图片</view>
				<view class="upload">
					<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
						:maxCount="10"></u-upload>
				</view>
			</view>
		</view>
		<view class="btns">
			<view class="btn">
				<u-button type="primary" shape="circle" text="保存" style="color: #30313D;"
					color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))"></u-button>
			</view>
			<view class="btn">
				<u-button type="primary" shape="circle" text="删除场地"
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
				siteName: '',
				fileList1: [],
				superiorPage:'car',
				tagList: [{
						name: '越野',
						value: 0,
						checked: false
					},
					{
						name: '赛道',
						value: 1,
						checked: false
					},
					{
						name: '工地',
						value: 2,
						checked: false
					},
					{
						name: '工程',
						value: 3,
						checked: false
					},
					{
						name: '专业',
						value: 4,
						checked: false
					},
					{
						name: '挖机',
						value: 5,
						checked: false
					},
				]
			}
		},
		components: {
			AppBar
		},
		onLoad(options) {
			const {
				page
			} = options; // 获取具体的参数值
			console.log(page); // JohnDoe
			this.superiorPage = page
		},
		methods: {
			goBank() {
				if (this.superiorPage === 'car') {
					uni.navigateTo({
						url: '/pages/car/car',
					})
				}
				if (this.superiorPage === 'mySite') {
					uni.navigateTo({
						url: '/pages/mySite/mySite',
					})
				}
			},
			checkboxClick(name) {
				this.tagList[name].checked = !this.tagList[name].checked
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
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
	.addSite {
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
			min-height: calc(100vh - 132px);
			.title {
				font-size: 18px
			}

			.siteTag {
				display: flex;
				margin-top: 16px;

				.tags {
					display: flex;
					flex-wrap: wrap;
					gap: 16px;
				}
			}

			.uploadImg {
				margin-top: 32px;
				display: flex;
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