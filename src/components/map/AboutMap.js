import React, {Component, useState, useEffect, useRef, useContext} from 'react'
import { Link, navigate } from 'gatsby'
import * as L from 'leaflet'
import { Map, TileLayer, Marker, useLeaflet, WMSTileLayer, Polyline, Popup, Tooltip } from "react-leaflet"
import 'react-leaflet-fullscreen/dist/styles.css'

import leafletMapStyles from "./leafletMapStyles.module.css"
import { icons } from './icons.js'

import "proj4";
import "proj4leaflet";

import { myContext } from '../PageContext';

function launchIntoFullscreen(element) {
  if (document.fullscreenElement) {
    document.exitFullscreen()
    document.webkitExitFullscreen()
  } else if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
function fullScreenToggle(e) {
  launchIntoFullscreen(e.current)
}

function PointMarker(props) {
  const markerRef = useRef(null)
  const mapContext = useContext(myContext);

  function mapInfo(a) {
  /*  if (mapContext.referringFilter.indexOf(props.item.Type) === -1) {
      let newPull = [...mapContext.referringFilter, props.item.Type]
      mapContext.changeReferringFilter(newPull)
    }
    mapContext.changeReferringFeature(props.item) */
    if (a === null) {}
    else {
    navigate(`#A-${a}`)
  }
  }

  // useEffect(() => {
  //   if (markerRef) {
  //     markerRef.current.leafletElement._icon.classList.add('active')
  //   }
  // },[])
  return (
    <Marker
    ref={markerRef}
    position={[props.item.coordinate[0],props.item.coordinate[1]]}
    icon={icons[props.item.type]}
    class={"active"}
    onClick={() => mapInfo(props.item.id)}
    >
      <Tooltip permanent direction={"bottom"} opacity={"0.8"}>
        <b>{props.item.name}</b>
      </Tooltip>
    </Marker>
  )
}


function PointsLayer(props) {
  return (
    props.mapItems.map((item,index) =>
      <PointMarker
        item={item}
      />
  ))
}

function Setter(props) {
  const { map } = useLeaflet();
  useEffect(() => {
    console.log(props)
  if (props.coordinates == "false" || props.coordinates.length <= 2) {
    let originLatTopLeft = [props.mapItems[0].coordinate[0] - 0.005, props.mapItems[0].coordinate[1] - 0.005]
    let originLatBottomRight = [props.mapItems[0].coordinate[0] + 0.005, props.mapItems[0].coordinate[1] + 0.005]
    let originBounds = [
      originLatTopLeft,
      originLatBottomRight
    ]
    map.fitBounds(originBounds)
  }
  else {
    map.fitBounds(props.coordinates)
  }
},[props.coordinates])

return null

}

function LeafletMap(props) {

  const [mapItems, setMapItems] = useState([])
  const [center, setCenter] = useState([0,0])

  let coordinates = props.coordinates

  const mapRef = useRef(null);
  const mapContRef = useRef(null);




  useEffect(() => {
    if (props.mapItems[0] !== [] && props.mapItems[0].coordinate) {}
    else {
      setCenter([props.mapItems[0].coordinate[0], props.mapItems[0].coordinate[1]])
    }
  },[props.mapItems])






     if (typeof window !== 'undefined') {
      return (
        <div ref={mapContRef} className={leafletMapStyles.container_about}>
          <button className={leafletMapStyles.container_fullscreen} Style="position:absolute; right: .5em; z-index: 999; width: 34px; height: 34px; border: solid 2px #bbb; border-radius: 5px; top: .5em; background: white; font-weight: bold" onClick={() => fullScreenToggle(mapContRef)}>&#x26F6;</button>

          {props.mapItems[0] !== undefined ?
          <Map ref={mapRef} crs={props.crs}>
            {coordinates ? <>
            <Polyline color={'orangered'} positions={coordinates}></Polyline>
            <Marker position={coordinates[coordinates.length - 1]} icon={icons.redIcon}></Marker>
            <Marker position={coordinates[0]} icon={icons.greenIcon}></Marker>

            </>
            : null}

            <TileLayer url='https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/{z}/{x}/{y}.png?key=6oLE6u9HjlkdNwxYkeTDp8wEa9dBq0cs'/>

            <Setter mapItems={props.mapItems} coordinates={coordinates ? coordinates : props.mapItems.length > 1 ? props.mapItems.map(a => [a.coordinate[0],a.coordinate[1]]) : 'false'} />
            <PointsLayer mapItems={props.mapItems}/>
            {/* Map code goes here */}
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
      )
    }
    else {
    return null
  }
}

export default LeafletMap
