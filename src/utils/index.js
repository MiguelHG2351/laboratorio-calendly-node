const { getUnixTime, findTimeZone } = require('timezone-support')

function getDayOfDate(date) {
  const day = {
    'sunday': 1,
    'monday': 2,
    'tuesday': 3,
    'wednesday': 4,
    'thursday': 5,
    'friday': 6,
    'saturday': 7
  }
  let options = { weekday: 'long' };
  let _day = new Intl.DateTimeFormat('en-US', options).format(new Date(date));
  return day[_day.toLocaleLowerCase()]
}

function getWeekday(date) {
  let options = { weekday: 'long' };
  let day = new Intl.DateTimeFormat('en-US', options).format(date);
  return day.toLocaleLowerCase();
}

function areSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
}

function transformToUTC(year, month, day, hours, minutes, timezone) {
  const _timezone = findTimeZone(timezone)
  const userTime = {
    year,
    month,
    day,
    hours,
    minutes
  }
  return new Date(getUnixTime(userTime, _timezone))
}

function getAvailableAppointment(init, end, margin, duration) {
  const endDate = end
  const arr = []

  let initDate = init
  let nextDate = new Date(initDate.getTime() + (duration * 60 * 1000))

  while(nextDate.getTime() < endDate.getTime()) {
      arr.push({
          startDate: initDate,
          endDate: nextDate
      })
      initDate = new Date(nextDate.getTime() + (margin * 60 * 1000))
      nextDate = new Date(initDate.getTime() + (duration * 60 * 1000))
  }
  return arr
}

module.exports = {
  getDayOfDate,
  areSameDay,
  getWeekday,
  getAvailableAppointment,
  transformToUTC
}
