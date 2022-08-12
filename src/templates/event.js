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


function EventNumber(props) {
  const [active, setActive] = useState(props.a.EventID === props.item.EventID)
  useEffect(() => {
    if (active)
    props.checkActive(props.index)
  },[active])
  return(
    <Link className={eventStyles.event_numbers} Style={props.a.EventID === props.item.EventID ? 'text-decoration:underline' : null} to={`/events/${props.a.EventID}`}>{props.index + 1}</Link>
  )
}

function EventListNumbers(props) {
    const [active, setActive] = useState(false)
    const sortedTrips = props.trip.sort((a, b) => a.Date.localeCompare(b.Date))
    if (props.trip) {
    return(
      <>
      {active !== false ? active === 0 ? <span className={eventStyles.deadLink}>{'< '}</span> : <Link to={`/events/${sortedTrips[active - 1].EventID}`}>{'<'}</Link> : null}
      {
      sortedTrips.map((a,index) =>
        <EventNumber checkActive={(a) => setActive(a)} item={props.item} a={a} index={index} />
      )
      }
      {active !== false ? active === (props.trip.length - 1) ? <span className={eventStyles.deadLink}>{' >'}</span> : <Link to={`/events/${sortedTrips[active + 1].EventID}`}>{'>'}</Link> : null}
      </>
    )}
    else {return null}
    }

function Event({pageContext: {item}}) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [eventData, setEventData] = useState(false);
  const [items, setItems] = useState([]);
  const [media, setMedia] = useState([]);
  const [trip, setTrip] = useState(false);

  const id = `event${item.EventID}`
  const disqusConfig = {
    shortname: 'mountain-dog',
    config: { identifier: id },
  }


  const [gpx, setGpx] = useState(item.GPX ? JSON.parse(item.GPX) : null)

  useEffect(() => {
  fetch(`${url}Events/${item.EventID}`)
    .then(res => res.json())
    .then(
      (result) => {
        setEventData(result.Event[0])
        setItems(result.MapFeatures);
        setMedia(result.Media)
        setIsLoaded(true);

      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
  }, [])

  useEffect(() => {
  fetch(`${url}Trips/${item.TripID}`)
    .then(res => res.json())
    .then(
      (result) => {
        setTrip(result.Event)
        setIsLoaded(true);

      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    )
  }, [])
  // let t = items.Date.split(/[- :]/);
  // let d = new Date(Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

  const images = media.filter(item => item.Type !== 'map')
  .sort((a,b) => (a.Order > b.Order) ? 1 : ((b.Order > a.Order) ? -1 : 0))
  .map(item =>
    item.Type === 'image' ?
    <div id={`A-${item.FeatureAnchor}`} Style={window.location.hash === `#A-${item.FeatureAnchor}` ? 'outline:solid green 2px' : null} className={eventStyles.image_big_cont}>
    <GridImage Path={item.Path} />
    <div className={eventStyles.image_big_cont_description}>{item.Order}. {item.Description ? item.Description : null} (ID:{item.MediaID})</div>
    </div>
    : item.Type === 'panorama' ?
    <div id={`A-${item.FeatureAnchor}`} Style={window.location.hash === `#A-${item.FeatureAnchor}` ? 'outline: solid green 2px; width: 100%' : 'width:100%'} className={eventStyles.image_big_cont}>
    <GridImage Path={item.Path} />
    <div className={eventStyles.image_big_cont_description}>{item.Order}. {item.Description ? item.Description : null}</div>
    </div>
    :
    <div className={eventStyles.image_big_contB}>
      <div className={eventStyles.video_cont}>
        <iframe className={eventStyles.video} src={`https://www.youtube.com/embed/${item.Path}`} frameborder="0" allowFullScreen="0" controls="0"></iframe>
      </div>
      <div className={eventStyles.image_big_cont_description}>{item.Order}. {item.Description ? item.Description : null}</div>
    </div>
  )

  const maps = media.filter(item => item.Type === 'map').map(item =>
    <div Style="display:flex; flex-direction: row;">
    <div Style={"padding: 0 .5em"} className={eventStyles.image_big_contB}>
    <GridImage Path={item.Path} />
    </div>
    <div Style={"padding: 0 .5em"} className={eventStyles.image_big_contB}>
    <GridImage Path={item.Path} />
    </div>
    </div>
  )

  let dateParts, jsDate, rating = false
  const monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"];
  let arr = []
  if (eventData !== false) {
     dateParts = eventData.Date.split("-");
     jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));

     for (let i=0; i<item.Rating; i++) {
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

function munroContext(item) {
  mapContext.changeReferringFeature(item)
  let newPull = [...mapContext.referringFilter, item.Type]
  mapContext.changeReferringFilter(newPull)
}



  return (
    <Layout>
    <div className={pageStyles.content}>
        <div className={eventStyles.content_top}>

          <div className={eventStyles.details_cont}>
            <div className={eventStyles.details_mobile}>
            {item.DistanceKM || item.ElevationM ?
            <div Style="text-align:center" className={eventStyles.details_numbers}>
              {item.DistanceKM ? <span>Distance: {item.DistanceKM}km | </span> : null}
              {item.ElevationM ? <span>Elevation: {item.ElevationM}m &nbsp;</span> : null}
            </div>
            :null}
              {eventData === false ? null : eventData.Description}
              {items.filter(item => item.Type === 'munro').length === 0 ? null :
              <div Style="padding-top:.5em">Munros Walked ({items.filter(item => item.Type === 'munro').length}):&nbsp;
              {items.filter(item => item.Type === 'munro').map(item => <span className={eventStyles.munro_item}><Link onClick={() => munroContext(item)} to={"/map"}>{item.Name}</Link></span>)}</div>
              }
              {trip === false ? null :
              <div Style="display:flex; flex-direction: column; align-items:center; flex: 1; justify-content:flex-end; padding-top: 1em;">
                {eventData === false || trip === false ? null : eventData.TripID ? <div>Part of trip: <Link to={`/trips/${eventData.TripID}`}>{trip[0].TripName}</Link></div> : null}
                {eventData === false || trip === false ? null : eventData.TripID ?<div><EventListNumbers trip={trip} item={item} /></div>
                : null}
              </div>
              }
            </div>
            <div className={eventStyles.map_cont}>
              <div className={eventStyles.map_sub_cont}>
                <AboutMap isLoaded={isLoaded} mapItems={items} gpx={gpx} />
              </div>
              {/* maps.length > 0 ? <><span>Additional Maps</span>
                <div Style="padding:0 !important">{maps}</div></>
              : null */}
            </div>
            <div className={eventStyles.description_cont}>
            <div className={eventStyles.details_title}>
              <h1 className={eventStyles.details_title_heading}>{eventData === false ? 'loading...' : eventData.Name}</h1><span>{jsDate ? `${ordinal_suffix_of(jsDate.getDate())} ${monthNames[jsDate.getMonth()]} ${jsDate.getFullYear()}` : null}</span>
              {eventData === false ? null : eventData.Rating ? <div>{rating}</div> : null}
            </div>

            {eventData === false ? null :
            <div className={eventStyles.details}>

                {item.DistanceKM || item.ElevationM ?
                <div className={eventStyles.details_numbers}>
                  {item.DistanceKM ? <span>Distance: {item.DistanceKM} km | </span> : null}
                  {item.ElevationM ? <span>Elevation: {item.ElevationM} m</span> : null}
                </div>
                :null}

                {eventData === false ? null : eventData.Description}

                {items.filter(item => item.Type === 'munro').length === 0 ? null :
                <div Style="padding-top:.5em">Munros Walked ({items.filter(item => item.Type === 'munro').length}):&nbsp;
                {items.filter(item => item.Type === 'munro').map(item => <span className={eventStyles.munro_item}><Link onClick={() => munroContext(item)} to={"/map"}>{item.Name}</Link></span>)}</div>
                }

            </div>
            }

            {trip === false ? null :
            <div className={`${eventStyles.trip_context}`}>
              {eventData === false || trip === false ? null : eventData.TripID ? <div><Link to={`/trips/${eventData.TripID}`}>{trip[0].TripName}</Link></div> : null}
              {eventData === false || trip === false ? null : eventData.TripID ?<div><EventListNumbers trip={trip} item={item} /></div>
              : null}
            </div>
            }

          </div>

          </div>
        </div>


        <div className={eventStyles.imageTopCont}>
          {images}
          {/*<div className={eventStyles.image_big_contB}>
            <div className={eventStyles.video_cont}><iframe className={eventStyles.video} src="https://www.youtube.com/embed/Xv9w9nf3X-4" frameborder="0" allowFullScreen="0" controls="0"></iframe></div>
          </div> */}
          </div>
          <div className={eventStyles.comment_cont}><DiscussionEmbed {...disqusConfig} /></div>
    </div>
    </Layout>
 )
}

export default Event
