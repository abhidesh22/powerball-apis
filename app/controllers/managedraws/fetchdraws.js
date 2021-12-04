/* eslint-disable semi */
const { format, isAfter, parseISO } = require('date-fns');
const fetch = require('node-fetch');

const DRAW_URL = "https://data.ny.gov/resource/d6yy-54nr.json";
let firstLoad = true;
let loadedDraws = new Map();
let latestMapDate = new Date("1990-10-10");


async function loadNewDraws() {
    const response = await fetch(DRAW_URL);
    const json = await response.json();
    fillLoadedDraws(json);
    return json;
}

function fillLoadedDraws(drawsReceived) {

    drawsReceived.forEach((draw) => {
        const currDrawDate = format(parseISO(draw.draw_date), "yyyy-MM-dd");
        if(isAfter(parseISO(currDrawDate), latestMapDate) ) {
            latestMapDate = parseISO(currDrawDate)
        }
        loadedDraws.set(currDrawDate, {
            winNumbers: draw.winning_numbers.split(" ").slice(0,5),
            powerball: draw.winning_numbers.split(" ").slice(5)
        })
    })
}

async function getDrawDetailsByDate(ticketDate) {
    if(firstLoad) {
        await loadNewDraws();
    } else {
        const drawPresent = loadedDraws.has(format(parseISO(ticketDate), "yyyy-MM-dd"));   
        if (!drawPresent) {
          await loadNewDraws();
        }
    }

    return loadedDraws.get(format(parseISO(ticketDate), "yyyy-MM-dd"));
}

module.exports = { getDrawDetailsByDate }
