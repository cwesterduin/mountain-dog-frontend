import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import GridImage from '../components/GridImage'
import url from "../helpers/url"

import AboutMap from '../components/map/AboutMap'

import eventStyles from "./eventStyles.module.css"
import pageStyles from "../pages/pageStyles.module.css"

import star from '../../static/star.svg'

import { DiscussionEmbed } from "disqus-react"

import { myContext } from '../components/PageContext';
import * as L from "leaflet";
import Image from "../components/Image";
import tripStyles from "../pages/tripStyles.module.css";


function EventNumber(props) {
  const [active, setActive] = useState(props.a.id === props.item.id)
  useEffect(() => {
    if (active)
    props.checkActive(props.index)
  },[active])
  return(
    <Link className={eventStyles.event_numbers} Style={props.a.id === props.item.id ? 'text-decoration:underline' : null} to={`/events/${props.a.id}`}>{props.index + 1}</Link>
  )
}

function EventListNumbers(props) {
    const [active, setActive] = useState(false)
    const sortedTrips = props.trip.events.sort((a, b) => a.date.localeCompare(b.date))
    if (props.trip) {
    return(
      <>
      {active !== false ? active === 0 ? <span className={eventStyles.deadLink}>{'< '}</span> : <Link to={`/events/${sortedTrips[active - 1].id}`}>{'<'}</Link> : null}
      {
      sortedTrips.map((a,index) =>
        <EventNumber checkActive={(a) => setActive(a)} item={props.item} a={a} index={index} />
      )
      }
      {active !== false ? active === (props.trip.events.length - 1) ? <span className={eventStyles.deadLink}>{' >'}</span> : <Link to={`/events/${sortedTrips[active + 1].id}`}>{'>'}</Link> : null}
      </>
    )}
    else {return null}
    }

function Event({pageContext: {
    item,
    eventData,
    media,
    items,
    coordinates,
    trip
}}) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);


  const id = `event-${item.id}`
  const disqusConfig = {
    shortname: 'mountain-dog',
    config: { identifier: id },
  }



    const images = media
        .sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
        .map(item =>
            'image' === 'image' ?
                <div id={`A-${item.FeatureAnchor}`} className={eventStyles.image_big_cont}>
                    <Image
                        className={tripStyles.item_cont_img}
                        imgStyle = {{
                            objectFit : 'cover'
                        }}
                        filename={item.path.substring(item.path.indexOf('/images/') + '/images/'.length)}
                    />
                    <div className={eventStyles.image_big_cont_description}>{item.description ? item.description : null}</div>
                </div>
                : item.type === 'panorama' ?
                    <div id={`A-${item.FeatureAnchor}`} className={eventStyles.image_big_cont}>
                        <GridImage Path={item.path} />
                        <div className={eventStyles.image_big_cont_description}>{item.description ? item.description : null}</div>
                    </div>
                    :
                    <div className={eventStyles.image_big_contB}>
                        <div className={eventStyles.video_cont}>
                            <iframe className={eventStyles.video} src={`https://www.youtube.com/embed/${item.path}`} frameborder="0" allowFullScreen="0" controls="0"></iframe>
                        </div>
                        <div className={eventStyles.image_big_cont_description}>{item.description ? item.description : null}</div>
                    </div>
        )






  let dateParts, jsDate, rating = false
  const monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
  let arr = []
  if (item.date !== false) {
     dateParts = item.date.split("-");
     jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substring(0,2));

     for (let i=0; i<item.rating; i++) {
       arr.push(i)
     }
     rating = arr.map(item => <img Style="width:1em;height:1em" src={star}/>)
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

const mapContext = useContext(myContext);

function munroContext(item) {console.log(item)
  mapContext.changeReferringFeature(item)
  let newPull = [...mapContext.referringFilter, item.type]
  mapContext.changeReferringFilter(newPull)
}

    const [crs, setCrs] = useState(false)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCrs(new L.Proj.CRS(
                'EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs',
                {
                    resolutions: [ 896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75 ],

                    origin: [ -238375.0, 1376256.0 ],
                    transformation: L.Transformation(1, 0, -1, 0)
                }

            ))}
    },[])



  return (
    <Layout>
    <div className={pageStyles.content}>
        <div className={eventStyles.content_top}>

          <div className={eventStyles.details_cont}>
            <div className={eventStyles.details_mobile}>
            {isLoaded ?
            <div Style="text-align:center" className={eventStyles.details_numbers}>
              {eventData.distance ? <span>Distance: {eventData.distance}km | </span> : null}
              {eventData.elevation ? <span>Elevation: {eventData.elevation}m &nbsp;</span> : null}
            </div>
            :null}
              {eventData.description}
              {items.filter(item => item.type === 'munro').length === 0 ? null :
              <div Style="padding-top:.5em">Munros Walked ({items.filter(item => item.Type === 'munro').length}):&nbsp;
              {items.filter(item => item.type === 'munro').map(item => <span className={eventStyles.munro_item}><Link onClick={() => munroContext(item)} to={"/map"}>{item.name}</Link></span>)}</div>
              }
              {trip ?
              <div Style="display:flex; flex-direction: column; align-items:center; flex: 1; justify-content:flex-end; padding-top: 1em;">
                {trip ? null : trip.id ? <div>Part of trip: <Link to={`/trips/${trip.id}`}>{trip.name}</Link></div> : null}
                {trip ? null : trip.id ?<div><EventListNumbers trip={trip} item={item} /></div>
                : null}
              </div> : null
              }
            </div>
            <div className={eventStyles.map_cont}>
              <div className={eventStyles.map_sub_cont}>
                  {crs ?
                <AboutMap crs={crs} isLoaded={isLoaded} mapItems={items} coordinates={coordinates} />
                      : null}
              </div>
            </div>
            <div className={eventStyles.description_cont}>
            <div className={eventStyles.details_title}>
              <h1 className={eventStyles.details_title_heading}>{eventData === false ? 'loading...' : eventData.name}</h1><span>{jsDate ? `${ordinal_suffix_of(jsDate.getDate())} ${monthNames[jsDate.getMonth()]} ${jsDate.getFullYear()}` : null}</span>
              {eventData === false ? null : eventData.rating ? <div>{rating}</div> : null}
            </div>

            {eventData === false ? null :
            <div className={eventStyles.details}>

                {eventData.distance || eventData.elevation ?
                <div className={eventStyles.details_numbers}>
                  {eventData.distance ? <span>Distance: {eventData.distance} km | </span> : null}
                  {eventData.elevation ? <span>Elevation: {eventData.elevation} m</span> : null}
                </div>
                :null}

                {eventData === false ? null : eventData.description}

                {items.filter(item => item.type === 'munro').length === 0 ? null :
                <div Style="padding-top:.5em">Munros Walked ({items.filter(item => item.type === 'munro').length}):&nbsp;
                {items.filter(item => item.type === 'munro').map(item => <span className={eventStyles.munro_item}><Link onClick={() => munroContext(item)} to={"/map"}>{item.name}</Link></span>)}</div>
                }

            </div>
            }

            {trip ?
            <div className={`${eventStyles.trip_context}`}>
              {eventData === false || trip === false ? null : trip.id ? <div><Link to={`/trips/${trip.id}`}>{trip.name}</Link></div> : null}
              {eventData === false || trip === false ? null : trip.id ?<div><EventListNumbers trip={trip} item={item} /></div>
              : null}
            </div> : null
            }

          </div>

          </div>
        </div>


        <div className={eventStyles.imageTopCont}>
          {images}
          </div>
          <div className={eventStyles.comment_cont}><DiscussionEmbed {...disqusConfig} /></div>
    </div>
    </Layout>
 )
}

export default Event
