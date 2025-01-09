import Vue from 'vue';
import Vuex from 'vuex';
import request from '@/utils/request';

Vue.use(Vuex);
export const store = new Vuex.Store({
	state: {
		siteStatus: [],
		siteType: [],
		siteLabel: [],
		userInfo: {}
	},
	mutations: {
		setSiteStatus(state) {
			uni.getStorage({
				key: 'siteStatus',
				success(res) {
					state.siteStatus = res.data;
				}
			});
		},
		setSiteType(state) {
			uni.getStorage({
				key: 'siteType',
				success(res) {
					state.siteType = res.data;
				}
			});
		},
		setSiteLabel(state) {
			uni.getStorage({
				key: 'siteLabel',
				success(res) {
					state.siteLabel = res.data;
				}
			});
		},
		setUserInfo(state) {
			uni.getStorage({
				key: 'userInfo',
				success(res) {
					state.userInfo = res.data;
				}
			});
		},
	},
	actions: {
		async fetchEmun({
			commit
		}) {
			try {
				// 并行请求多个接口
				const [siteStatus, siteType, siteLabel,userInfo] = await Promise.all([
					request('/system/dict/data/type/app_site_status', 'GET'), // 场地状态
					request('/system/dict/data/type/app_site_type', 'GET'), // 场地类型
					request('/system/dict/data/type/app_site_label', 'GET'), // 场地标签
					request('/app/asset/getUserInfo', 'GET'), // 用户信息
				]);

				// 将返回的结果存储到本地缓存
				uni.setStorage({
					data: siteStatus.data,
					key: 'siteStatus',
					success(res) {
						commit('setSiteStatus');
					}
				});
				uni.setStorage({
					data: siteType.data,
					key: 'siteType',
					success(res) {
						commit('setSiteType');
					}
				});
				uni.setStorage({
					data: siteLabel.data,
					key: 'siteLabel',
					success(res) {
						commit('setSiteLabel');
					}
				});
				
				uni.setStorage({
					key: 'userInfo',
					data: userInfo.data,
					success(res) {
						commit('setUserInfo');
					}
				});

			} catch (error) {
				// 处理请求失败的情况
				uni.showToast({
					title: '加载失败',
					icon: 'none',
				});
				console.error('加载数据失败:', error);
			}
		},
	},
	getters: {
		getSiteStatus: (state) => state.siteStatus,
		getSiteTyp: (state) => state.siteType,
		getSiteLabel: (state) => state.siteLabel,
		getUserInfo: (state) => state.userInfo
	},
});