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

  useEffect(() => {
    markerRef.current.leafletElement._icon.classList.add('active')
  },[])
  return (
    <Marker
    ref={markerRef}
    position={[props.item.Lat,props.item.Lng]}
    icon={icons[props.item.Type]}
    class={"active"}
    onClick={() => mapInfo(props.item.MapFeatureID)}
    >
      <Tooltip permanent direction={"bottom"} opacity={"0.8"}>
        <b>{props.item.Name} (id:{props.item.MapFeatureID})</b>
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
  if (props.gpx === 'false') {
    let originLat = props.mapItems[0].Lat
    let originLng = props.mapItems[0].Lng
    let originLatTopLeft = [props.mapItems[0].Lat - 0.005, props.mapItems[0].Lng - 0.005]
    let originLatBottomRight = [props.mapItems[0].Lat + 0.005, props.mapItems[0].Lng + 0.005]
    console.log(origin)
    map.fitBounds([originLatTopLeft,originLatBottomRight])
  }
  else {
    map.fitBounds(props.gpx)
  }
},[props.gpx])

return null

}

function LeafletMap(props) {


  const [mapItems, setMapItems] = useState([])
  const [center, setCenter] = useState([0,0])

  const [gpx, setGpx] = useState(props.gpx)

  const mapRef = useRef(null);
  const mapContRef = useRef(null);


  const [crs,setCrs] = useState()


  useEffect(() => {
    if (props.mapItems[0] === undefined) {}
    else {
      setCenter([props.mapItems[0].Lat, props.mapItems[0].Lng])
    }
  },[props.mapItems])

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




     if (typeof window !== 'undefined') {
      return (
        <div ref={mapContRef} className={leafletMapStyles.container_about}>
          <button className={leafletMapStyles.container_fullscreen} Style="position:absolute; right: .5em; z-index: 999; width: 34px; height: 34px; border: solid 2px #bbb; border-radius: 5px; top: .5em; background: white; font-weight: bold" onClick={() => fullScreenToggle(mapContRef)}>&#x26F6;</button>

          {props.mapItems[0] !== undefined ?
          <Map ref={mapRef} crs={crs}>
            {gpx ? <>
            <Polyline color={'orangered'} positions={gpx}></Polyline>
            <Marker position={gpx[gpx.length - 1]} icon={icons.redIcon}></Marker>
            <Marker position={gpx[0]} icon={icons.greenIcon}></Marker>

            </>
            : null}

            <TileLayer url='https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/{z}/{x}/{y}.png?key=6oLE6u9HjlkdNwxYkeTDp8wEa9dBq0cs'/>

            <Setter mapItems={props.mapItems} gpx={gpx ? gpx : props.mapItems.length > 1 ? props.mapItems.map(a => [a.Lat,a.Lng]) : 'false'} />
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
