const express = require('express')
const { root } = require('../controllers/root')
const { notFound, errorHandler } = require('../middleware/error-handlers')
const { checkLotteryRoute } = require('../controllers/lottery/check-lottery')
const { getPastWinnersRoute } = require('../controllers/lottery/get-past-winners.js')

const router = express.Router()

// Routes
router.get('/', root)
router.post('/checklottery', checkLotteryRoute)
router.get('/pastwinners/:date',getPastWinnersRoute)

// Fall Through Route
router.use(notFound)
router.use(errorHandler)
module.exports = router