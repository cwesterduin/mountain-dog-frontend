import React, { useState, useEffect, useRef } from 'react'
import Image from '../Image'
import { Link } from 'gatsby'
import { useImageZoom } from 'react-medium-image-zoom'

import leafletMapStyles from "./leafletMapStyles.module.css"

import info from '../../../static/info.svg'
import search from '../../../static/search.svg'
import exclamation from '../../../static/exclamation.svg'
import GridImage from "../GridImage";
import eventStyles from "../../templates/eventStyles.module.css";




function Popover(props) {
  const [active, setActive] = useState(false)

  const popoverRef = useRef(null)

  const events = props.item.events

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

  function makeDate(e) {
      try {
          const monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
          let dateParts
          dateParts = e.split("-");
          let jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
          jsDate = `${ordinal_suffix_of(jsDate.getDate())} ${monthNames[jsDate.getMonth()]} ${jsDate.getFullYear()}`
          return jsDate
      } catch (e) {
          return null
      }
   }

  let extra, primary = false
  if (events) {
      primary = <>
          <div Style="width:auto" className={leafletMapStyles.popover_extra}><Link to={`/events/${events[0].id}`}>{events[0].name}</Link>
          <span className={leafletMapStyles.popover_extra}>&nbsp;- {makeDate(events[0].date)}</span>
          </div>
        {events[0].trip_id ?
          <div className={`${leafletMapStyles.popover_extra} ${leafletMapStyles.popover_extra_trip}`}><Link to={`/trips/${events[0].trip_id}`}><span className={leafletMapStyles.popover_extra_sub}> {events[0].trip_name}
            </span></Link>
          </div>
        : null}
      </>
  }
  if (events) {
      extra = events.slice(1).map(
      (ex,index) =>
      <>
      <div Style="width:auto" className={leafletMapStyles.popover_extra}><Link to={`/events/${ex.id}`}>{ex.name}</Link>
      <span className={leafletMapStyles.popover_extra}>&nbsp;- {makeDate(ex.date)}</span>
          </div>
        {ex.trip_id ?
          <div className={`${leafletMapStyles.popover_extra} ${leafletMapStyles.popover_extra_trip}`}><Link to={`/trips/${ex.trip_id}`}><span className={leafletMapStyles.popover_extra_sub}> {ex.trip_name}
            </span></Link>
          </div>
        : null }
      </>
    )
  }

  const { ref } = useImageZoom({ zoomMargin: 24})

  useEffect(() => {
    props.item !== undefined ? setActive(true) : setActive(false)
    popoverRef.current.scrollTop = 0;
  },[props.item])
  return (
    <div  ref={popoverRef} Style={active && props.closing ? 'transform:translateX(100%); transition-delay: 1s' : active && !props.closing ? 'transform:translateX(0)' : null} className={leafletMapStyles.popover_cont}>
        <div className={leafletMapStyles.popover_header}>
        <button className={leafletMapStyles.popover_cont_close} onClick={props.close}>&times;</button>
      </div>
        <div ref={ref} className={`${leafletMapStyles.popover_image_cont}`}>
            <img src={"https://alfie76589.s3.eu-west-2.amazonaws.com/" + props.item.path} />
        </div>
            <div className={leafletMapStyles.popover_title_cont}>
        <div className={leafletMapStyles.popover_title}><h1>{props.item.name}</h1> {props.item.height ? <span className={leafletMapStyles.popover_height}>{` ${props.item.height}m`}</span> : null }</div>
        {props.item.munro_order ? <div className={leafletMapStyles.popover_subtitle}>{`Alfie's Munro ${props.item.munro_order}/282`}</div> : null }
      </div>

      <div className={leafletMapStyles.popover_trip_item}>
      { props.item.event === null ?
        <div Style="display:flex; flex-flow: row wrap; justify-content:center; border-bottom: 0.1em solid rgba(14, 30, 37, 0.055);">
          <div Style="display:flex; flex-direction: column; padding: 1em">
            <img Style="height:1.5em;" src={exclamation}/>
            <span Style="font-size:1em">no details yet...</span>
          </div>
        </div>
        :
        <>
        {primary ?
        <div className={leafletMapStyles.popover_extra_cont}>
        <div className={leafletMapStyles.popover_sub_title}>Details</div>
          {primary}
        {extra  ?
          <div className={leafletMapStyles.popover_sub_title}></div> : null}
          {extra}
        </div>
        :
        null}
        </>
      }

      {props.item.translation || props.item.pronunciation ?
      <div className={leafletMapStyles.popover_additional_info}>
      <div className={leafletMapStyles.popover_sub_title}>Info</div>
      {props.item.translation ? <div className={leafletMapStyles.popover_additional_info_text}>Translation: {props.item.translation}</div> : null }
      {props.item.pronunciation ? <div className={leafletMapStyles.popover_additional_info_text}>Pronunciation: {props.item.pronunciation}</div> : null }
      </div>
      :null}

      </div>


    </div>
  )
}

export default Popover
