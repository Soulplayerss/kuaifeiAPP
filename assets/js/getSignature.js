import md5 from './md5'

var uuid = '6763c5921f96978377583672'
// 安卓
 var appkey = 'd2b66ca4998f1bcedbff6dd62c87c622'
 var appsecret = '47800faad9614c80893112faedc3c5c5'
 var moveCard = 5
// ios
// var appkey = 'd2b66ca4998f1bcedbff6dd62c87c622'
// var appsecret = '47800faad9614c80893112faedc3c5c5'
// var moveCard = 5

function Signature() {

};

// 获取计数器
function getCounter() {
	let counter = 1;
	++counter;
	if (counter < 10) return '00000' + counter;
	else if (counter < 100) return '0000' + counter;
	else if (counter < 1000) return '000' + counter;
	else if (counter < 10000) return '00' + counter;
	else if (counter < 100000) return '0' + counter;
	else if (counter < 1000000) return counter;
	else {
		counter = 1;
		return '00000' + counter;
	}
};

function generateTimestamp() {
	return getCounter() + new Date().getTime().toString();
}

var timeMillis = generateTimestamp()

Signature.fnGetSignature = function() {
	var encryptStr = uuid + appkey + appsecret + timeMillis;
	var arrEncrypt = Signature.fnStr2Byte(encryptStr);
	var arrEncrypt_change = Signature.fnChange(encryptStr, moveCard);
	var arrMerge = Signature.fnMerge(arrEncrypt, arrEncrypt_change);
	return md5.hex(arrMerge);
}


Signature.fnChange = function(encryptStr, moveCard) {
	var arrEncrypt = Signature.fnStr2Byte(encryptStr);
	var len = arrEncrypt.length;
	for (var idx = 0; idx < len; ++idx) {
		var tmp = ((idx % moveCard) > ((len - idx) % moveCard)) ? arrEncrypt[idx] : arrEncrypt[len - (idx + 1)];
		arrEncrypt[idx] = arrEncrypt[len - (idx + 1)];
		arrEncrypt[len - (idx + 1)] = tmp;
	}
	return arrEncrypt;
}

Signature.fnStr2Byte = function(str) {
	let bytes = new Array();
	let length = str.length;
	let char;

	for (let i = 0; i < length; i++) {
		char = str.charCodeAt(i);
		if (char >= 0x010000 && char <= 0x10FFFF) {
			bytes.push(((char >> 18) & 0x07) | 0xF0);
			bytes.push(((char >> 12) & 0x3F) | 0x80);
			bytes.push(((char >> 6) & 0x3F) | 0x80);
			bytes.push((char & 0x3F) | 0x80);
		} else if (char >= 0x000800 && char <= 0x00FFFF) {
			bytes.push(((char >> 12) & 0x0F) | 0xE0);
			bytes.push(((char >> 6) & 0x3F) | 0x80);
			bytes.push((char & 0x3F) | 0x80);
		} else if (char >= 0x000080 && char <= 0x0007FF) {
			bytes.push(((char >> 6) & 0x1F) | 0xC0);
			bytes.push((char & 0x3F) | 0x80);
		} else {
			bytes.push(char & 0xFF);
		}
	}
	return bytes;
}

Signature.fnByte2Str = function(byte) {
	return byte.map(function(x) {
		x = x.toString(16);
		x = ('00' + x).substr(-2);
		return x
	}).join('');
}

Signature.fnMerge = function(encryptByte, changeByte) {
	let length = encryptByte.length;
	let doubleLength = length * 2;
	let temp = new Array(doubleLength);

	for (let i = 0; i < length; i++) {
		temp[i] = encryptByte[i];
		temp[doubleLength - 1 - i] = changeByte[i];
	}

	return temp;
}

export const fnGetSignature = Signature.fnGetSignature()
export const generateTime = timeMillis