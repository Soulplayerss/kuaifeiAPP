const BASE_URL = 'https://73090400.r32.cpolar.top';
const request = (url, method = 'GET', data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
	var token = ''
	uni.getStorage({
		key: 'Token',
		success(res) {
			token = res.data
		}
	})
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
		console.log(data)
        if (data.code === 401) {
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
          });
		  uni.clearStorage()
          // 可跳转到登录页
          uni.navigateTo({ url: '/pages/login/login' });
          reject('未授权');
        } else if (statusCode >= 200 && statusCode < 300) {
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

