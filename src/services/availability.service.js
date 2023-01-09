const Schedule = require('./schedule.service')
const Appointment = require('./appointment.service')
const { findTimeZone, getZonedTime, getUnixTime } = require('timezone-support');
const { areSameDay, getWeekday, getAvailableAppointment, transformToUTC } = require('../utils')

class AvailabilityService {
  async getById(scheduleId, date, timezone) {
    let data = []
    let weekDayInfo;
    // fecha que selecciono el cliente en el calendario
    let clientDate = new Date(date)
    const schedule = new Schedule();
    const appointment = new Appointment()

    // Descanso y tiempo de reunión
    const { margin, duration, availability, user: { id: userId } } = await schedule.getById(scheduleId)
    const appointments = await appointment.getByUser(userId)
    console.log(userId)

    const onlyToday = appointments.filter(op => areSameDay(clientDate, op.startDate))
    if (!onlyToday) {
      return []
    }
    // TODO: Usar el arreglo del calendario para saber las horas
    for (const day_available of availability) {
      if (day_available.day === getWeekday(clientDate)) {
        weekDayInfo = day_available;
      }
    }
    if (!weekDayInfo) {
      return []
    }
    // TODO: Make to transform to UTC time of user
    const [year, month, day] = date.split('-')
    const _intervals = weekDayInfo.intervals
    const intervals = []
    for (const interval of _intervals) {
      const [hours, minutes] = interval.startTime.split(':')
      const [_hours, _minutes] = interval.endTime.split(':')
      const newDate = transformToUTC(year, month, day, hours, minutes, timezone)
      const _newDate = transformToUTC(year, month, day, _hours, _minutes, timezone)

      intervals.push({
        ...interval,
        startTime: newDate,
        endTime: _newDate,
      })
    }
    // console.log(intervals)

    // getAvailableAppointment(weekDayInfo.intervals[0].startTime, weekDayInfo.intervals[0].endTime, margin, duration)
    let appointmentList = Array.prototype.map.call(intervals, interval => getAvailableAppointment(interval.startTime, interval.endTime, margin, duration))
    appointmentList = appointmentList.flat()
    console.log(duration)
    for (const appointmentItem of appointmentList) {
      appointmentItem.status = onlyToday.every(data => data.startDate.getTime() === appointmentItem.startDate.getTime()) ? 'on' : 'off'
      // appointmentItem.startDate =
    }
    // TODO: Comprobar que onlyToday tenga alguna coincidenica
    // TODO: Manejar la fecha del usuario con la de su zona
    // TODO: Recordar que el formato es de 24 horas

    return appointmentList
  }
}

module.exports = AvailabilityService;
