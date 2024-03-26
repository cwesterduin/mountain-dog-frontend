import React, {useState, useEffect, useContext} from 'react'
import {Link} from 'gatsby'
import Layout from '../components/layout'

import AboutMap from '../components/map/AboutMap'

import * as eventStyles from "./eventStyles.module.css"
import * as pageStyles from "../pages/pageStyles.module.css"

import star from '../../static/star.svg'

import {myContext} from '../components/PageContext';
import * as L from "leaflet";
import Image from "../components/Image";
import * as tripStyles from "../pages/tripStyles.module.css";
import {ordinal_suffix_of} from "../helpers/date";


function EventListNumbers(props) {
    const sortedTrips = props.trip.events.sort((a, b) => a.date.localeCompare(b.date))
    const currentIndex = sortedTrips.findIndex(s => s.id === props.item.id)
    const prevItem = sortedTrips[currentIndex - 1]
    const nextItem = sortedTrips[currentIndex + 1]
    if (sortedTrips) {
        return (
            <>
                {currentIndex === 0 ? <span className={eventStyles.deadLink}>{'< '}</span> :
                    <Link to={`/events/${prevItem.id}`}>{'<'}</Link>}
                {
                    sortedTrips.map((a, index) => {
                            return <Link className={eventStyles.event_numbers}
                                         key={index}
                                         style={a.id === props.item.id ? {textDecoration: "underline"} : null}
                                         to={`/events/${a.id}`}>{index + 1}</Link>
                        }
                    )
                }
                {currentIndex === (props.trip.events.length - 1) ?
                    <span className={eventStyles.deadLink}>{' >'}</span> :
                    <Link to={`/events/${nextItem.id}`}>{'>'}</Link>}
            </>
        )
    } else {
        return null
    }
}

function Event({
                   pageContext: {
                       item,
                       eventData,
                       media,
                       items,
                       coordinates,
                       trip
                   }
               }) {



    const id = `event-${item.id}`

    const images = media
        .sort((a, b) => (a.sortOrder > b.sortOrder) ? 1 : ((b.sortOrder > a.sortOrder) ? -1 : 0))
        .map((item, index) => {
                if (item.fileType === "image") {
                    return <div key={index} className={eventStyles.image_big_cont}>
                        <Image
                            zoomable={true}
                            className={tripStyles.item_cont_img}
                            imgStyle={{
                                objectFit: 'cover'
                            }}
                            filename={item.path.substring(item.path.indexOf('/images/') + '/images/'.length)}
                        />
                        <div
                            className={eventStyles.image_big_cont_description}>{item.description ? item.description : null}</div>
                    </div>
                } else if (item.fileType === "video") {
                    return <div key={index} className={eventStyles.image_big_cont}>
                        <video style={{width: "100%", height: "100%"}} controls>
                            <source src={item.path}
                                    type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                        <div
                            className={eventStyles.image_big_cont_description}>{item.description ? item.description : null}</div>
                    </div>
                }
            }
        )


    let dateParts, jsDate, rating = false
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let arr = []

    if (eventData.rating)
        for (let i = 0; i < eventData.rating; i++) {
            arr.push(i)
        }
    rating = arr.map((item, index) => <img key={index} style={{width: "1em", height: "1em", objectFit: "scale-down"}}
                                           src={star}
                                           alt={"star"}/>)

    if (item.date !== false) {
        dateParts = item.date.split("-");
        jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substring(0, 2));
    }


    const mapContext = useContext(myContext);

    function munroContext(item) {
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
                    resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75],

                    origin: [-238375.0, 1376256.0],
                    transformation: L.Transformation(1, 0, -1, 0)
                }
            ))
        }
    }, [])


    return (
        <Layout>
            <div className={pageStyles.content}>
                <div className={eventStyles.content_top}>

                    <div className={eventStyles.details_cont}>
                        <div className={eventStyles.details_mobile}>
                            <div style={{textAlign: "center"}} className={eventStyles.details_numbers}>
                                {eventData.distance ? <span>Distance: {eventData.distance}km | </span> : null}
                                {eventData.elevation ? <span>Elevation: {eventData.elevation}m &nbsp;</span> : null}
                            </div>
                            {eventData.description}
                            {items.filter(item => item.type === 'munro').length === 0 ? null :
                                <div style={{paddingTop: ".5em"}}>Munros Walked
                                    ({items.filter(item => item.type === 'munro').length}):&nbsp;
                                    {items.filter(item => item.type === 'munro').map((item, index) => <span key={index}
                                                                                                            className={eventStyles.munro_item}><Link
                                        onClick={() => munroContext(item)}
                                        to={"/map"}>{item.name}</Link></span>)}</div>
                            }
                            {trip ?
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    flex: 1,
                                    justifyContent: "flex-end",
                                    paddingTop: "1em"
                                }}>
                                    {trip ? null : trip.id ?
                                        <div>Part of trip: <Link to={`/trips/${trip.id}`}>{trip.name}</Link>
                                        </div> : null}
                                    {trip ? null : trip.id ? <div><EventListNumbers trip={trip} item={item}/></div>
                                        : null}
                                </div> : null
                            }
                        </div>
                        <div className={eventStyles.map_cont}>
                            <div className={eventStyles.map_sub_cont}>
                                {crs ?
                                    <AboutMap crs={crs} mapItems={items} coordinates={coordinates}/>
                                    : null}
                            </div>
                        </div>
                        <div className={eventStyles.description_cont}>
                            <div className={eventStyles.details_title}>
                                <h1 className={eventStyles.details_title_heading}>{eventData === false ? 'loading...' : eventData.name}</h1>
                                <span>{jsDate ? `${ordinal_suffix_of(jsDate.getDate())} ${monthNames[jsDate.getMonth()]} ${jsDate.getFullYear()}` : null}</span>
                                {eventData === false ? null : eventData.rating ? <div>{rating}</div> : null}
                            </div>

                            {eventData === false ? null :
                                <div className={eventStyles.details}>
                                    {eventData.distance || eventData.elevation ?
                                        <div className={eventStyles.details_numbers}>
                                            {eventData.distance ?
                                                <span>Distance: {eventData.distance} km | </span> : null}
                                            {eventData.elevation ?
                                                <span>Elevation: {eventData.elevation} m</span> : null}
                                        </div>
                                        : null}

                                    {eventData === false ? null : eventData.description}

                                    {items.filter(item => item.type === 'munro').length === 0 ? null :
                                        <div style={{paddingTop: ".5em"}}>Munros Walked
                                            ({items.filter(item => item.type === 'munro').length}):&nbsp;
                                            {items.filter(item => item.type === 'munro').map((item, index) => <span
                                                key={index}
                                                className={eventStyles.munro_item}><Link
                                                onClick={() => munroContext(item)}
                                                to={"/map"}>{item.name}</Link></span>)}</div>
                                    }

                                </div>
                            }

                            {trip ?
                                <div className={`${eventStyles.trip_context}`}>
                                    {eventData === false || trip === false ? null : trip.id ?
                                        <div><Link to={`/trips/${trip.id}`}>{trip.name}</Link></div> : null}
                                    {eventData === false || trip === false ? null : trip.id ?
                                        <div><EventListNumbers trip={trip} item={item}/></div>
                                        : null}
                                </div> : null
                            }

                        </div>

                    </div>
                </div>


                <div className={eventStyles.imageTopCont}>
                    {images}
                </div>
            </div>
        </Layout>
    )
}

export default Event
