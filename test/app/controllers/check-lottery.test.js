const { checkLotteryRoute } = require('../../../app/controllers/lottery/check-lottery')

const request =  require('supertest');

const app = require("../../../app/app");
// User supertest.request for validation that would fail the type system

const validTicket = {
  ticketDate: "20211115",
  ticketNumbers: [
    {
      numbers: [17, 22, 36, 37, 52],
      powerball: 1
    },
    {
        numbers: [27, 21, 1, 37, 52],
        powerball: 23
    }
  ]
};

const winningTicket = {
    ticketDate: "20211016",
    ticketNumbers: [
      {
        numbers: [45, 31, 49, 48, 42],
        powerball: 3
      },
      {
          numbers: [30, 41, 1, 37, 52],
          powerball: 23
      }
    ]
};

const jackpotTicket = {
    ticketDate: "20211016",
    ticketNumbers: [
      {
        numbers: [30, 31, 41, 48, 42],
        powerball: 3
      },
      {
          numbers: [30, 41, 1, 37, 52],
          powerball: 23
      }
    ]
};

test("check valid lottery no winners", async () => {
  const response = await request(app)
    .post("/checklottery")
    .send({
      ...validTicket
    });

  expect(response.status).toBe(200);
  expect(response.body.ticketDate).toBe('20211115');
  expect(response.body.winnersPresent).toBe(false);
});

test("check valid lottery with jackpot winner", async () => {
    const response = await request(app)
      .post("/checklottery")
      .send({
        ...jackpotTicket
      });
  
    expect(response.status).toBe(200);
    expect(response.body.ticketDate).toBe('20211016');
    expect(response.body.winnersPresent).toBe(true);
    expect(response.body.jackpotWon).toBe(true);
});

test("check valid lottery with only normal winners", async () => {
    const response = await request(app)
      .post("/checklottery")
      .send({
        ...winningTicket
      });
  
    expect(response.status).toBe(200);
    expect(response.body.ticketDate).toBe('20211016');
    expect(response.body.winnersPresent).toBe(true);
    expect(response.body.jackpotWon).toBe(false);
});