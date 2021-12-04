const mongoose = require('mongoose');

const winnerSchema = mongoose.Schema(
  {
    ticketDate: {
      type: String,
      required: true,
    },
    winTickets: {
      type: [{
          ticketNumbers: [Number],
          powerball: Number,
          winnings: Number,
          isJackpotWinner: Boolean,
          isWinner: Boolean
      }],
    },
    winnersPresent: {
      type: Boolean
    },
    jackpotWon: {
      type: Boolean
    },
    totalWinAmount: {
        type: Number
    },
  },
  {
    timestamps: true,
  }
);

const PastWinners = mongoose.model("LotteryWinners", winnerSchema)

module.exports = PastWinners