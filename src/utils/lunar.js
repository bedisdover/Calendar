import lunar from '~static/lunar'
import moment from './configMoment'

const cache = {}

const offsetText = {
  '-1': '昨天',
  0: '今天',
  1: '明天'
}

export default date => {
  if (cache.date) {
    return cache.date
  }

  if (typeof date === 'string' && date.length === 10) {
    date += ' 00:00:00'
  }

  const lunarInfo = lunar(date)

  const d = new Date(date)
  const offset = parseInt((d - moment().startOf('day')) / 24 / 60 / 60 / 1000)
  if (offsetText[offset]) {
    lunarInfo.offset = offsetText[offset]
  } else {
    lunarInfo.offset = Math.abs(offset) + '天' + (offset > 0 ? '后' : '前')
  }

  lunarInfo.solarDateText = d.getMonth() + 1 + '月' +
    d.getDate() + '日'
  lunarInfo.lunarDateText = `${lunarInfo['lMonth']}月${lunarInfo['lDate']}`
  lunarInfo.gzText = lunarInfo['gzYear'] +
    '[' + lunarInfo['animal'] + ']年  ' +
    lunarInfo['gzMonth'] + '月  ' +
    lunarInfo['gzDate'] + '日'
  lunarInfo.festival = lunarInfo.festival()

  // if (lunarInfo.festival[0] &&
  // (lunarInfo.festival[0].type === 'a' || lunarInfo.festival[0].type === 'i')) {
  // lunarInfo.lDate =
  // }

  cache[date] = lunarInfo

  return lunarInfo
}
