require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});
const url = "http://localhost:8080/"

let eventTypes = ['munro','corbett','swim','kayak','bike','walk']

const fetch = require('node-fetch')
const getEventsData = async () => {
  return fetch(url + "events/frontend")
  .then(res => res.json())
};
const getOneEventData = async (id) => {
  return fetch(url + "events/" + id)
      .then(res => res.json())
};
const getTripsData = async () => {
  return fetch(url + "trips/frontend")
  .then(res => res.json())
};
const getOneTrip = async (id) => {
  return fetch(url + "trips/" + id)
      .then(res => res.json())
};
const mapFeatures = async () => {
  return fetch(url + "map-features/frontend")
  .then(res => res.json())
};

exports.createPages = async ({
  actions: {
    createPage
  }
}) => {


  async function createMap() {
    let mf = await mapFeatures()
    mf = mf.map(m => ({...m, coordinate: JSON.parse(m.coordinate), events: JSON.parse(m.events)}))
    createPage({
          path: `/map`,
          component: require.resolve('./src/templates/mapPage.js'),
          context: {
            mf
          }
        }
    );
  }
  await createMap()
  //create a page for each event
  let events = await getEventsData();


  // Create a page for each event.
  async function createEvents() {
    for (let item of events) {
      let eventData = await getOneEventData(item.id);
      let media = eventData.media
      let items = eventData.mapFeatures
      let coordinates = eventData.coordinates
      let trip = eventData.trip
      createPage({
            path: `/events/${item.id}`,
            component: require.resolve('./src/templates/event.js'),
            context: {
              item,
              eventData,
              media,
              items,
              coordinates,
              trip
            }
          }
      );
    }
  }
  await createEvents()
  //create a page for each Trip
  let trips = await getTripsData();
  async function createTrips() {
    for (let item of trips) {
      let tripData = await getOneTrip(item.id)
      let mapItems = []
      for (let event of tripData.events) {
        let tripEventData = await getOneEventData(event.id)
        mapItems.push(tripEventData)
      }
      createPage({
            path: `/trips/${item.id}`,
            component: require.resolve('./src/templates/trip.js'),
            context: {
              item: tripData,
              mapItems: mapItems
            }
          }
      );
    };
  }
  await createTrips()
  eventTypes.forEach((type,index) => {
    let item = events.filter(a => a.descriptionId.toLowerCase().startsWith(type)).sort((a, b) => (a.date > b.date) ? -1 : 1)
    createPage({
      path: `/events/${type}`,
      component: require.resolve('./src/templates/subEvent.js'),
      context: {
        item
      }
      }
    );
  });
  let filterTrips = trips.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)
  .sort((a, b) => (a.date > b.date) ? -1 : 1)
  createPage({
    path: `/events/trips`,
    component: require.resolve('./src/templates/subTrip.js'),
    context: {
      filterTrips
    }
  });
  let topID = [
      "48059bdb-b365-11ec-9c02-026bb6510df8",
    "47d46200-b365-11ec-9c02-026bb6510df8",
    "4804c959-b365-11ec-9c02-026bb6510df8",
    "4803f4e1-b365-11ec-9c02-026bb6510df8",
    "48033db3-b365-11ec-9c02-026bb6510df8",
    "48030747-b365-11ec-9c02-026bb6510df8",
    "48023b3e-b365-11ec-9c02-026bb6510df8",
    "4801da32-b365-11ec-9c02-026bb6510df8",
    "4800c40f-b365-11ec-9c02-026bb6510df8"]
  let item = events.filter(a => topID.indexOf(a.id) != -1).sort((a, b) => (a.date > b.date) ? -1 : 1)
  createPage({
    path: `/events/top`,
    component: require.resolve('./src/templates/subEvent.js'),
    context: {
      item
    }
  });
};



exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /proj4leaflet/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
