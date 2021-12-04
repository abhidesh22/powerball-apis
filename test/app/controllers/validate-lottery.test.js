const request =  require('supertest');

const app = require("../../../app/app");
const { validateLottery } = require("../../../app/controllers/lottery/validate-lottery");

// User supertest.request for validation that would fail the type system

const validTicket = {
  ticketDate: "2021-11-15",
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

test("ticket having numbers not in range", async () => {
    const response = await request(app)
      .post("/checklottery")
      .send({
        ...validTicket,
        ticketNumbers: [
            {
                numbers: [17, 22, 36, 37, 85],
                powerball: 1
            }
        ]
      });
  
    expect(response.status).toBe(422);
    expect(response.body).toBe('At least one number in ticket is not a valid number, please check');
});

test("ticket having powerball not in range", async () => {
    const response = await request(app)
      .post("/checklottery")
      .send({
        ...validTicket,
        ticketNumbers: [
            {
                numbers: [17, 22, 36, 37, 55],
                powerball: 48
            }
        ]
      });
  
    expect(response.status).toBe(422);
    expect(response.body).toBe('Powerball needs to be a valid integer between range 1 to 26');
});


test("ticket having more than 5 numbers", async () => {
    const response = await request(app)
      .post("/checklottery")
      .send({
        ...validTicket,
        ticketNumbers: [
            {
                numbers: [17, 22, 36, 37, 52, 44],
                powerball: 1
            }
        ]
      });
  
    expect(response.status).toBe(422);
    expect(response.body).toBe('At least one ticket is not valid, please check the tickets entered');
});

test("ticket having invalid numbers", async () => {
    const response = await request(app)
      .post("/checklottery")
      .send({
        ...validTicket,
        ticketNumbers: [
            {
                numbers: [17, 22, 36, 37, "4dd4"],
                powerball: 1
            }
        ]
      });
  
    expect(response.status).toBe(422);
    expect(response.body).toBe('At least one number in ticket is not a valid number, please check');
});

test("no tickets to check", async () => {
    const response = await request(app)
      .post("/checklottery")
      .send({
        ...validTicket,
        ticketNumbers: null
      });
  
    expect(response.status).toBe(422);
    expect(response.body).toBe('No tickets to check, please enter at least one ticket for checking');
});

test("date not correctly formatted", async () => {
    const response = await request(app)
      .post("/checklottery")
      .send({
        ...validTicket,
        ticketDate: 'ddd-44-2222'
      });
  
    expect(response.status).toBe(422);
    expect(response.body).toBe('Entered Date ddd-44-2222 is not in correct format, please provide valid Date');
});

test("date not present", async () => {
  const response = await request(app)
    .post("/checklottery")
    .send({
      ...validTicket,
      ticketDate: undefined
    });

  expect(response.status).toBe(422);
  expect(response.body).toBe('Date is mandatory for the ticket, please provide date in format YYYYDDMM');
});

// test("without picks", async () => {
//   const response = await request(app)
//     .post("/ticket")
//     .send({
//       ...validTicket,
//       picks: undefined
//     });

//   expect(response.status).toBe(422);
//   expect(response.body.message).toBe(
//     'an array of ticket "picks" must be provided'
//   );
// });

// test("with non array picks", async (): Promise<void> => {
//   const response = await request(app)
//     .post("/ticket")
//     .send({
//       ...validTicket,
//       picks: "I am not an array"
//     });

//   expect(response.status).toBe(422);
//   expect(response.body.message).toBe(
//     'an array of ticket "picks" must be provided'
//   );
// });

// test("with empty picks", (): void => {
//   const t = (): void =>
//     validateBody({
//       ...validTicket,
//       picks: []
//     });

//   expect(t).toThrow(ValidationError);
// });

// test("with a pick with missing numbers", async (): Promise<void> => {
//   const response = await request(app)
//     .post("/ticket")
//     .send({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           powerball: 1
//         }
//       ]
//     });

//   expect(response.status).toBe(422);
//   expect(response.body.message).toBe(
//     'an array of ticket pick "numbers" must be provided'
//   );
// });

// test("with a pick without a powerball", async (): Promise<void> => {
//   const response = await request(app)
//     .post("/ticket")
//     .send({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           numbers: [1, 2, 3, 4, 5]
//         }
//       ]
//     });

//   expect(response.status).toBe(422);
//   expect(response.body.message).toBe('ticket pick must have a "powerball"');
// });

// test("with a pick with non array numbers", async (): Promise<void> => {
//   const response = await request(app)
//     .post("/ticket")
//     .send({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           numbers: "I am not an array",
//           powerball: 1
//         }
//       ]
//     });

//   expect(response.status).toBe(422);
//   expect(response.body.message).toBe(
//     'an array of ticket pick "numbers" must be provided'
//   );
// });

// test("with a pick with non-number powerball", async (): Promise<void> => {
//   const response = await request(app)
//     .post("/ticket")
//     .send({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           numbers: [1, 2, 3, 4, 5],
//           powerball: "I am not a number"
//         }
//       ]
//     });

//   expect(response.status).toBe(422);
//   expect(response.body.message).toBe(
//     'ticket pick "powerball" must be an integer'
//   );
// });

// test("with a pick with non-number numbers", async (): Promise<void> => {
//   const response = await request(app)
//     .post("/ticket")
//     .send({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           numbers: [1, 2, 3, 4, "I am not a number"],
//           powerball: 5
//         }
//       ]
//     });

//   expect(response.status).toBe(422);
//   expect(response.body.message).toBe(
//     'ticket pick "numbers" must be an array of numbers'
//   );
// });

// test("with a pick with too many numbers", (): void => {
//   const t = (): void =>
//     validateBody({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           numbers: [1, 2, 3, 4, 5, 6],
//           powerball: 7
//         }
//       ]
//     });

//   expect(t).toThrow(ValidationError);
// });

// test("with a pick with not enough numbers", (): void => {
//   const t = (): void =>
//     validateBody({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           numbers: [1, 2, 3, 4],
//           powerball: 5
//         }
//       ]
//     });

//   expect(t).toThrow(ValidationError);
// });

// test("with a pick with numbers duplicates", (): void => {
//   const t = (): void =>
//     validateBody({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           numbers: [1, 1, 2, 3, 4],
//           powerball: 5
//         }
//       ]
//     });

//   expect(t).toThrow(ValidationError);
// });

// test("with a pick number less than 1", (): void => {
//   const t = (): void =>
//     validateBody({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           numbers: [0, 1, 2, 3, 4],
//           powerball: 5
//         }
//       ]
//     });

//   expect(t).toThrow(ValidationError);
// });

// test("with a pick number greater than 69", (): void => {
//   const t = (): void =>
//     validateBody({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           numbers: [70, 1, 2, 3, 4],
//           powerball: 5
//         }
//       ]
//     });

//   expect(t).toThrow(ValidationError);
// });

// test("with a pick powerball less than 1", (): void => {
//   const t = (): void =>
//     validateBody({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           numbers: [1, 2, 3, 4, 5],
//           powerball: 0
//         }
//       ]
//     });

//   expect(t).toThrow(ValidationError);
// });

// test("with a pick powerball greater than 26", (): void => {
//   const t = (): void =>
//     validateBody({
//       ...validTicket,
//       picks: [
//         ...validTicket.picks,
//         {
//           numbers: [1, 2, 3, 4, 5],
//           powerball: 27
//         }
//       ]
//     });

//   expect(t).toThrow(ValidationError);
// });

// test("with an invalid date", (): void => {
//   const t = (): void =>
//     validateBody({
//       ...validTicket,
//       date: "not a date"
//     });

//   expect(t).toThrow(ValidationError);
// });
