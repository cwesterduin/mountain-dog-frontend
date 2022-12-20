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

const eventMapFeatures = async () => {
  return fetch(url + "eventMapFeatures")
  .then(res => res.json())
};

exports.createPages = async ({
  actions: {
    createPage
  }
}) => {


  async function createMap() {
    let mf = await mapFeatures()
    let emf = await eventMapFeatures()
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
      let mapFeatures = []
      for (let event of tripData.events) {
        let tripEventData = await getOneEventData(event.id)
        mapFeatures.push(tripEventData.mapFeatures)
      }
      createPage({
            path: `/trips/${item.id}`,
            component: require.resolve('./src/templates/trip.js'),
            context: {
              item: tripData,
              mapItems: mapFeatures
            }
          }
      );
    };
  }
  await createTrips()
  eventTypes.forEach((type,index) => {
    let item = events.filter(a => a.descriptionId.toLowerCase().startsWith(type)).sort((a, b) => (a.date > b.date) ? -1 : 1)
    console.log(item)
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
  let topID = [113,11,105,80,92,96,103,109,120]
  let item = events.filter(a => topID.indexOf(a.EventID) != -1).sort((a, b) => (a.Date > b.Date) ? -1 : 1)
  createPage({
    path: `/events/top`,
    component: require.resolve('./src/templates/subEvent.js'),
    context: {
      item
    }
  });
  // let winter = ["01","02","03","04","11","12"]
  // let summer = ["05","06","07","08","09","10"]
  // let seasons = ["summer","winter"]
  // let mediaDate = await getMediaDate()
  // mediaDate = mediaDate.results
  // seasons.forEach((season,index) => {
  //   let items
  //   if (season === "summer") {
  //      items = mediaDate.filter(a => a.Type === 'image').filter(a => summer.indexOf(a.Date.slice(5,7)) < 0 ? null : a)
  //   }
  //   else {
  //      items = mediaDate.filter(a => a.Type === 'image').filter(a => winter.indexOf(a.Date.slice(5,7)) < 0 ? null : a)
  //    }
  //   createPage({
  //     path: `/gallery/${season}`,
  //     component: require.resolve('./src/templates/gallery.js'),
  //     context: {
  //       items
  //     }
  //     }
  //   );
  // });
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
