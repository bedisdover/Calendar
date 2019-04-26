<template>
  <div
    class="date"
    @click="handleClick"
    :class="{
      initial: date.value === current,
      today: date.value === today
    }">
    <div class="text" @click="handleClick"> {{ date.text }}</div>
    <div class="lunar" @click="handleClick"></div>
  </div>
</template>

<script>
import { today } from 'utils/configMoment'

export default {
  name: 'date',

  props: [
    'date',
    'current'
  ],

  data () {
    return {
      today
    }
  },

  methods: {
    handleClick () {
      console.log(this.date.value)
      this.$emit('onClick', this.date.value)
    }
  }
}
</script>

<style scoped lang="scss">
  $red: #ff0000;

  .date {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(calc(100vw - 52rpx) / 7);

    &.current {
      background: #eee;
      border: solid 1rpx #eee;
      border-radius: 4rpx;
    }

    &.today {
      background: $red;
      border: solid $red 1rpx;
      border-radius: 4rpx;
    }
  }
</style>
