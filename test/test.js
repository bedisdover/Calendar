const moment = require('moment')

moment.prototype.text = function () {
  return this.format('YYYY-MM-DD')
}

console.log(moment().startOf('day'))
