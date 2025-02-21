<template>
	<view class="myFeedback">
		<AppBar title='云控相册' @goBank="goBank" />
		<view style="padding: 16px;">
			<view class="content">
				<view style="text-align: right;margin-bottom: 16px;">
					<span style="color: #eea618;">刷新</span>
				</view>
				<NoData v-if="dataList.length == 0" />
				<view class="list" v-else>
					<view class="" v-for="(item,index) in dataList" :key="index">
						<view class="time">
							{{item.createTime}}
						</view>
						<view class="imgs">
							<image v-for="imgSrc in item.pictureUrl" :key="imgSrc" :src="imgSrc" mode="" class="img" @click="openImg(imgSrc)">
							</image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="">
			
		</view>
	</view>
</template>

<script>
	import AppBar from '@/components/common/AppBar.vue'
	import request from '@/utils/request';
	import {
		requestUrl
	} from '@/utils/request';
	import NoData from '@/components/common/NoData.vue'
	export default {
		data() {
			return {
				dataList: [],
				imgSrc:'',
				showOpenImg: false
			}
		},
		components: {
			AppBar,
			NoData
		},
		methods: {
			goBank() {
				uni.navigateTo({
					url: '/pages/my/my',
				})
			},
			openImg(src){
				this.imgSrc = src
				showOpenImg = true
			},
			async getList() {
				try {
					const response = await request(`/app/picture/listByUser`, 'GET')
					const result = response.rows.reduce((acc, current) => {
						// 查找当前时间是否已经存在
						const existing = acc.find(item => item.createTime === current.createTime);

						if (existing) {
							// 如果存在，合并 data
							existing.pictureUrl.push(requestUrl + current.pictureUrl);
						} else {
							// 如果不存在，创建新的对象
							acc.push({
								createTime: current.createTime,
								pictureUrl: [requestUrl + current.pictureUrl]
							});
						}

						return acc;
					}, []);
					this.dataList = result
					console.log(this.dataList)

				} catch (error) {
					uni.showToast({
						title: '加载失败',
						icon: 'none',
					});
				}
			},

		},
		mounted() {
			this.getList()
		}
	}
</script>

<style scoped lang="less">
	.myFeedback {
		width: 100%;
		min-height: 100vh;
		background: url('../../assets/images/tab-bg.png') no-repeat;
		background-size: 100% auto;
		background-color: #eea618;

		.content {
			width: 100%;
			padding: 16px;
			height: calc(100vh - 122px);
			background-color: #FFF;
			border-radius: 8px;
			box-sizing: border-box;
			overflow: hidden;
			display: flex;
			flex-direction: column;

			.list {
				flex: 1;
				overflow: auto;

				.time {
					font-size: 16px;
					margin-bottom: 16px;
				}

				.imgs {
					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					gap: 20px;
					
					.img {
						width: 47%;
						box-sizing: border-box;
						border: solid 1px #000;
						height: 150px;
					}
				}
			}
		}
	}
</style>