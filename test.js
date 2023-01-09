function getArrayCite(init, end, margin, duration) {
  const endDate = new Date(`2023-01-02T${end}:00.00`)
  const arr = []

  let initDate = new Date(`2023-01-02T${init}:00.00`)
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

const data = getArrayCite('10:00', '12:00', 5, 30)
console.log(data)
