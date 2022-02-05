import React, {useState, useEffect, useRef, useContext} from 'react'
import { Link } from 'gatsby'
import L from 'leaflet'
import Div100vh from 'react-div-100vh'
import { Map, TileLayer, Marker, Tooltip, useLeaflet } from "react-leaflet"

import Popover from './Popover'
import CheckBoxes from './CheckBoxes'
import Legend from './Legend'
import Search from './Search'

import FullscreenControl from 'react-leaflet-fullscreen';
import 'react-leaflet-fullscreen/dist/styles.css'


import leafletMapStyles from "./leafletMapStyles.module.css"
import { icons } from './icons.js'

import { myContext } from '../PageContext';


function PointMarker(props) {
  const markerRef = useRef(null)

    function clickEvent(e) {
     //if (props.selected === e.MapFeatureID) {
      //      markerRef.current.leafletElement._icon.classList.remove('active')
        //    markerRef.current.leafletElement.closePopup()
          //  props.close()
        //  }
        props.goPopover(e)
    }


    useEffect(() => {
      if (props.selected !== props.item.MapFeatureID) {
        markerRef.current.leafletElement._icon.classList.remove('active')
      }
      else {
        markerRef.current.leafletElement._icon.classList.add('active')
        console.log(props.selected, props.item.MapFeatureID)
      }
    },[props.selected])

  return (
    <Marker
    ref={markerRef}
    position={[props.item.Lat,props.item.Lng]}
    icon={icons[props.item.Type]}
    onClick={() => clickEvent(props.item)}
    onKeyPress={(e) => e.originalEvent.code === 'Enter' ? clickEvent(props.item) : null}
    >
      <Tooltip direction={"top"} offset={[0, -16]} opacity={"0.8"}>
        <b>{props.item.Name}</b>
      </Tooltip>
    </Marker>
  )
}

function PointsLayer(props) {
  return (
    props.mapItems.map((item,index) =>
      <PointMarker
        close={props.close}
        selected={props.selected}
        item={item}
        goPopover={props.goPopover}
      />
  ))
}


function LeafletMap(props) {
  const items = props.items
  const extraItems = props.extraItems
  const mapContext = useContext(myContext);


  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);


  const [mapItems, setMapItems] = useState([])
  const [filter, setFilter] = useState([]);
  const [popover, setPopover] = useState()
  const [updatePosition, setUpdatePosition] = useState()

  const [popoverClosing, setPopoverClosing] = useState(false)
  const [zoom, setZoom] = useState(7)

  const [selected, setSelected] = useState();

  const mapCont = useRef(null);
  const mapRef = useRef(null);






  function tryChange(e) {
    if (mapContext.referringFilter.indexOf(e) === -1) {
      let newPull = [...mapContext.referringFilter, e]
      setTimeout(() => {
        mapContext.changeReferringFilter(newPull)
      },500)

    }
    else {
      let newPull = mapContext.referringFilter.filter(a => a !== e)
      setTimeout(() => {
      mapContext.changeReferringFilter(newPull)
    },100)
    }
  }

  useEffect(() => {
    setFilter(mapContext.referringFilter)
  },[mapContext.referringFilter])


  useEffect(() => {
    if (isLoaded === true) {
      let newItems = items.filter(f => filter.includes(f.Type));
      console.log(newItems)
      setMapItems(newItems)
    }
    else {}
  },[filter, isLoaded])



  function goPopover(e,item) {
    setTimeout(() => {
    setPopover(item)
    setUpdatePosition(item)
  },500)
    setSelected(item.MapFeatureID)
     // mapRef.current.leafletElement.closePopup();
     // console.log(mapRef.current.leafletElement.marker)
     // document.getElementsByClassName('leaflet-marker-icon').classList.remove('active')
     // e.target._icon.classList.add('active')
  }


  function handleItemClick(item) {
    setSelected(item.MapFeatureID)
    setPopover(item)
    setUpdatePosition(item)
    setTimeout(() => {
    mapContext.changeReferringFeature(item)
    },500)
  }




  function close() {
    setPopoverClosing(true)
    setTimeout(() => setPopover(undefined), 500);
    setTimeout(() => setUpdatePosition(), 500);
    setTimeout(() => setPopoverClosing(false), 500);
    setTimeout(() => setSelected(undefined), 0);
  }

  useEffect(() => {
    if (isLoaded) {
      if (mapContext.referringFeature === false) {
        setTimeout(() => {
            let newPull = [...mapContext.referringFilter, 'munro']
            mapContext.changeReferringFilter(newPull)
        },500)
      }
      else {
        setPopover(mapContext.referringFeature)
        setUpdatePosition(mapContext.referringFeature)
        setFilter(mapContext.referringFilter)
        setTimeout(() => {
          setSelected(mapContext.referringFeature.MapFeatureID)
        },500)
      }
    }
  },[isLoaded])



     if (typeof window !== 'undefined') {
      return (
      <myContext.Consumer>
        {context => (
        <>
      <Div100vh>
        <div ref={mapCont} className={leafletMapStyles.top_container}>
        <div ref={mapCont} className={leafletMapStyles.container}>

        <Search popover={popover} dropdown={mapItems} onItemClick={handleItemClick}/>


            {/*<button onClick={() => fullScreenToggle(mapCont)}>fullScreen</button>*/}
            <CheckBoxes filter={filter} tryChange={tryChange}/>
            {popover ? <Popover closing={popoverClosing} close={close} item={popover} extraItems={extraItems} /> : null}

          {isLoaded ?
          <Map  ref={mapRef} maxZoom={15} zoom={7} center={[57.5,-4]} className={popover ? 'active' : null}
          onzoomend={() => setZoom(mapRef.current.leafletElement.getZoom())}
          >

            <TileLayer url='https://{s}.tile.osm.org/{z}/{x}/{y}.png' />
            <PointsLayer close={close} selected={selected} goPopover={handleItemClick} mapItems={mapItems}/>
            {/* Map code goes here */}
            <Legend zoom={zoom} updatePosition={updatePosition}/>

          </Map>
          : <div className={leafletMapStyles.leaflet_container_loading} Style={"background: #ddd"}>
              <div class="sk-folding-cube">
              <div class="sk-cube1 sk-cube"></div>
              <div class="sk-cube2 sk-cube"></div>
              <div class="sk-cube4 sk-cube"></div>
              <div class="sk-cube3 sk-cube"></div>
              </div>
            </div>
        }
        </div>
        </div>
      </Div100vh>
      </>

    )}
    </myContext.Consumer>
  )
    }
    else {
    return null
  }
}

export default LeafletMap
