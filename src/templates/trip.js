import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import TripMap from '../components/map/TripMap'
import eventStyles from './eventStyles.module.css'
import pageStyles from "../pages/pageStyles.module.css"

import { DiscussionEmbed } from "disqus-react"


function Event({pageContext: {item}}) {
  const [items, setItems] = useState([])
  const [mapItems, setMapItems] = useState([])
  const [gpx, setGpx] = useState(null)


  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null);

  const id = `trip${item.TripID}`
  const disqusConfig = {
    shortname: 'mountain-dog',
    config: { identifier: id },
  }

  useEffect(() => {
  fetch(`https://fathomless-reaches-05046.herokuapp.com/Trips/${item.TripID}`)
    .then(res => res.json())
    .then(
      (result) => {
        setItems(result.Event);
        setMapItems(result.MapFeatures);
        setIsLoaded(true);

      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
  }, [])

  let dateParts, jsDate = false
  const monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
  let arr = []
  if (isLoaded !== false) {
     dateParts = items.sort((a, b) => a.Date.localeCompare(b.Date))[0].Date.split("-");
     jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
   }
   function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

  const events = items.sort((a, b) => a.Date.localeCompare(b.Date)).map((item,index) =>
    <>
    <div>
      <span>Stage {index + 1}: </span>
      <Link to={`/events/${item.EventID}`}>{item.Name}</Link>
    </div>
    </>
  )

  const munros = mapItems.filter(item => item.Type === 'munro').map(item =>
    <span className={eventStyles.munro_item}>{item.Name}</span>
  )

  let totalDistance = items.filter(a => a.DistanceKM !== null).map(a => a.DistanceKM)
  totalDistance.length === 1 ? totalDistance = totalDistance[0] : totalDistance = totalDistance.reduce((a,b) => a + b, 0)

  let totalElevation = items.filter(a => a.ElevationM !== null).map(a => a.ElevationM)
  totalElevation.length === 1 ? totalElevation = totalElevation[0] : totalElevation = totalElevation.reduce((a,b) => a + b, 0)


  const tripItems = mapItems.sort((a, b) => a.Date.localeCompare(b.Date)).filter((v,i,a)=>a.findIndex(t=>(t.EventID === v.EventID))===i)

  return (
    <Layout>
    <div className={pageStyles.content}>
    {/*<div className={eventStyles.tag}>Trip 1</div>*/}

        <div className={eventStyles.content_top}>
        <div className={eventStyles.details_cont}>

        <div className={eventStyles.details_mobile}>
          {munros.length > 0 ? <div>{munros.length} {munros.length > 1 ? 'munros' : 'munro'} climbed: {munros}</div> : null}
          <div>Distance travelled: {totalDistance}km</div>
          <div>Elevation gained: {totalElevation}m</div>
        </div>

          <div className={eventStyles.map_cont}>
            <div className={eventStyles.map_sub_cont}>
              <TripMap isLoaded={isLoaded} mapItems={tripItems} gpx={gpx} />
            </div>
          </div>

          <div Style="display:flex; flex-direction:column" className={eventStyles.description_cont}>

          <div className={eventStyles.details_title}>
            <h1>{item.Name}</h1>
            <div>{jsDate ? `${ordinal_suffix_of(jsDate.getDate())} ${monthNames[jsDate.getMonth()]} ${jsDate.getFullYear()}` : null}</div>
            <div>{item.Description}</div>
          </div>
            <div className={eventStyles.details}>
              {munros.length > 0 ? <div><b>Munros climbed ({munros.length}): </b>{munros}</div> : null}
              <div><b>Distance travelled: </b>{totalDistance}km</div>
              <div><b>Elevation gained: </b>{totalElevation}m</div>
          </div>
          </div>


        </div>
        </div>

        {/*<div>{events}</div>*/}

        <div className={eventStyles.comment_cont}><DiscussionEmbed {...disqusConfig} /></div>
    </div>

    </Layout>
  )




}

export default Event
