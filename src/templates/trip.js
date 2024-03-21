import React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import TripMap from '../components/map/TripMap'
import eventStyles from './eventStyles.module.css'
import pageStyles from "../pages/pageStyles.module.css"
import { ordinal_suffix_of } from "../helpers/date.js"

import { DiscussionEmbed } from "disqus-react"


function Event({pageContext: {item, mapItems}}) {
    const mapFeatures = mapItems.map(m => m.mapFeatures).flat()


  const id = `trip${item.TripID}`
  const disqusConfig = {
    shortname: 'mountain-dog',
    config: { identifier: id },
  }


  let jsDate = false
  const monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
    const sortedEvents = item.events && item.events.length > 0
        ? item.events.sort((a, b) => a.date.localeCompare(b.date))
        : [];

    if (sortedEvents.length > 0) {
        const firstEvent = sortedEvents[0];
        const dateParts = firstEvent.date && typeof firstEvent.date === 'string'
            ? firstEvent.date.split("-")
            : [];

        if (dateParts.length === 3) {
            jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substring(0, 2));
            // Now you can use jsDate safely
        } else {
            console.error("Invalid date format or missing date parts.");
        }
    } else {
        console.error("No events available for the item.");
    }


  const events = item.events.sort((a, b) => a.date.localeCompare(b.date)).map((item,index) =>
    <div key={index}>
      <span>Stage {index + 1}: </span>
      <Link to={`/events/${item.id}`}>{item.name}</Link>
    </div>
  )

  const munros = mapFeatures.filter(item => item.type === 'munro').map((item,index) =>
    <span key={index} className={eventStyles.munro_item}>{item.name}</span>
  )

  let totalDistance = item.events.filter(a => a.distance !== null).map(a => a.distance)
  totalDistance.length === 1 ? totalDistance = totalDistance[0] : totalDistance = totalDistance.reduce((a,b) => a + b, 0)

  let totalElevation = item.events.filter(a => a.elevation !== null).map(a => a.elevation)
  totalElevation.length === 1 ? totalElevation = totalElevation[0] : totalElevation = totalElevation.reduce((a,b) => a + b, 0)




  return (
    <Layout>
    <div className={pageStyles.content}>

        <div className={eventStyles.content_top}>
        <div className={eventStyles.details_cont}>

        <div className={eventStyles.details_mobile}>
            {munros.length > 0 ? <div><b>Munros climbed ({munros.length}): </b>{munros}</div> : null}
            <div><b>Distance travelled: </b>{totalDistance}km</div>
            <div><b>Elevation gained: </b>{totalElevation}m</div>
        </div>

          <div className={eventStyles.map_cont}>
            <div className={eventStyles.map_sub_cont}>
              <TripMap mapItems={mapItems} events={item.events}  />
            </div>
          </div>

          <div className={eventStyles.description_cont}>

          <div className={eventStyles.details_title}>
            <h1>{item.name}</h1>
            <div>{jsDate ? `${ordinal_suffix_of(jsDate.getDate())} ${monthNames[jsDate.getMonth()]} ${jsDate.getFullYear()}` : null}</div>
            <div>{item.description}</div>
          </div>
            <div className={eventStyles.details}>
              {munros.length > 0 ? <div><b>Munros climbed ({munros.length}): </b>{munros}</div> : null}
              <div><b>Distance travelled: </b>{totalDistance}km</div>
              <div><b>Elevation gained: </b>{totalElevation}m</div>
          </div>
              <p></p>
              <div>{events}</div>

          </div>


        </div>
        </div>

        <div className={eventStyles.comment_cont}><DiscussionEmbed {...disqusConfig} /></div>
    </div>

    </Layout>
  )




}

export default Event
