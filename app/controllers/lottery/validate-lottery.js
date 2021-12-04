const { isValid, parseISO } = require('date-fns')

// @desc    validate the powerball number
// @params  all powerball numbers for each ticket on requests
// returns  none, throws related errors as detected

function validatePowerball (powerball) {
  let err = null
  if (!Number.isInteger(powerball) || !powerball || (powerball && (powerball < 1 || powerball > 26))) {
    err = new Error('Powerball needs to be a valid integer between range 1 to 26')
    err.status = 422
    throw err
  }
}

// @desc    validate the individual ticket numbers
// @params  all ticket numbers for each ticket on requests
// returns  none, throws related errors as detected

function validateTicketNumbers(numbers) {
  let err = null;
  numbers.forEach(checkNumber => {
    if (!Number.isInteger(checkNumber)) {
      err = new Error('At least one number in ticket is not a valid number, please check')
      err.status = 422
      throw err
    }
  
    if (checkNumber < 1 || checkNumber > 69) {
      err = new Error('At least one number in ticket is not a valid number, please check')
      err.status = 422
      throw err
    }
  })
}

// @desc    validate the individual tickets to check if there are empty tickets or invalid data
// @params  all tickets on requests
// returns  none, throws related errors as detected

function validateTickets (tickets) {
    let err = null;
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
        err = new Error('No tickets to check, please enter at least one ticket for checking')
        err.status = 422
        throw err
    }

    tickets.forEach(ticket => {

        if(!Array.isArray(ticket.numbers) || ticket.numbers.length !== 5 ) {
            err = new Error('At least one ticket is not valid, please check the tickets entered')
            err.status = 422
            throw err
        }
        validateTicketNumbers(ticket.numbers)
        validatePowerball(ticket.powerball)
    })
}

// @desc    This is the main function to validate the lottery tikets sent on the request body
// @route   POST /checklottery
// @params  requst body -> body
// returns  none, throws related errors as detected

function validateLottery (body) {

    const { ticketDate, ticketNumbers } = body
    let err = null
    if (!ticketDate) {

        err = new Error('Date is mandatory for the ticket, please provide date in format YYYYDDMM')
        err.status = 422
        throw err
      }
    
      if (!isValid(parseISO(ticketDate))) {
        const err = new Error(`Entered Date ${ticketDate} is not in correct format, please provide valid Date`)
        err.status = 422
        throw err
      }
  
    validateTickets(ticketNumbers)
}

module.exports = { 
  validateLottery
}