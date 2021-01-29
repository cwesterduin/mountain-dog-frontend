import React, { useState, useEffect, useRef } from 'react'
import Image from '../Image'
import { Link } from 'gatsby'
import { useImageZoom } from 'react-medium-image-zoom'

import leafletMapStyles from "./leafletMapStyles.module.css"

import info from '../../../static/info.svg'
import search from '../../../static/search.svg'
import exclamation from '../../../static/exclamation.svg'




function Popover(props) {
  const [active, setActive] = useState(false)

  const popoverRef = useRef(null)

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
    const monthNames = ["Jan", "Feb", "March", "April", "May","June","July", "Aug", "Sept", "Oct", "Nov","Dec"];
     let dateParts
     dateParts = e.split("-");
     let jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2));
     jsDate =  `${ordinal_suffix_of(jsDate.getDate())} ${monthNames[jsDate.getMonth()]} ${jsDate.getFullYear()}`
     return jsDate
   }

  let extra, primary = false
  if (props.extraItems) {
    primary = props.extraItems.filter(ex => ex.MapFeatureID === props.item.MapFeatureID).filter(ex => ex.EventID === props.item.EventID).map(
      (ex,index) =>
      <>
          <div Style="width:auto" className={leafletMapStyles.popover_extra}><Link to={`/events/${ex.EventID}`}>{ex.EventName}</Link>
          <span className={leafletMapStyles.popover_extra}>&nbsp;- {makeDate(ex.Date)}</span>
          </div>
        {ex.TripID ?
          <div className={`${leafletMapStyles.popover_extra} ${leafletMapStyles.popover_extra_trip}`}><Link to={`/trips/${ex.TripID}`}><span className={leafletMapStyles.popover_extra_sub}> {ex.TripName}
            </span></Link>
          </div>
        : null}
      </>
    )
  }
  if (props.extraItems) {
    extra = props.extraItems.filter(ex => ex.MapFeatureID === props.item.MapFeatureID).filter(ex => ex.EventID !== props.item.EventID).map(
      (ex,index) =>
      <>
      <div Style="width:auto" className={leafletMapStyles.popover_extra}><Link to={`/events/${ex.EventID}`}>{ex.EventName}</Link>
      <span className={leafletMapStyles.popover_extra}>&nbsp;- {makeDate(ex.Date)}</span>
          </div>
        {ex.TripID ?
          <div className={`${leafletMapStyles.popover_extra} ${leafletMapStyles.popover_extra_trip}`}><Link to={`/trips/${ex.TripID}`}><span className={leafletMapStyles.popover_extra_sub}> {ex.TripName}
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
        <Image filename={props.item.Path} />
      </div>
      <div className={leafletMapStyles.popover_title_cont}>
        <div className={leafletMapStyles.popover_title}><h1>{props.item.Name}</h1> {props.item.Height ? <span className={leafletMapStyles.popover_height}>{` ${props.item.Height}m`}</span> : null }</div>
        {props.item.MunroOrder ? <div className={leafletMapStyles.popover_subtitle}>{`Alfie's Munro ${props.item.MunroOrder}/282`}</div> : null }
      </div>

      <div className={leafletMapStyles.popover_trip_item}>
      { props.item.EventID === null ?
        <div Style="display:flex; flex-flow: row wrap; justify-content:center; border-bottom: 0.1em solid rgba(14, 30, 37, 0.055);">
          <div Style="display:flex; flex-direction: column; padding: 1em">
            <img Style="height:1.5em;" src={exclamation}/>
            <span Style="font-size:1em">no details yet...</span>
          </div>
        </div>
        :
        <>
        {/*<div Style="display:flex; flex-flow: row wrap; justify-content:center;">
          <Link to={`/events/${props.item.EventID}`}>
            <div Style="display:flex; flex-direction: column; padding: 1em">
            <img Style="height:1.5em;" src={info}/>
            <span Style="font-size:.75em">{props.item.Type} details</span>
            </div>
          </Link>
            <div Style="display:flex; flex-direction: column; padding: 1em">
            <img Style="height:1.5em;" src={search}/>
            <span Style="font-size:.75em">search site</span>
            </div>
        </div>*/}
        {(props.extraItems.filter(ex => ex.MapFeatureID === props.item.MapFeatureID)).length > 0 ?
        <div className={leafletMapStyles.popover_extra_cont}>
        <div className={leafletMapStyles.popover_sub_title}>{props.item.Type === 'munro' ? 'Details' : 'Details'}</div>
          {primary}
        {(props.extraItems.filter(ex => ex.MapFeatureID === props.item.MapFeatureID).filter(ex => ex.EventID !== props.item.EventID)).length > 0 ?
          <div className={leafletMapStyles.popover_sub_title}></div> : null}
          {extra}
        </div>
        :
        null}
        </>
      }

      {props.item.Translation || props.item.Translation ?
      <div className={leafletMapStyles.popover_additional_info}>
      <div className={leafletMapStyles.popover_sub_title}>Info</div>
      {props.item.Translation ? <div className={leafletMapStyles.popover_additional_info_text}>Translation: {props.item.Translation}</div> : null }
      {props.item.Pronunciation ? <div className={leafletMapStyles.popover_additional_info_text}>Pronunciation: {props.item.Pronunciation}</div> : null }
      </div>
      :null}

      </div>


    </div>
  )
}

export default Popover
