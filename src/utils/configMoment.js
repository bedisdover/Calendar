import moment from 'moment'

moment.prototype.text = function () {
  return this.format('YYYY-MM-DD')
}

const today = moment().text()

export {
  today
}

export default moment
