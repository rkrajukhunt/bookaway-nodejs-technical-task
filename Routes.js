const request = require('request-promise');
const constant = require('./constant');
const stations = require('./stations.json');

async function getAccessToken(){
  const authOption = {
    method: 'POST',
    uri: constant.authURL,
    body: {
      client_id: "r9VlPfHk0MEx7Mfw+izyei+E0ZUhfkghqGgv2Zeb+H4=",
      client_secret: "ef7ac57cc66a42b5efd695e058d1fdd1AidDbU82jomHcISlVSOwBSAxQvG7KKwuEcWREBBISh0=",
      scope: "b2b",
      grant_type: "client_credentials"
    },
    json: true
  };
  const tokenData = await request(authOption);
  return tokenData.access_token;
}

function getStationsFrom(origin){
  const filteredStations = stations.filter(d => d.city.city.toLowerCase() === origin.toLowerCase());
  return filteredStations.length
}

function __getStationId(station){
  const stationData = stations.find(d => d.city.city.toLowerCase() === station.toLowerCase());
  return stationData.stationId
}

function getTrips(from, to, date, noOfPassengers, token){
  const tripOptions = {
    method: 'GET',
    uri: constant.tripURL,
    qs: {
      departureStation: __getStationId(from),
      arrivalStation: __getStationId(to),
      departure: date,
      passengers: noOfPassengers
    },
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: true
  }
  return request(tripOptions);
}

async function getCredits(token){
  const creditsOptions = {
    method: 'GET',
    uri: constant.creditURL,
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: true
  }
  const creditData = await request(creditsOptions);
  return `${creditData.balance} ${creditData.currency}`;
}

async function bookTrip(trips, token){
  const transfers = require('./transfers.json');
  const instantConfirmations = trips.data.filter(d => d.isInstantConfirmation);
  const cheapestTrips = instantConfirmations.sort((a,b)=> b.price.totalAmount - a.price.totalAmount);
  const bookingRef = cheapestTrips[0];
  const bookingOptions = {
    method: 'POST',
    uri: constant.bookingURL,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: {
      tripId: bookingRef.id,
      passengers: [
        {
          firstName: "test",
          lastName: "test",
          extraInfos: [
            {
              definition: "58acdc6eb626ad00060bcea3",
              value: "Afghan"
            }
          ]
        },
        {
          firstName: "test",
          lastName: "test",
          extraInfos: [
            {
              definition: "58acdc6eb626ad00060bcea3",
              value: "Afghan"
            }
          ]
        }
      ],
      contact: {
        email: "johndoe@gmail.com",
        phone: "+1 (234) 556-6677"
      }
    },
    json: true
  }
  const booking = await request(bookingOptions);
  const bookingPayOptions = {
    method: 'POST',
    uri: `${constant.bookingURL}/${booking.id}/pay`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: {
      id: booking.id
    },
    json: true
  }
  const payment = await request(bookingPayOptions);
  return booking.reference
}

module.exports = {
  getAccessToken,
  getStationsFrom,
  getTrips,
  getCredits,
  bookTrip
}
