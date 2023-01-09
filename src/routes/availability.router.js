const Router = require('express')
const validationHandler = require('../middlewares/validator.handler')
const AvailabilityService = require('../services/availability.service')
const { getTimezone } = require('../dtos/availavility.dtos')

const router = Router()

router.post(
  '/',
  validationHandler(getTimezone, 'body'),
  async (req, res) => {
    const { date, timezone, scheduleId } = req.body

    const availabilityService = new AvailabilityService()
    const data = await availabilityService.getById(scheduleId, date, timezone)
    res.json(data);
  })

module.exports = router
