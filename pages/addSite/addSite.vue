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
					<view class="" v-for="(item,index) in tagList" :key="item.dictCode">
						<u-tag :text="item.dictLabel" :plain="!item.checked" shape="circle" type="warning" :name="index"
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
					color="linear-gradient(to bottom, rgb(255,241,204), rgb(255, 227, 157))"
					@click="addSite"></u-button>
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
	import request from '@/utils/request';
	import {
		requestUrl
	} from '@/utils/request';
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				siteName: '',
				fileList1: [],
				tagList: [],
				sitePictureUrl: '',
				siteLabelValue: [],
				superiorPage: 'car'
			}
		},
		components: {
			AppBar
		},
		computed: {
			...mapState(['siteLabel'])
		},
		onLoad(options) {
			const {
				page
			} = options; // 获取具体的参数值
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

			addOrRemove(arr, item) {
				const index = arr.indexOf(item);

				if (index === -1) {
					arr.push(item);
				} else {
					arr.splice(index, 1);
				}

				return arr.sort((a, b) => a - b);

			},
			checkboxClick(name) {
				this.tagList[name].checked = !this.tagList[name].checked
				this.siteLabelValue = this.addOrRemove(this.siteLabelValue, this.tagList[name].dictValue)
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
			async addSite() {
				try {
					const response = await request('/app/site/addSite', 'POST', {
						siteName: this.siteName,
						sitePictureUrl: this.sitePictureUrl,
						siteLabel: this.siteLabelValue.join(',')
					})
					
					if(response.data.code === 200){
						this.goBank()
					}
				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}

			}
		},
		mounted() {
			this.$nextTick(() => {
				this.tagList = [...this.siteLabel]
				this.tagList.forEach((item) => {
					this.$set(item, 'checked', false)
				})
			})
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
			min-height: calc(100vh - 194px);

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