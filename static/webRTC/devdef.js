
// m_nHasAudioIn  = fundef & 0x01;
//m_nHasAudioOut = fundef & 0x02;
function isDevSupportSd(strSeries)
{
  var fundef =parseInt (strSeries.substring(strSeries.length - 2, strSeries.length),16);
  var HasSd       = fundef & 0x04;
  if(HasSd!=0)
      return true;
  return false;
}

//暂且这样定义

/**
*是否支持音频
**/
function isDevSupAudio(strSeries)
{
  //  m_nHasAudioIn  = fundef & 0x01;
  //  m_nHasAudioOut = fundef & 0x02;
  var fundef =parseInt (strSeries.substring(strSeries.length - 2, strSeries.length),16);
  var HasAudioIn  = fundef & 0x01;
  var HasAudioOut = fundef & 0x02;
  if(HasAudioIn!=0 && HasAudioOut!=0)
      return true;
  return false;
}


/***
*是否支持蜂窝移动
***/
function isDevSupCellNet(strSeries)
{
    var fundef = parseInt (strSeries.substring(strSeries.length - 2, strSeries.length),16);
    var HasSd  = fundef & 0x40;
    if(HasSd!=0)
        return true;
    return false;
}

//是否支持wifi
function isDevSupWifi(strSeries)
{
    var fundef = parseInt (strSeries.substring(strSeries.length - 2, strSeries.length),16);
    var HasSd  = fundef & 0x38;
    if(HasSd!=0)
        return true;
    return false;
}
//是否支持GPS
function isDevSupGps(strSeries)
{
    var fundef = parseInt (strSeries.substring(strSeries.length - 2, strSeries.length),16);
    var HasSd  = fundef & 0x80;
    if(HasSd!=0)
        return true;
    return false;
}

//是否支持ptz云台控制
function isSupPtzCtl(strSeries)
{
	//
    var fundef = parseInt(strSeries.substring(strSeries.length - 4, strSeries.length-2),16);
    //云台是否支持
    var nHasCloudCtl = fundef & 0x01;
    if(nHasCloudCtl!=0)
         return true;
    return false;
}

function GetDevSupAf(strSeries)
{
    var af = parseInt(strSeries.substring(strSeries.length - 5, strSeries.length- 4),16);
    return af;
}