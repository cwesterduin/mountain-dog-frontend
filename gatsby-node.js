require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`
});

let eventTypes = ['Munro','Swim','Kayak','Bike','Walk']

const fetch = require('node-fetch')
const getEventsData = async () => {
  console.log(process.env.API_URL);
  return fetch("https://fathomless-reaches-05046.herokuapp.com/Events")
  .then(res => res.json())
};
const getTripsData = async () => {
  console.log(process.env.API_URL);
  return fetch("https://fathomless-reaches-05046.herokuapp.com/Trips")
  .then(res => res.json())
};
const getBlogsData = async () => {
  console.log(process.env.API_URL);
  return fetch("https://fathomless-reaches-05046.herokuapp.com/BlogPosts")
  .then(res => res.json())
};

const getMediaDate = async () => {
  console.log(process.env.API_URL);
  return fetch("https://fathomless-reaches-05046.herokuapp.com/MediaDate")
  .then(res => res.json())
};



exports.createPages = async ({
  actions: {
    createPage
  }
}) => {
  //create a page for each event
  let events = await getEventsData();
  events = events.results;
  // Create a page for each painting.
  events.forEach((item,index) => {
    createPage({
      path: `/events/${item.EventID}`,
      component: require.resolve('./src/templates/event.js'),
      context: {
        item
      }
      }
    );
  });
  //create a page for each Trip
  let trips = await getTripsData();
  trips = trips.results;
  trips.forEach((item,index) => {
    createPage({
      path: `/trips/${item.TripID}`,
      component: require.resolve('./src/templates/trip.js'),
      context: {
        item
      }
      }
    );
  });
  eventTypes.forEach((type,index) => {
    let item = events.filter(a => a.DescriptionID.startsWith(type)).sort((a, b) => (a.Date > b.Date) ? -1 : 1)
    createPage({
      path: `/events/${type.toLowerCase()}`,
      component: require.resolve('./src/templates/subEvent.js'),
      context: {
        item
      }
      }
    );
  });
  let filterTrips = trips.filter((v,i,a)=>a.findIndex(t=>(t.TripID === v.TripID))===i)
  .sort((a, b) => (a.Date > b.Date) ? -1 : 1)
  createPage({
    path: `/events/trips`,
    component: require.resolve('./src/templates/subTrip.js'),
    context: {
      filterTrips
    }
  });
  let topID = [113,11,53,92,96,103,109,120]
  let item = events.filter(a => topID.indexOf(a.EventID) != -1).sort((a, b) => (a.Date > b.Date) ? -1 : 1)
  createPage({
    path: `/events/top`,
    component: require.resolve('./src/templates/subEvent.js'),
    context: {
      item
    }
  });
  let winter = ["01","02","03","04","11","12"]
  let summer = ["05","06","07","08","09","10"]
  let seasons = ["summer","winter"]
  let mediaDate = await getMediaDate()
  mediaDate = mediaDate.results
  seasons.forEach((season,index) => {
    let items
    if (season === "summer") {
       items = mediaDate.filter(a => a.Type === 'image').filter(a => summer.indexOf(a.Date.slice(5,7)) < 0 ? null : a)
    }
    else {
       items = mediaDate.filter(a => a.Type === 'image').filter(a => winter.indexOf(a.Date.slice(5,7)) < 0 ? null : a)
     }
    createPage({
      path: `/gallery/${season}`,
      component: require.resolve('./src/templates/gallery.js'),
      context: {
        items
      }
      }
    );
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
