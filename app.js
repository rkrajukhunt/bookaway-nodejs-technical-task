const Routes = require('./Routes');

async function execute(){
  const token = await Routes.getAccessToken();
  const hanoiStations = Routes.getStationsFrom("Hanoi");
  const sapaStations = Routes.getStationsFrom("Sapa");
  const trips = await Routes.getTrips("Hanoi", "Sapa", "2020-07-26", 2, token);
  const creditBeforeBooking = await Routes.getCredits(token);
  const bookTrip = await Routes.bookTrip(trips, token);
  const creditAfterBooking = await Routes.getCredits(token);
  console.log("Access Token is ", token);
  console.log("Number of Stations from Hanoi is ", hanoiStations);
  console.log("Number of Stations from Sapa is ", sapaStations);
  console.log(`Found ${trips.total} Trips between Hanoi and Sapa`);
  console.log("Credit Before booking is ", creditBeforeBooking);
  console.log("Your Booking Id is", bookTrip);
  console.log("Credit After booking is ", creditAfterBooking);
}


execute()
