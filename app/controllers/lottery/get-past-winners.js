/* eslint-disable semi */
const { parseISO, format } = require('date-fns');
const PastWinners = require('../../models/winners')

async function getPastWinnersRoute(req, res) {

  const pastWinners = await PastWinners.find({ ticketDate: format(parseISO(req.params.date), "yyyy-MM-dd") });
  if(pastWinners.length === 0) {
    res.json("No Entries found for this Date")
  } else {
    res.json(pastWinners);
  }

}
  
  module.exports = {
    getPastWinnersRoute
  }
  