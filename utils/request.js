const BASE_URL = 'http://1.95.71.155:8888';
const SOCKET_URL = '1.95.71.155:8888';
// const SOCKET_URL = '77717002.r32.cpolar.top';
// const BASE_URL = 'https://77717002.r32.cpolar.top';
const request = (url, method = 'GET', data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
	var token = ''
	token = uni.getStorageSync('Token')
    uni.request({
      url: `${BASE_URL}${url}`,
      method: method.toUpperCase(),
      data,
      header: {
        'Content-Type': 'application/json',
		'Authorization': `Bearer ${token}`,
        ...headers,
      },
      success: (response) => {
        const { data, statusCode } = response;
        if (data.code === 401) {
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
          });
		  uni.clearStorage()
          // 可跳转到登录页
          uni.navigateTo({ url: '/pages/login/login' });
          reject('未授权');
        } else if (statusCode === 200) {
          resolve(data);
        } else {
          uni.showToast({
            title: data.msg || '请求出错',
            icon: 'none',
          });
          reject(data);
        }
      },
      fail: (error) => {
        uni.showToast({
          title: '网络错误',
          icon: 'none',
        });
        reject(error);
      },
    });
  });
};

export default request;
export const requestUrl = BASE_URL;
export const socketUrl = SOCKET_URL;

