A.merge('calendar_new', function () {
  A.setup(function () {
    var T = A.baidu, _this = this, timer1, timer2, dropDown, curDate = _this.data.curDate,
      selectDate = _this.data.selectDate.join('-'), srcid = 6018, data = _this.data.data,
      showHoliday = data.showHoliday, tableBox = _this.find('.op-calendar-new-table-box')[0],
      rightBox = _this.find('.op-calendar-new-right')[0], dropDownBox = _this.find('.op-calendar-new-select-box')[0],
      backTodayBtn = _this.find('.op-calendar-new-backtoday')[0],
      holidayTip = _this.find('.op-calendar-new-holidaytip')[0],
      prevMonth = _this.find('.op-calendar-new-prev-month')[0],
      nextMonth = _this.find('.op-calendar-new-next-month')[0], container = _this.find('.op-calendar-new')[0],
      specialTicket, morespecialTicket, format, ensureDateStr, holidayStyle = 'op-calendar-new-holidaystyle'
    if (ensureDateStr = function (str) {
      return str.split(/-0?/).join('-')
    }, data.ticketDay) {
      if (data.ticketDay[0].net -= 1, data.ticketDay[0].station -= 1, data.specialTicket) {
        specialTicket = {}, $.each(data.specialTicket, function (i, v) {
          specialTicket[v.date] = v.tip
        })
      }
      if (data.morespecialTicket) {
        morespecialTicket = {}, $.each(data.morespecialTicket, function (i, v) {
          morespecialTicket[v.date] = v.net, morespecialTicket[v.date + 'sta'] = v.station
        })
      }
    }
    format = function (str, obj) {
      return str.replace(/#{([^}]+)}/g, function (match, ret) {
        return obj[ret] || ''
      })
    }, A.use('dropdown21', function () {
      A.use('lunar7', function () {
        var lunar = A.ui.lunar, Calendar, dataCache, getDateInfo, setHolidayStyle
        setHolidayStyle = function (flag) {
          var con = $(container)
          con.toggleClass(holidayStyle, !!flag)
        }, getDateInfo = function (date) {
          var ret
          if ('string' === typeof date) ret = date.split(/-0?/), date = new Date(ret[0], ret[1] - 1, ret[2]) else ret = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
          return {
            year: ret[0],
            month: ret[1],
            date: ret[2],
            yearMonth: ret.slice(0, 2).join('-'),
            dateStr: ret.join('-'),
            dateStrZero: [ret[0], ('0' + ret[1]).slice(-2), ('0' + ret[2]).slice(-2)].join('-'),
            Date: date
          }
        }, selectDate = getDateInfo(selectDate), dataCache = {
          init: function () {
            var dataTime = selectDate
            return this.set(data, dataTime.year, dataTime.yearMonth), this
          }, set: function (data, year, yearMonth) {
            var arr = function (obj) {
              return obj || []
            }
            this.setHoliday(arr(data.holidaylist), year), this.setAlmanac(arr(data.almanac), yearMonth), this.setHolidayDateList(arr(data.holiday), yearMonth), this.setMod(arr(data.day), yearMonth)
          }, _holiday: {}, getHoliday: function (year) {
            return this._holiday[year]
          }, setHoliday: function (dataList, year) {
            var ret = {}, i, l, tem
            if (!this._holiday[year]) {
              for (i = 0, l = dataList.length; i < l; i++) ret[dataList[i].name] = {}
              this._holiday[year] = ret
            }
          }, _holidayDateList: {}, _festival: {}, setHolidayDateList: function (holidayList, yearMonth) {
            var ret = {}, year = yearMonth.split('-')[0], tem, i, j, k, l, holidayObj, festivalObj
            if (!this._holidayDateList[yearMonth]) {
              if (!holidayList.length && holidayList.festival) holidayList = [holidayList]
              for (!this._holiday[year] && (this._holiday[year] = {}), !this._festival[year] && (this._festival[year] = {}), i = 0, l = holidayList.length; i < l; i++) {
                if (tem = holidayList[i], holidayObj = this._holiday[year][tem.name] || {}, getDateInfo(tem.festival).year == year) $.extend(holidayObj, tem), this._festival[year][tem.festival] = tem.name
                for (tem = tem.list, j = 0, k = tem.length; j < k; j++) ret[tem[j].date] = tem[j].status, tem[j] = getDateInfo(tem[j].date).dateStrZero
                holidayObj.startday = ensureDateStr(tem.sort()[0])
              }
              this._holidayDateList[yearMonth] = ret
            }
          }, getHolidayDateList: function (yearMonth) {
            return this._holidayDateList[yearMonth]
          }, getFestival: function (year) {
            return this._festival[year]
          }, _almanac: {}, getAlmanac: function (yearMonth) {
            return this._almanac[yearMonth]
          }, setAlmanac: function (dataList, yearMonth) {
            if (!this._almanac[yearMonth]) {
              var list = this._almanac[yearMonth] = {}, i, l
              for (i = 0, l = dataList.length; i < l; i++) {
                list[ensureDateStr(dataList[i].date)] = {
                  suit: dataList[i].suit.replace(/\.$/, '').split('.').slice(0, 15),
                  avoid: dataList[i].avoid.replace(/\.$/, '').split('.').slice(0, 15)
                }
              }
            }
          }, _mod: {}, setMod: function (modList) {
            var mod = this._mod, i, l
            for (i = 0, l = modList.length; i < l; i++) mod[modList[i].date] = modList[i]
          }, getMod: function () {
            return this._mod
          }, getData: function (yearMonth, callback) {
            if (this._almanac[yearMonth]) {
              callback.call(this)
            } else {
              yearMonth = yearMonth.split('-'), this.ajax(yearMonth[0] + '年' + yearMonth[1] + '月', callback, function () {
                return yearMonth.join('-')
              })
            }
          }, getHolidayData: function (year, name, callback) {
            var holiday = this.getHoliday(year)
            if (holiday && holiday[name].festival) {
              callback.call(this)
            } else {
              this.ajax(year + '年' + name, callback, function (data) {
                var holiday = data.holiday, i, l
                if (holiday && !holiday.length) holiday = [holiday]
                for (i = 0, l = holiday.length; i < l; i++) if (holiday[i].name == name) return getDateInfo(holiday[i].festival).yearMonth
              })
            }
          }, ajax: function (query, callback, fn) {
            var self = this
            _this.ajax(query, srcid, {
              success: function (data) {
                var yearMonth
                if (data = data[0] || {}, yearMonth = fn(data), yearMonth) self.set(data, yearMonth.split('-')[0], yearMonth), callback.call(self)
              }
            })
          }
        }.init(), Calendar = function (curDate, container, holidayTip) {
          var date, month, year, RESTClass = 'op-calendar-new-table-rest', WORKClass = 'op-calendar-new-table-work',
            WEEKENDClass = 'op-calendar-new-table-weekend', FESTIVALClass = 'op-calendar-new-table-festival',
            TODAYClass = 'op-calendar-new-table-today', OTHERMONTHClass = 'op-calendar-new-table-other-month',
            SELECTEDClass = 'op-calendar-new-table-selected', TODAYBORDERClass = 'op-calendar-new-table-border',
            doubleDate, showTicket, buildTable, countDate, setCurDate, showLunar, selectedObj, setDate,
            monthChangeEvent = function () {
            }, selectClass, cutWord, toggleHolidayTip, weekWord = '<tr>{一}{二}{三}{四}{五}{!六}{!日}</tr>', oneDay = 864e5
          return weekWord = weekWord.replace(/\{\!?|\}/g, function (match) {
            return '{' == match ? '<th>' : '{!' == match ? '<th class="' + WEEKENDClass + '">' : '</th>'
          }), doubleDate = function (str) {
            return ('0' + str).slice(-2)
          }, cutWord = function (str, len) {
            for (var count = i = 0, code; str.charCodeAt(i);) {
              if (code = str.charCodeAt(i) > 255 ? 2 : 1, code + count > len) return str.slice(0, --i) + '...'
              count += code, i++
            }
            return str.slice(0, i)
          }, setCurDate = function (dateObj) {
            year = dateObj.year, month = dateObj.month, date = dateObj.date
          }, curDate = ensureDateStr(curDate), showLunar = function (dateInfo) {
            var date = dateInfo.Date, lunarInfo = lunar(date), buildAlmanacInfo,
              mod = dataCache.getMod()[dateInfo.dateStr] || {},
              almanacInfo = dataCache.getAlmanac(dateInfo.yearMonth) || {}, info = almanacInfo[dateInfo.dateStr] || {},
              almanacBox, suit = info.suit || [], avoid = info.avoid || [],
              tpl = '<p class="op-calendar-new-right-date">#{date}</p>                            <p class="op-calendar-new-right-day">#{day}</p>                            <p class="op-calendar-new-right-lunar c-gap-top-small">                              <span>#{lunarMonth}</span><span>#{lunarYear}</span><span>#{lunarDate}</span>                            </p>',
              almanacTpl = '<div class="op-calendar-new-right-almanacbox">                              <p class="op-calendar-new-right-almanac c-clearfix">                                <span class="op-calendar-new-right-suit"><i>宜</i>#{suit}</span>                                <span class="op-calendar-new-right-avoid"><i>忌</i>#{avoid}</span>                              </p>                              <p class="op-calendar-hover-almanac">                                <span class="op-calendar-almanac-arrow">◆</span>                                <span class="op-calendar-hover-suit"><i>宜</i>#{suitAll}</span>                                <span class="op-calendar-hover-avoid c-gap-top"><i>忌</i>#{avoidAll}</span>                              </p>                            </div>',
              rightHtml
            if (buildAlmanacInfo = function (arr, length) {
              return arr && arr.length ? arr.slice(0, length).join('<br />') : ''
            }, rightHtml = format(tpl, {
              date: dateInfo.dateStrZero + ' 星期' + lunarInfo.cnDay,
              day: dateInfo.date,
              lunarMonth: mod.lunarmonth || lunarInfo.lMonth.replace('十二', '腊') + '月' + lunarInfo.lDate,
              lunarYear: mod.lunaryear || lunarInfo.gzYear + '年 【' + lunarInfo.animal + '年】',
              lunarDate: mod.lunardate || lunarInfo.gzMonth + '月 ' + lunarInfo.gzDate + '日'
            }), data.showTicket) {
              return rightHtml += showTicket(dateInfo), rightBox.innerHTML = rightHtml, void 0
            }
            if (rightHtml += format(almanacTpl, {
              suit: buildAlmanacInfo(suit, 5),
              avoid: buildAlmanacInfo(avoid, 5),
              suitAll: suit.join('、'),
              avoidAll: avoid.join('、')
            }), rightBox.innerHTML = rightHtml, suit.length + avoid.length > 0) {
              almanacBox = _this.find('.op-calendar-new-right-almanacbox'), almanacBox.on('mouseover', function () {
                clearTimeout(timer1), timer1 = setTimeout(function () {
                  almanacBox.addClass('op-calendar-new-right-hover')
                }, 300)
              }), almanacBox.on('mouseout', function () {
                clearTimeout(timer1), timer1 = setTimeout(function () {
                  almanacBox.removeClass('op-calendar-new-right-hover')
                }, 100)
              })
            }
          }, showTicket = function (dateInfo) {
            var tpl = '<div class="op-calendar-new-right-ticket c-gap-top" #{advertBg}>                        <p>                        <strong>电话和网络订票：</strong>                        <span class="op-calendar-new-right-ticketDay">可预订#{netTicketDay}车票</span>                        <span class="op-calendar-new-right-ticketLunar">农历#{netLunar}</span>                        </p>                        <p class="op-calendar-new-right-ticketstat">                        <strong>车站代售点订票：</strong>                        <span class="op-calendar-new-right-ticketDay">可预订#{statTicketDay}车票</span>                        <span class="op-calendar-new-right-ticketLunar">农历#{statLunar}</span>                        </p>                        #{advertAnchor}',
              time = data.ticketDay[0], now = dateInfo.Date, n_net = time.net, n_station = time.station
            if (morespecialTicket && dateInfo.dateStr in morespecialTicket) n_net = morespecialTicket[dateInfo.dateStr] - 1, n_station = morespecialTicket[dateInfo.dateStr + 'sta'] - 1
            if (netTime = new Date(now.getTime() + oneDay * n_net), netLunar = lunar(netTime), statTime = new Date(now.getTime() + oneDay * n_station), statLunar = lunar(statTime), advertBg = '', advertAnchor = '', data.advert) advertBg = 'style="background:url(' + data.advert[0].img + ') no-repeat bottom center;"', advertAnchor = '<a href="' + data.advert[0].url + '" target="_blank" class="op-calendar-new-ticket-advert"></a>'
            return format(tpl, {
              netTicketDay: '<b>' + doubleDate(netTime.getMonth() + 1) + '</b>月<b>' + doubleDate(netTime.getDate()) + '</b>日',
              netLunar: netLunar.lMonth.replace('十二', '腊') + '月' + netLunar.lDate,
              statTicketDay: '<b>' + doubleDate(statTime.getMonth() + 1) + '</b>月<b>' + doubleDate(statTime.getDate()) + '</b>日',
              statLunar: statLunar.lMonth.replace('十二', '腊') + '月' + statLunar.lDate,
              advertBg: advertBg,
              advertAnchor: advertAnchor
            })
          }, buildTable = function (startDate, endDate, selectedDate) {
            var ret = [], holidayList = dataCache.getHolidayDateList(getDateInfo(selectedDate).yearMonth),
              modList = dataCache.getMod(), flag = 1, tableClass = '', mod, classname, dateObj, almanac, festival, rest,
              tdTpl, tableWord, ticketTime = '', ticketBlue = '', temDate, cutTableWord
            if ((endDate - startDate) / oneDay < 28) endDate = new Date(endDate.getTime() + 7 * oneDay)
            for (tdTpl = '<td>                                  <div class="op-calendar-new-relative">                                    <a href="javascript:;" #{title} data-click="{fm:\'beha\'}" hidefocus="true" class="#{classname}" date="#{date}">                                      #{rest}                                      <span class="op-calendar-new-daynumber">#{day}</span>                                      <span class="op-calendar-new-table-almanac">#{almanac}</span>                                      <span class="op-calendar-new-table-ticket #{ticketBlue}">#{ticketTime}</span>                                    </a>                                  </div>                                </td>'; startDate.getTime() <= endDate.getTime() + 36e5 && !(flag > 42);) {
              var tmpDate = new Date(startDate.getTime() + 288e5)
              if (dateObj = getDateInfo(tmpDate), classname = [], rest = '', ticketBlue = '', ticketTime = '', almanac = lunar(startDate), festival = almanac.festival(), mod = modList[dateObj.dateStr] || {}, holidayList[dateObj.dateStr]) {
                if (rest = '<span class="op-calendar-new-table-holiday-sign">#{text}</span>', '1' == holidayList[dateObj.dateStr]) {
                  classname.push(RESTClass), rest = format(rest, { text: '休' })
                } else if ('2' == holidayList[dateObj.dateStr]) classname.push(WORKClass), rest = format(rest, { text: '班' }) else classname.push(RESTClass), rest = ''
              }
              if ((flag + 1) % 7 == 0 || flag % 7 == 0) classname.push(WEEKENDClass)
              if (festival.length || almanac.term || mod.red && '1' == mod.red) classname.push(FESTIVALClass)
              if (dateObj.dateStr == curDate) if (holidayList[dateObj.dateStr]) classname.push(TODAYBORDERClass) else classname.push(TODAYClass)
              if (dateObj.month != month) classname.push(OTHERMONTHClass)
              if (dateObj.dateStr == selectedDate) classname.push(SELECTEDClass)
              if (flag % 7 == 1 && ret.push('<tr>'), tableWord = mod.tableword || (festival.length ? festival[0].desc.replace(/国际|世界/, '') : almanac.term || almanac.lDate), cutTableWord = cutWord(tableWord, 8), data.ticketDay && (dateObj.Date > getDateInfo(curDate).Date || dateObj.dateStr == curDate)) {
                var timerLine = data.ticketDay[0].net
                if (morespecialTicket && dateObj.dateStr in morespecialTicket) timerLine = morespecialTicket[dateObj.dateStr] - 1
                if (temDate = new Date(dateObj.Date.getTime() + oneDay * timerLine), ticketTime = '票 ' + [doubleDate(temDate.getMonth() + 1), doubleDate(temDate.getDate())].join('.'), ticketBlue = 'op-calendar-new-ticket-blue', specialTicket && dateObj.dateStr in specialTicket) ticketTime = '票 ' + specialTicket[dateObj.dateStr], ticketBlue = 'op-calendar-new-ticket-yellow'
              }
              ret.push(format(tdTpl, {
                classname: classname.join(' '),
                day: dateObj.date,
                almanac: cutTableWord,
                date: dateObj.dateStr,
                rest: rest,
                title: cutTableWord == tableWord ? '' : ' title="' + tableWord + '"',
                ticketTime: ticketTime,
                ticketBlue: ticketBlue
              })), flag % 7 == 0 && ret.push('</tr>'), startDate = new Date(oneDay + startDate.getTime()), flag++
            }
            if (flag > 36) tableClass = ' op-calendar-new-table-six'
            return '<table class="op-calendar-new-table' + tableClass + '">' + weekWord + ret.join('') + '</table>'
          }, countDate = function (date, holiday) {
            var first, last, i, l
            if (first = new Date(date.getFullYear(), date.getMonth(), 1), last = new Date(date.getFullYear(), date.getMonth() + 1, 1), last = new Date(last.getTime() - oneDay), holiday) first = getDateInfo(holiday).Date, last = new Date(first.getTime() + 28 * oneDay)
            return {
              startDate: new Date(first.getTime() - oneDay * ((0 == first.getDay() ? 7 : first.getDay()) - 1)),
              endDate: new Date(last.getTime() + oneDay * (7 - (0 == last.getDay() ? 7 : last.getDay())))
            }
          }, setDate = function (dateStr, holiday) {
            var dateObj = getDateInfo(dateStr), oldDate = getDateInfo([year, month, date].join('-')), dater, festival,
              festivalName
            dataCache.getData(dateObj.yearMonth, function () {
              if (festival = dataCache.getFestival(dateObj.year), festivalName = festival[dateObj.dateStr] || null, dateObj.year != year || dateObj.month != month) dater = countDate(dateObj.Date, holiday), setCurDate(dateObj), container.innerHTML = buildTable(dater.startDate, dater.endDate, dateStr), selectedObj = _this.find('.' + SELECTEDClass)[0], monthChangeEvent(dateObj, oldDate, holiday)
              setCurDate(dateObj), setHolidayStyle(festivalName), showLunar(dateObj), toggleHolidayTip(dataCache.getHoliday(year)[festivalName])
            })
          }, toggleHolidayTip = function (obj) {
            var tpl
            if (!obj || !obj.desc && !obj.rest) {
              holidayTip.style.display = 'none'
            } else {
              tpl = '<span class="op-calendar-new-holidaytip-icon">○<i>!</i></span>                            	<p>#{desc}</p>                            	<p>#{rest}</p>                            </span>', holidayTip.style.display = 'block', holidayTip.innerHTML = format(tpl, {
                desc: obj.desc,
                rest: obj.rest
              })
            }
          }, $(container).delegate('a', 'click', function (e) {
            e.preventDefault(), selectClass(this), setDate(this.getAttribute('date'))
          }), selectClass = function (obj) {
            selectedObj && $(selectedObj).removeClass(SELECTEDClass), obj && $(obj).addClass(SELECTEDClass), selectedObj = _this.find('.' + SELECTEDClass)[0]
          }, {
            getDate: function () {
              return getDateInfo([year, month, date].join('-'))
            }, nextMonth: function () {
              var nextMonthDaynum, curDate = this.getDate(), nnMonth, nDays, newDate, date
              nnMonth = new Date(curDate.year, parseInt(curDate.month, 10) + 1, 1), nDays = new Date(nnMonth - oneDay).getDate(), date = curDate.date < nDays ? curDate.date : nDays, newDate = getDateInfo(new Date(curDate.year, curDate.month, date)), this.setDate(newDate.dateStr)
            }, prevMonth: function () {
              var nDays, curDate = this.getDate(), newDate, date
              nDays = new Date(new Date(curDate.year, curDate.month - 1, 1) - oneDay).getDate(), newDate = getDateInfo(new Date(curDate.year, curDate.month - 2, curDate.date < nDays ? curDate.date : nDays)), this.setDate(newDate.dateStr)
            }, set: function (name, value) {
              var curDate = this.getDate(), newDate
              if (curDate[name] = value, newDate = getDateInfo([curDate.year, curDate.month, curDate.date].join('-')), newDate.Date.getDate() != newDate.date) newDate = { dateStr: newDate.yearMonth + '-1' }
              return setDate(newDate.dateStr), this
            }, setDate: function (dateStr) {
              return setDate(dateStr), this
            }, setHoliday: function (name, year) {
              var self = this
              dataCache.getHolidayData(year, name, function () {
                var holiday = this.getHoliday(year)[name]
                if (!holiday) return self.setHoliday(name, getDateInfo(curDate).year), void 0 else return month = null, setDate(ensureDateStr(holiday.festival), ensureDateStr(holiday.startday), true), toggleHolidayTip(holiday), void 0
              })
            }, backToday: function () {
              var evt = window.event || {}
              return evt.returnValue = false, month = null, this.setDate(curDate), this
            }, addMonthChangeEvent: function (fn, newDate, oldDate) {
              var self = this
              if ('function' == typeof fn) {
                monthChangeEvent = function (newDate, oldDate, holiday) {
                  fn.call(self, newDate, oldDate, holiday)
                }
              }
              return this
            }
          }
        }, function () {
          var calendar = Calendar(curDate, tableBox, holidayTip), curYear = getDateInfo(curDate).year,
            curHoliday = dataCache.getHoliday(selectDate.year), defaultHoliday = showHoliday,
            defaultHolidayObj = curHoliday[defaultHoliday]
          dropDown = A.ui.dropdown21
          var initDropDown, buildSelectHtml, yearOnOpen, isFirstOpen, yearBox, yearMenu,
            defaultHolidaySelect = { value: 'default', text: '假期安排', selected: 1 }, resetHoliday, holidayChange,
            yearSelect, monthSelect, holidaySelect
          if (defaultHoliday) calendar.setHoliday(defaultHoliday, getDateInfo(defaultHolidayObj.festival).year, defaultHolidayObj.startday) else calendar.setDate(selectDate.dateStr)
          initDropDown = function (data, defaultValue, box, onchange, onopen) {
            var i, l, cache = []
            if ('[object Array]' != Object.prototype.toString.call(data)) {
              for (i = data.min; i <= data.max; i++) {
                cache.push({
                  value: i,
                  text: i + data.unit,
                  selected: i == defaultValue
                })
              }
            } else {
              cache = data
            }
            return dropDown(cache, {
              appendTo: _this.find('.' + box)[0],
              number: 12,
              onchange: onchange,
              onopen: onopen
            })
          }, yearOnOpen = function (obj) {
            var index, menuInner
            if (!isFirstOpen) {
              if (isFirstOpen = true, index = obj.index, 0 != index) {
                menuInner = $('.c-dropdown2-menu-inner', yearBox)[0], menuInner.scrollTop = 0, timer2 = setInterval(function () {
                  var scrollBar
                  if (0 != menuInner.scrollTop && $(menuInner).hasClass('opui-scroll-ctrl-content')) {
                    clearInterval(timer2), scrollBar = $('.opui-scroll-ctrl-scroll', menuInner.parentNode)[0], timer2 = setInterval(function () {
                      if ('' != scrollBar.style.cssText) menuInner.scrollTop = 26 * index, clearInterval(timer2)
                    }, 10)
                  }
                }, 10)
              }
            }
          }, yearSelect = initDropDown({
            min: 1900,
            max: 2050,
            unit: '年'
          }, selectDate.year, 'op-calendar-new-year-box', function (obj) {
            calendar.set('year', obj.item.value)
          }, yearOnOpen), yearBox = _this.find('.op-calendar-new-year-box')[0], yearMenu = $('.c-dropdown2-menu', yearBox)[0], yearMenu.style.left = '-9999px', yearSelect.open(), yearSelect.close(), yearMenu.style.left = '0', monthSelect = initDropDown({
            min: 1,
            max: 12,
            unit: '月'
          }, selectDate.month, 'op-calendar-new-month-box', function (obj) {
            calendar.set('month', obj.item.value)
          }), holidayChange = function (obj) {
            var value = obj.item.value
            if ('default' != value) calendar.setHoliday(value, yearSelect.getValue())
          }, holidaySelect = initDropDown([defaultHolidaySelect], 'default', 'op-calendar-new-holiday-box', holidayChange), resetHoliday = function (holidayList) {
            holidaySelect.removeAll(), holidaySelect.add(defaultHolidaySelect)
            for (var name in holidayList) {
              if (holidayList.hasOwnProperty(name)) {
                holidaySelect.add({
                  value: name,
                  text: name
                })
              }
            }
          }, resetHoliday(curHoliday), holidaySelect.setValue(defaultHoliday), dropDownBox.style.visibility = 'visible', calendar.addMonthChangeEvent(function (newDate, oldDate, holiday) {
            var date = this.getDate(), yearLength = yearSelect.getLength()
            if (monthSelect.setIndex(date.month - 1), date.year - 1900 > yearLength - 1) {
              yearSelect.add({
                value: yearLength + 1900,
                text: yearLength + 1900 + '年'
              })
            }
            if (yearSelect.setIndex(date.year - 1900), !holiday) holidaySelect.setIndex(0)
            if (newDate.year != oldDate.year) resetHoliday(dataCache.getHoliday(newDate.year))
          }), $(backTodayBtn).click(function () {
            calendar.backToday()
          }), $(nextMonth).click(function () {
            calendar.nextMonth()
          }), $(prevMonth).click(function () {
            calendar.prevMonth()
          })
        }()
      })
    }), this.dispose = function () {
      clearTimeout(timer1), clearInterval(timer2), dropDown && dropDown.dispose && dropDown.dispose()
    }
  })
})
A.merge('bk_polysemy', function () {
  A.setup(function () {
    var _this = this, $focusrightf = _this.find('.op-bk-polysemy-focusrightf:first span')
    if ($focusrightf.length) $focusrightf.last().remove()
  })
})
A.merge('right_recommends_merge', function () {
  A.setup(function () {
    function bindLayers ($btns, a) {
      if (bds.se && bds.se.tip) {
        $.each($btns, function (i, v) {
          var $v = $(v), $parent = $v.parents('.opr-recommends-merge-item'),
            $layer = $parent.find('.opr-recommends-merge-layer-p'),
            $contentHtml = $layer.find('.opr-recommends-merge-layer'), x = getX($v)
          $.each($contentHtml.find('img'), function (i, v) {
            var $v = $(v)
            if ($v.attr('data-img')) $v.attr('src', $v.attr('data-img'))
          })
          var tip = new bds.se.tip({
            target: v,
            align: 'right',
            content: $contentHtml,
            arrow: { offset: x },
            offset: { x: x, y: 25 }
          })
          obj.push({ dom: v, tip: tip })
        })
      }
    }

    var _this = this, $layerbtns = _this.find('.opr-recommends-merge-layerbtn'),
      $moreBtn = _this.find('.opr-recommends-merge-more-btn'), $dodgeBtn = _this.find('.opr-recommends-merge-dodge'),
      $dodgeTip = _this.find('.opr-recommends-merge-dodge-tip'), $content = _this.find('.opr-recommends-merge-content'),
      obj = [], pageFormat = bds.comm.containerSize, showType = _this.data.showType, getX = function ($o) {
        $o = $($o)
        var $container = $(_this.container),
          x = $container.width() - ($o.offset().left - $container.offset().left) - $o.width(), maxX = 185
        if (x < 0) x = 0 else if (x > maxX) x = maxX
        return x
      }
    if ($dodgeBtn[0] && function () {
      $dodgeBtn.click(function () {
        var $this = $(this)
        if ($content.toggle(), '隐藏信息' == $this.html()) {
          if ('1' == showType) $.setCookie('BD_CON_LEVEL', '1', { expires: 15552e6 }) else $.removeCookie('BD_CON_LEVEL')
          $this.html('继续浏览'), $dodgeTip.html('以下图片可能让您感觉不适，您可以')
        } else {
          if ($this.html('隐藏信息'), '1' == showType) $.removeCookie('BD_CON_LEVEL') else $.setCookie('BD_CON_LEVEL', '1', { expires: 15552e6 })
          $dodgeTip.html('如果以下图片让您感觉不适，您可以')
        }
      })
    }(), 'pc' == _this.data.platform) {
      bds.event.on('se.window_resize', function () {
        if (bds.comm.containerSize !== pageFormat) {
          pageFormat = bds.comm.containerSize, $.each(obj, function (i, v) {
            var tip = v.tip, _x = getX(v.dom)
            tip.setOffset({ x: _x }), tip.setArrow({ offset: _x })
          })
        }
      }), bds.event.on('se.api_tip_ready', function () {
        bindLayers($layerbtns)
      }), bindLayers($layerbtns)
    }
    $moreBtn.on('click', function () {
      var $this = $(this), dom_this = $this[0]
      if ($moreTxt = $this.find('span'), $moreIcon = $this.find('.c-icon'), $panel = $this.parent().next('.opr-recommends-merge-panel'), !dom_this.moreLists && (dom_this.moreLists = []), $this.hasClass('opr-recommends-merge-close')) {
        $moreTxt.text('展开'), $moreIcon.removeClass('c-icon-chevron-top').addClass('c-icon-chevron-bottom'), $(dom_this.moreLists).hide()
      } else if ($moreTxt.text('收起'), $moreIcon.addClass('c-icon-chevron-top').removeClass('c-icon-chevron-bottom'), !dom_this.moreLists.length) {
        var $textarea = $panel.find('.opr-recommends-merge-more-textarea'), $moreLayerBtns = []
        $panel.append($textarea.val()), $textarea.remove(), dom_this.moreLists = $panel.find('.opr-recommends-merge-morelists'), $moreLayerBtns = dom_this.moreLists.find('.opr-recommends-merge-layerbtn')
        var $_imgs = dom_this.moreLists.find('.opr-recommends-merge-img')
        $.each($_imgs, function (i, v) {
          var $v = $(v)
          $v.attr('src', $v.attr('data-img'))
        })
        var $_imgsB = dom_this.moreLists.find('.opr-recommends-merge-imgtext')
        if ($_imgsB.parent().remove(), 'pc' == _this.data.platform) {
          bds.event.on('se.api_tip_ready', function () {
            bindLayers($moreLayerBtns)
          }), bindLayers($moreLayerBtns, 1)
        }
      } else {
        $(dom_this.moreLists).show()
      }
      $this.toggleClass('opr-recommends-merge-close')
    })
    var $userIcon = _this.find('.opr-recommends-merge-user-layer-icon'),
      $layerCon = _this.find('.opr-recommends-merge-user-layer-con'),
      $layerp1 = _this.find('.opr-recommends-merge-user-layer-p1'),
      $layerp2 = _this.find('.opr-recommends-merge-user-layer-p2')
    $layerCon.on('click', function (e) {
      e.preventDefault()
    }), $userIcon.hover(function () {
      $layerCon.removeClass('opr-recommends-merge-user-layer-hide'), ns_c && ns_c({
        item: 'right_recommends_merge',
        act: 'user_hover',
        qid: bds.comm.qid
      })
    }, function () {
      $layerCon.addClass('opr-recommends-merge-user-layer-hide')
    }), $userIcon.on('click', function (e) {
      e.preventDefault()
    }), $layerCon.hover(function () {
      $layerCon.removeClass('opr-recommends-merge-user-layer-hide')
    }, function () {
      $layerCon.addClass('opr-recommends-merge-user-layer-hide')
    })
    var userLayerTimer
    $layerCon.find('button').on('click', function () {
      $layerp1.remove(), $layerCon.find('button').remove(), $layerp2.text('感谢您的反馈'), userLayerTimer = setTimeout(function () {
        $userIcon.hide(), $layerCon.css('z-index', '999'), $layerCon.fadeOut()
      }, 600)
    }), _this.dispose = function () {
      userLayerTimer && clearTimeout(userLayerTimer), $layerCon.stop()
    }
  })
})
A.merge('right_toplist1', function () {
  A.setup(function () {
    var _this = this, $tb = _this.find('tbody'), $refresh = _this.find('.opr-toplist1-refresh'),
      $a = _this.find('.FYB_RD tbody a'), currentPage = 0
    if (_this.data.num > 0) {
      $refresh.on('click', function (e) {
        if (currentPage < _this.data.num - 1) ++currentPage else currentPage = 0
        $tb.hide(), $tb.eq(currentPage).show(), e.preventDefault()
      })
    }
    $a.each(function (i) {
      $a.eq(i).attr('href', $a.eq(i).attr('href') + '&rqid=' + window.bds.comm.qid)
    })
    var pn = 15, reRender = function () {
      var $tr = _this.find('tr'), reg = new RegExp('(^|&)rsf=([^&]*)', 'i')
      $tb.each(function (i) {
        $tb.eq(i).html($tr.slice(i * pn, Math.min((i + 1) * pn), $tr.length - i * pn))
      }), _this.data.num = Math.ceil($tr.length / pn), $a.each(function (i) {
        var new_href = $a.eq(i).attr('href').replace(reg, function (value) {
          var valueArr = value.slice(5).split('_')
          if (valueArr[3] % 15 == 0) valueArr[1] = valueArr[3] - 14, valueArr[2] = valueArr[3]; else if (valueArr[1] = valueArr[3] - valueArr[3] % 15 + 1, valueArr[2] = valueArr[3] - valueArr[3] % 15 + 15, valueArr[2] > $a.length) valueArr[2] = $a.length;
          return "&rsf=" + valueArr.join("_")
        });
        $a.eq(i).attr("href", new_href)
      })
    };
    $(window).on("swap_end", function (e, cacheItem) {
      if (1 === $("#con-ar").children(".result-op").length) reRender()
    })
  });
});
bds.comm.resultPage = 1;
bds._base64 = {
  domain: "https://ss0.bdstatic.com/9uN1bjq8AAUYm2zgoY3K/",
  b64Exp: -1,
  pdc: 0
};
if (bds.comm.supportis) {
  window.__restart_confirm_timeout = true;
  window.__confirm_timeout = 8000;
  window.__disable_is_guide = true;
  window.__disable_swap_to_empty = true;
}
initPreload({
  'isui': true,
  'index_form': "#form",
  'index_kw': "#kw",
  'result_form': "#form",
  'result_kw': "#kw"
});

