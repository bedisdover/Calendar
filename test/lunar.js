const startYear = 1900
const endYear = 2050
const lunarInfo = [
  19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970,
  19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343,
  18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800,
  25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536,
  54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423,
  27808, 46416, 86869, 19872, 42448, 83315, 21200, 43432, 59728, 27296,
  44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176,
  38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46496, 103846,
  38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256,
  19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600,
  51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893,
  43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312,
  31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576,
  23200, 30371, 38608, 19415, 19152, 42192, 118966, 53840, 54560, 56645,
  46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448
]
const heavenlyStems = '甲乙丙丁戊己庚辛壬癸'
const earthlyBranches = '子丑寅卯辰巳午未申酉戌亥'
const zodiacList = '鼠牛虎兔龙蛇马羊猴鸡狗猪'
// const solarTerms = ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至']
const num = '日一二三四五六七八九十'
const monthPrefix = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '腊']
const datePrefix = '初十廿卅'
const festival = {
  '0101': '*1元旦节',
  '0214': '情人节',
  '0305': '学雷锋纪念日',
  '0308': '妇女节',
  '0312': '植树节',
  '0315': '消费者权益日',
  '0401': '愚人节',
  '0501': '*1劳动节',
  '0504': '青年节',
  '0601': '国际儿童节',
  '0701': '中国共产党诞辰',
  '0801': '建军节',
  '0910': '中国教师节',
  '1001': '*3国庆节',
  '1224': '平安夜',
  '1225': '圣诞节'
}
const chineseFestival = {
  '0101': '*2春节',
  '0115': '元宵节',
  '0505': '*1端午节',
  '0815': '*1中秋节',
  '0909': '重阳节',
  '1208': '腊八节',
  '1230': '除夕'
}

const prependZero = n => n < 10 ? '0' + n : n

const daysOfMonth = (year, month) => {
  return (lunarInfo[year - startYear] & 0x10000 >> month) ? 30 : 29
}

class SolarDate {
  constructor (date) {
    this.date = date
    this.solarYear = this.format('YYYY')
    this.solarMonth = this.format('M')
    this.solarDate = this.format('d')
    this.solarWeekDay = date.getDay()
    const solarFestival = festival[this.format('MM') + this.format('dd')]
    if (solarFestival) {
      this.solarFestival = solarFestival
      if (/\*(\d)/.test(this.solarFestival)) {
        this.restDays = parseInt(RegExp.$1)
        this.solarFestival = this.solarFestival.replace(/\*\d/, '')
      }
    }
  }

  format (format) {
    const date = this.date

    return format.replace(/dd?d?d?|MM?M?M?|YY?Y?Y?/g,
      str => {
        switch (str) {
          case 'YYYY':
            const year = '000' + date.getFullYear()
            return year.substring(year.length - 4)
          case 'dd':
            return prependZero(date.getDate())
          case 'd':
            return date.getDate().toString()
          case 'MM':
            return prependZero((date.getMonth() + 1))
          case 'M':
            return date.getMonth() + 1
        }
      })
  }
}

class Lunar {
  constructor (date) {
    let daysOfLastYear = 0
    let days = (date - new Date(1900, 0, 31)) / (24 * 60 * 60 * 1000)
    this.dayCyl = days + 40
    this.monCyl = 14
    let year
    for (year = startYear; year < endYear && days > 0; year++) {
      daysOfLastYear = Lunar.daysOfYear(year)
      days -= daysOfLastYear
      this.monCyl += 12
    }
    if (days < 0) {
      days += daysOfLastYear
      year--
      this.monCyl -= 12
    }
    this.year = year
    this.yearCyl = year - 1864

    const leapMonth = Lunar.leapMonth(year)
    this.isLeap = false
    let month
    let temp
    for (month = 1; month < 13 && days > 0; month++) {
      // leap month
      if (leapMonth > 0 && month === (leapMonth + 1) && !this.isLeap) {
        --month
        this.isLeap = true
        temp = Lunar.daysOfLeapMonth(this.year)
      } else {
        temp = daysOfMonth(this.year, month)
      }
      if (this.isLeap && month === (leapMonth + 1)) {
        this.isLeap = false
      }
      days -= temp
      if (!this.isLeap) {
        this.monCyl++
      }
    }

    if (days === 0 && leapMonth > 0 && month === leapMonth + 1) {
      if (this.isLeap) {
        this.isLeap = false
      } else {
        this.isLeap = true
        --month
        --this.monCyl
      }
    }
    if (days < 0) {
      days += temp
      --month
      --this.monCyl
    }
    this.month = month
    this.date = days + 1
  }

  static daysOfYear (year) {
    let sum = 348

    for (let i = 0x8000; i > 8; i >>= 1) {
      // lunar leap year
      const isLeapYear = lunarInfo[year - startYear] & i

      sum += isLeapYear ? 1 : 0
    }

    return sum + Lunar.daysOfLeapMonth(year)
  }

  static daysOfLeapMonth (year) {
    if (Lunar.leapMonth(year)) {
      return (lunarInfo[year - startYear] & 0x10000) ? 30 : 29
    }

    return 0
  }

  static leapMonth (year) {
    return lunarInfo[year - startYear] & 0xf
  }
}

class LunarDate {
  constructor (date) {
    this.date = date
    const lunar = new Lunar(date)
    this.lunarYear = lunar.year
    this.lunarMonth = lunar.month
    this.lunarDate = parseInt(lunar.date)
    this.zodiac = zodiacList.charAt((this.lunarYear - 4) % 12)
    this.lunarIsLeapMonth = lunar.isLeap
    this.lunarMonthInChinese = this.lunarIsLeapMonth
      ? '闰' + monthPrefix[lunar.month - 1]
      : monthPrefix[lunar.month - 1]
    this.lunar = this.lunarDate === 1
      ? this.lunarMonthInChinese + '月'
      : this.lunarDay()
    this.ganzhiYear = LunarDate.cyclical(lunar.yearCyl)
    this.ganzhiMonth = LunarDate.cyclical(lunar.monCyl)
    this.ganzhiDay = LunarDate.cyclical(lunar.dayCyl++)
    let key = this.lunarIsLeapMonth ? '00'
      : prependZero(this.lunarMonth) + prependZero(this.lunarDate)
    const lunarFestival = chineseFestival[key]
    if (lunarFestival) {
      this.lunarFestival = lunarFestival
      if (/\*(\d)/.test(this.lunarFestival)) {
        this.lunarFestival = this.lunarFestival.replace(/\*\d/, '')
      }
    }
  }

  lunarDay () {
    if (this.lunarDate === 10) {
      return '初十'
    }

    if (this.lunarDate === 20) {
      return '二十'
    }

    if (this.lunarDate === 30) {
      return '三十'
    }

    return datePrefix.charAt(Math.floor(this.lunarDate / 10)) +
      num.charAt(this.lunarDate % 10)
  }

  static cyclical (num) {
    return heavenlyStems.charAt(num % 10) + earthlyBranches.charAt(num % 12)
  }
}

const today = new LunarDate(new Date())
console.log(today)
const day = new SolarDate(new Date())
console.log(day)
