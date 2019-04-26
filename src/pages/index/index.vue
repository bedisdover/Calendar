<template>
  <div class="container">
    <header>
      <div>
        <div class="date">3月31日</div>
        <div class="extra">2019 5天后</div>
      </div>
      <div class="operation">
        <span class="iconfont icon-plus" @click="add"></span>
        <span class="iconfont icon-list" @click="list"></span>
      </div>
    </header>

    <div class="calendar">
      <div class="days-container">
        <span v-for="(day, index) in days" :key="index" class="day">{{ day }}</span>
      </div>

      <swiper
        :circular="true"
        :class="mode"
        :current="weekIndex"
        @change="handleSlideWeek">
        <swiper-item v-for="(week, index) in weeks" :key="index">
          <div class="date-container">
            <div
              v-for="(date, $index) in week"
              :key="$index"
              class="date"
              @click="handleClick"
              :data-date="date.value"
              :class="{
                  current: date.value === currentDate,
                  today: date.value === today
                }">
              <span class="text">{{ date.text }}</span>
              <span class="lunar">{{ date.lDate }}</span>
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>

    <swiper
      :circular="true"
      :current="contentIndex"
      class="content"
      @change="handleSlideContent">
      <swiper-item v-for="(content, index) in contentList" :key="index">
        <scroll-view
          scroll-y
          @scrolltoupper="upper"
          @scroll="scroll"
        >
          <section class="lunar">
            <div class="solar-date">
              {{content['lunar']['solarDateText']}}
              <span class="offset">{{content['lunar']['offset']}}</span>
            </div>
            <div class="lunar-date">
              {{content['lunar']['lunarDateText']}}
            </div>
            <div class="lunar-gz">
              {{content['lunar']['gzText']}}
            </div>
          </section>

          <section class="todo-list">
            <div v-for="(todo, $index) in content['todoList']" :key="$index" class="todo">
              {{todo}}
            </div>
          </section>
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import moment, { today } from 'utils/configMoment'
import lunar from 'utils/lunar'
import date from 'components/date'

export default {
  components: {
    date
  },

  data () {
    const weekMode = 'isoweek'
    // const days =
    return {
      today,
      weekMode: weekMode,
      days: [
        '一', '二', '三', '四', '五', '六', '日'
      ],
      weekIndex: 1,
      contentIndex: 1,
      currentDate: today,
      mode: 'single'
    }
  },

  computed: {
    weeks () {
      // calculate previous and next week based on currentDate
      const date = moment(this.currentDate).endOf(this.weekMode).subtract(2, 'weeks')
      const previousWeek = this.getWeek(date)
      const currentWeek = this.getWeek(date)
      const nextWeek = this.getWeek(date)

      // this.weekIndex
      // 0 -> 0:currentWeek, 1:nextWeek, 2:previousWeek
      // 1 -> 0:previousWeek, 1:currentWeek, 2: nextWeek
      // 2 -> 0:nextWeek, 1:previousWeek, 2:currentWeek
      const weeks = []
      weeks[(this.weekIndex + 2) % 3] = previousWeek
      weeks[this.weekIndex] = currentWeek
      weeks[(this.weekIndex + 1) % 3] = nextWeek
      return weeks
    },

    contentList () {
      const aroundDates = this.getAroundDates()

      const contents = []
      contents[(this.contentIndex + 2) % 3] = this.getContent(aroundDates[0])
      contents[this.contentIndex] = this.getContent(this.currentDate)
      contents[(this.contentIndex + 1) % 3] = this.getContent(aroundDates[1])
      return contents
    }
  },

  methods: {
    getWeek (date) {
      const week = []

      while (week.length < 7) {
        date.add(1, 'days')

        const lunarInfo = lunar(date.text())
        lunarInfo.text = date.format('D')
        lunarInfo.value = date.text()

        week.push(lunarInfo)
      }

      return week
    },

    getAroundDates () {
      const date = moment(this.currentDate)
      const previousDate = date.subtract(1, 'days').text()
      const nextDate = date.add(2, 'days').text()

      return [previousDate, nextDate]
    },

    getContent (date) {
      const content = {}

      content.lunar = lunar(date)
      content.todoList = [
        date,
        date + '....',
        date,
        date + '....',
        date,
        date + '....',
        date,
        date + '....',
        date,
        date + '....',
        date,
        date + '....',
        date,
        date + '....',
        date,
        date + '....',
        date + ' .. end'
      ]

      return content
    },

    handleSlideWeek (e) {
      const current = e.target.current
      // last -> current
      // slide to right: 1->2, 2->0, 0->1
      // slide to left: 1->0, 0->2, 2->1
      const gap = current - this.weekIndex
      let direction = (gap === 1 || gap === -2) ? 1 : -1
      this.currentDate = moment(this.currentDate).add(direction, 'weeks').startOf(this.weekMode).text()
      this.weekIndex = current
    },

    handleSlideContent (e) {
      const current = e.target.current
      const gap = current - this.contentIndex
      const direction = (gap === 1 || gap === -2) ? 1 : -1
      this.currentDate = moment(this.currentDate).add(direction, 'days').text()
      this.contentIndex = current
    },

    handleClick (e) {
      this.currentDate = e.currentTarget.dataset.date
    },

    upper () {
      // this.mode = 'multi'
    },

    scroll (e) {
      console.log(e.target)
    }
  }
}
</script>

<style scoped lang="scss">

  @import "../../var.scss";

  .container {
    display: flex;
    flex-direction: column;
    background: $bg_color;
    height: 100vh;
    overflow: hidden;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    /*<!--font-size: $font_size;-->*/

    & > ._header {
      display: flex;
      justify-content: space-between;
      background: $white;
      padding: $sec_padding;
      box-shadow: $grey 0 1px 2px;

      & .date {
        /*font-size: 1.5em;*/
      }

      & .extra {
        /*font-size: .8rem;*/
        color: $grey_text;
      }

      & > .operation {
        display: flex;
      }
    }

    & > .calendar {
      background: $white;
      padding: $sec_padding;

      & > .days-container {
        display: flex;
        justify-content: space-between;

        & > .day {
          font-size: .8em;
          color: $grey_text;
          width: calc(100% / 7);
          text-align: center;
        }
      }

      & .date-container {
        display: flex;
        justify-content: space-between;
        height: $item_size;

        & > .date {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: $item_size;
          border: solid $border_size #fff;
          border-radius: $border_radius;

          & > .lunar {
            font-size: .5em;
            color: $grey_text;
            margin: 0;
          }

          &.current {
            background: $current_date_bg_color;
            border-color: $current_date_bg_color;
          }

          &.today {
            background: $today_bg_color;
            border-color: $today_bg_color;
            color: $white;
          }
        }
      }
    }

    & ._swiper.single {
      height: $item_size;
    }

    /*& ._swiper.multi {*/
    /*height: ;*/
    /*}*/

    & > .content {
      flex: 1;

      & ._scroll-view {
        height: 100%;

        & ._section {
          background: $white;
          width: 100vw;
          padding: $sec_padding;
        }

        & .lunar {
          margin: $sec_margin 0;
        }
      }
    }
  }
</style>
