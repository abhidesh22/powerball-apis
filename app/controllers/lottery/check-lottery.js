/* eslint-disable semi */
const { validateLottery } = require('./validate-lottery')
const { getDrawDetailsByDate } = require('../managedraws/fetchdraws')
const PastWinners = require('../../models/winners');
const { parseISO, format } = require('date-fns');

// @desc    Main route function called for checking the lottery winnings
// @route   POST /checklottery
// @params  request body and response. request body has below sample format:
//   {
//    "ticketDate": "2021-11-15",
//    "ticketNumbers": [
//        {
//          "numbers":[5, 34, 31, 51, 53],
//          "powerball": 23
//        },
//        {
//          "numbers":[5, 25, 30, 51, 50],
//          "powerball": 23
//        }
//    ]
//   }
// returns  the json object which gives details of the winning tickets, winning amount and whether jackpot was won
// sample response as below:
//
//{
//  "ticketDate": "20211027",
//  "winTickets": [
//      {
//          "ticketNumbers": [ Number Array ]
//          "powerball": Number,
//          "winnings": amount,
//          "isJackpotWinner": boolean,
//          "isWinner": boolean
//      }
//  ],
//  "winnersPresent": boolean,
//  "jackpotWon": boolean,
//  "totalWinAmount": totalamt
// }
//
async function checkLotteryRoute(req, res) {

  let errResp = false;
  try {
    validateLottery(req.body);
  } catch(error) {
    errResp = true;
    res.status(error.status).json(error.message);
  }
  if (!errResp) {
    let { ticketDate , ticketNumbers } = req.body;
    const WinnerDetailsForReqDate = await getDrawDetailsByDate(ticketDate);
    if(!WinnerDetailsForReqDate) {
      res.status(422).json("There is no draw available for this Date yet, please check later")
    }
  
    
    let winnersPresent = false;
    let jackpotWon = false;
    let totalWinAmount = 0;
    
    const winTickets = ticketNumbers.map(ticket => {
      let result = checkIfTicketWon(ticket, WinnerDetailsForReqDate);
      if (result.isWinner) winnersPresent = true;
      if(result.isJackpotWinner) jackpotWon = true;
      if(result.isWinner && !result.isJackpotWinner) {
        totalWinAmount += result.winnings;
      }
      return result;
    })
  
    let responseObj = {
      ticketDate,
      winTickets,
      winnersPresent,
      jackpotWon,
      totalWinAmount
    }
    if(responseObj.winnersPresent) {
      const winnerData = new PastWinners({ 
        ticketDate : format(parseISO(responseObj.ticketDate), "yyyy-MM-dd"),
        winTickets: responseObj.winTickets,
        winnersPresent: responseObj.winnersPresent,
        jackpotWon: responseObj.jackpotWon,
        totalWinAmount: responseObj.totalWinAmount 
      });
    
      const createdDBEntry = await winnerData.save();
    }
 
    res.json(responseObj);
  }  

}

function checkIfTicketWon(ticket, WinnerDetailsForReqDate) {
  let matchingEntries = 0;
  let isPowerballMatching = false;
  ticket.numbers.forEach(number => {
    WinnerDetailsForReqDate.winNumbers.forEach(winNumber => {
      if(number === parseInt(winNumber)) {
        matchingEntries ++
      }
    })
  })
  if(ticket.powerball === parseInt(WinnerDetailsForReqDate.powerball)) {
    isPowerballMatching = true;
  }

  return {
    ticketNumbers: [...ticket.numbers],
    powerball: ticket.powerball,
    winnings: getWinningAmount(matchingEntries, isPowerballMatching),
    isJackpotWinner: isPowerballMatching && matchingEntries === 5 ? true : false,
    isWinner: (matchingEntries >= 1)
  }
}

function getWinningAmount(matchingEntries, isPowerballMatching) {
  let winningWithPowerball = [4, 4, 7, 100, 50000, -1];
  if(isPowerballMatching) {
    return winningWithPowerball[matchingEntries];
  }
  let winningWithoutPowerball = [0, 0, 0, 7, 100, 1000000];
  return winningWithoutPowerball[matchingEntries];
}

module.exports = {
  checkLotteryRoute
}
