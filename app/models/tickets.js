// eslint-disable-next-line node/no-unsupported-features/es-syntax
// Test file - not used and just kept for reference to see what all needs to be sent as a request and response
class ResponseTicket {
    constructor(ticketDate = null, isWinner = false, isJackpot = false, totalWinAmount = 0, ticketNumbers = []) {
        this.ticketDate = ticketDate
        this.isWinner = isWinner
        this.isJackpot = isJackpot
        this.totalWinAmount = totalWinAmount
        this.ticketNumbers = ticketNumbers
    }
}

class RequestTicket {
    constructor(ticketDate = null, ticketNumbers = [], ticketId = null) {
        this.ticketDate = ticketDate
        this.ticketNumbers = ticketNumbers
        this.ticketId = ticketId
    }
}

module.exports = { RequestTicket, ResponseTicket }